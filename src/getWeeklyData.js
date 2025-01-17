function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return weekNo;
}

export function getDistancePerWeek(data, year = "all", activityType = "all") {
  let filteredData = data;

  filteredData.map((d) => {
    d.start_year = d.start_date.getFullYear();
    d.start_week = getWeekNumber(d.start_date);
    return d;
  });

  if (year!="all") {
    filteredData = filteredData.filter((d)=>d.start_year===+year);
  }
  if (activityType!="all") {
    filteredData = filteredData.filter((d)=>d.sport_type===activityType);
  }
  const result = Object.groupBy(filteredData, ({ start_week }) => start_week);

  let distancePerWeek = [];
//Object.keys(result).forEach((key) => {
    //console.log(key, result[key])
//console.log(Object.keys(result));
for (let i=1; i<53; i++){
    if (Object.keys(result).includes(String(i))){
    // console.log(i);
    distancePerWeek.push({
      week: i,
      distance: result[i
      ].reduce(
        (accumulator, currentValue) => accumulator + +currentValue.distance,
        0
      ),})}
    else{
        distancePerWeek.push({week:i, distance:0})
    }
    };
    
  

  return distancePerWeek;
}
