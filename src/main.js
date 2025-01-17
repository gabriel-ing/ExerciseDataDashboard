import { getData } from "./dataDownload";
import { menu } from "./menu.js";
import { scatterPlot } from "./Scatterplot-trc";
import * as d3 from "d3";
import { barChart } from "./barChart-trc.js";
import { getDistancePerWeek } from "./getWeeklyData.js";
import { createMap } from "./createMap.js";

let yearValue = "all";
let activityValue = "all";

const menuContainer = d3.select("#header");

const xMenu = menuContainer.append("div").attr("class", "menu");
const yMenu = menuContainer.append("div").attr("class", "menu");

const yearOptions = [
  { value: "all", text: "All" },
  { value: 2025, text: 2025 },
  { value: 2024, text: 2024 },
  { value: 2023, text: 2023 },
  { value: 2022, text: 2022 },
  { value: 2021, text: 2021 },
  { value: 2020, text: 2020 },
  { value: 2019, text: 2019 },
  { value: 2018, text: 2018 },
];
const activityTypeOptions = [
  { value: "all", text: "All" },
  { value: "Run", text: "Running" },
  { value: "Ride", text: "Cycling" },
  { value: "Walk", text: "Walking" },
];

const scatterplot = d3.select("#chart1").append("svg");
const barChartSelection = d3.select("#chart2").append("svg");

async function main() {
  let data = await getData();
  //console.log(data);
  //   console.log(data);
  //   console.log("change");
  const plot1 = scatterPlot()
    .width(1000)
    .height(500)
    .data(data)
    .xValue((d) => d.start_date)
    .yValue((d) => d.distance / 1000)
    .xType("time")
    .margin({ top: 50, right: 50, bottom: 50, left: 80 })
    .radius(5)
    .xLabel("Date")
    .yLabel("Distance")
    .tooltipValue(
      (d) =>
        `<h4>${d.name}</h4><p>${(d.distance / 1000).toFixed(
          1
        )}km<br>${d.start_date.toDateString()} `
    )
    .colorValue((d) => d.sport_type)
    .additionalClickFunction((event, d) => {
      d3.select("#map").remove();
      d3.select("body")
        .append("div")
        .attr("id", "map")
        .style("top", `${event.pageY +5}px`)
        .style("left", `${event.pageX  -205}px`);
      console.log(`${event.pageX + 5}px`);
      createMap(d.summary_polyline, "map");
    });
  scatterplot.call(plot1);

  let weeklyDistanceData = getDistancePerWeek(data, "all", "all");
  //console.log("weekly data", weeklyDistanceData);

  const bc = barChart()
    .width(1000)
    .height(500)
    .data(weeklyDistanceData)
    .yValue((d) => d.distance / 1000)
    .xValue((d) => d.week)
    .yLabel("Distance tracked (km)")
    .xLabel("Week of Year");

  barChartSelection.call(bc);

  xMenu.call(
    menu()
      .id("x-menu")
      .labelText("Year:")
      .options(yearOptions)
      .on("change", (value) => {
        console.log(value);
        yearValue = value;
        if (value != "all") {
          plot1.filterOne((d) => d.start_date.getFullYear() === +value);
        } else {
          plot1.filterOne(null);
        }
        scatterplot.call(plot1);
        weeklyDistanceData = getDistancePerWeek(data, yearValue, activityValue);
        bc.data(weeklyDistanceData);
        barChartSelection.call(bc);
      })
  );

  yMenu.call(
    menu()
      .id("y-menu")
      .labelText("Activity Type:")
      .options(activityTypeOptions)
      .on("change", (value) => {
        activityValue = value;
        if (value != "all") {
          plot1.filterTwo((d) => d.sport_type === value);
        } else {
          plot1.filterTwo(null);
        }
        scatterplot.call(plot1);
        weeklyDistanceData = getDistancePerWeek(data, yearValue, activityValue);
        bc.data(weeklyDistanceData);
        barChartSelection.call(bc);
      })
  );
  //   console.log(data[0].map.summary_polyline);
}

main();
