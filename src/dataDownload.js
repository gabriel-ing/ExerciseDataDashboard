const parseRow = (d) => {
  d.start_date = new Date(d.start_date);
  return d} 

export async function getData() {
  const authUrl = "https://www.strava.com/oauth/token";
  const payload = {
    client_id: "129255",
    client_secret: "3681592542e4b0c070643fc43372913f3bd92bf0",
    refresh_token: "295121019eb432cfce9119e1da31d1784e0d17b2",
    grant_type: "refresh_token",
    f: "json",
  };

  let data = [];
  try {
    const tokenResponse = await fetch(authUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // console.log(tokenResponse);
    const accessToken = await tokenResponse.json();
    // console.log(accessToken.access_token);

    let allDataDownloaded = false;
    let pageNumber = 1;
    while (!allDataDownloaded) {
      // const url = new URL(activitiesUrl);
      // const params = new URLSearchParams({ per_page: '200', page: pageNumber.toString() });
      // url.search = params.toString()
      // console.log(url.toString());
      // const searchUrl =
      const activityRequest = new Request(
        `https://www.strava.com/api/v3/athlete/activities?per_page=200&page=${pageNumber}`,
        {
          method: "GET",
          headers: { Authorization: "Bearer " + accessToken.access_token },
        }
      );
      const result = await fetch(activityRequest);
      if (!result.ok) {
        throw new Error(`Response status: ${result.status}`);
        return 0;
      }
      const newData = await result.json();
      data = data.concat(newData);
      //console.log(data);
      pageNumber += 1;
      if (newData.length < 200) {
        allDataDownloaded = true;
        // console.log("data downloaded");
      }
    }

    data.map(parseRow);

    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}
