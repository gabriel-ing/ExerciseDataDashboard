(function () {
  'use strict';

  async function getData() {
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
        console.log(result);
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
          console.log("data downloaded");
        }
      }
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function Transform(k, x, y) {
    this.k = k;
    this.x = x;
    this.y = y;
  }

  Transform.prototype = {
    constructor: Transform,
    scale: function(k) {
      return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
    },
    translate: function(x, y) {
      return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
    },
    apply: function(point) {
      return [point[0] * this.k + this.x, point[1] * this.k + this.y];
    },
    applyX: function(x) {
      return x * this.k + this.x;
    },
    applyY: function(y) {
      return y * this.k + this.y;
    },
    invert: function(location) {
      return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
    },
    invertX: function(x) {
      return (x - this.x) / this.k;
    },
    invertY: function(y) {
      return (y - this.y) / this.k;
    },
    rescaleX: function(x) {
      return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
    },
    rescaleY: function(y) {
      return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
    },
    toString: function() {
      return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
    }
  };

  new Transform(1, 0, 0);

  Transform.prototype;

  async function main(){
      let data = await getData();
      console.log(data);
  }

  main();

})();
//# sourceMappingURL=bundle.js.map
