import * as d3 from "d3";

export const scatterPlot = () => {
  let width;
  let height;
  let data;
  let yValue;
  let xValue;
  let margin = { top: 50, right: 50, bottom: 80, left: 50 };
  let radius = 5;
  let colorValue;
  let colorList = [
    "#00b894",
    "#6c5ce7",
    "#fdcb6e",
    "#e17055",
    "#00cec9",
    "#d63031",
    "#e84393",
    "#0984e3",
  ];
  let xLabel;
  let yLabel;
  let tooltipValue = (d) => null;
  let tooltip;
  let xType;
  let yType;
  let x;
  let y;
  let filterOne = null;
  let filterTwo = null;
  let additionalClickFunction = (event, d) => null;
  let backgroundOnClick = () => null;

  const my = (selection) => {
    selection.attr("width", width).attr("height", height);

    console.log(selection);
    const backgroundRect = selection
      .selectAll(".backgroundRect")
      .data([null])
      .join("rect")
      .attr("class", "backgroundRect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "white")
      .attr("opacity", 0)
      .on("click", backgroundOnClick);
    console.log(backgroundRect);
    //console.log(data);
    let filteredData = data;

    if (filterOne) {
      filteredData = filteredData.filter(filterOne);
    }
    if (filterTwo) {
      filteredData = filteredData.filter(filterTwo);
    }
    if (tooltipValue(filteredData[0])) {
      tooltip = d3.select("body").append("div").attr("id", "tooltip");
      const tooltipStyles = {
        position: "absolute",
        opacity: "0",
        background: "white",
        border: "1px solid black",
        padding: "2px",
        "border-radius": "5px",
        "font-size": "11px",
        "line-height": "12px",
      };
      Object.entries(tooltipStyles).forEach(([prop, value]) =>
        tooltip.style(prop, value)
      );
    }
    //console.log(filteredData);
    //create x and y scales using the
    // xValue and yValue functions defined above
    // Top version is the axis defined by the data range, bottom starts from zero.

    //create object with just the x and y values

    //console.log(data.map(xValue));
    if (xType === "category") {
      x = d3
        .scalePoint()
        .domain(filteredData.map(xValue))
        .range([margin.left, width - margin.right])
        .padding(0.2);
    }
    if (xType === "time") {
      x = d3
        .scaleTime()
        .domain(d3.extent(filteredData, xValue))
        .range([margin.left, width - margin.right]);
    } else {
      x = d3
        .scaleLinear()
        .domain([d3.min(filteredData, xValue), d3.max(filteredData, xValue)])
        .range([margin.left, width - margin.right]);
    }

    if (yType === "category") {
      y = d3
        .scalePoint()
        .domain(filteredData.map(yValue))
        .range([height - margin.bottom, margin.top])
        .padding(0.2);
    } else {
      y = d3
        .scaleLinear()
        .domain([0, d3.max(filteredData, yValue)])
        .range([height - margin.bottom, margin.top]);
    }
    /* 
        const x = d3
        .scaleLinear()
        .domain(d3.extent(data, xValue))
        .range([margin.left, width - margin.right]);

        const y = d3
        .scaleLinear()
        .domain(d3.extent(data, yValue))
        .range([height - margin.bottom, margin.top]);
        
        
        */

    const colorScale = d3
      .scaleOrdinal()
      .domain(filteredData.map(colorValue))
      .range(colorList);

    // marks.x = x(marks.x);
    // marks.y = y(marks.y) ;
    // marks.color = colorScale(marks.color);

    const marks = filteredData.map((d) => ({
      x: x(xValue(d)),
      y: y(yValue(d)),
      r: radius,
      color: colorScale(colorValue(d)),
      tooltip: tooltipValue(d),
      summary_polyline: d.map.summary_polyline,
    }));

    const t = d3.transition().duration(1000);
    //console.log(data);
    //console.log(marks);
    const circles = selection
      .selectAll(".pointCircles")
      .data(marks)
      .join(
        (enter) =>
          enter
            .append("circle")
            .attr("class", "pointCircles")
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y)
            .attr("fill", (d) => d.color)
            .attr("stroke", "black")
            .attr("stroke-width", 0.5)
            .attr("r", 0)
            .on("mouseover", (event, d) => {
              if (d.tooltip) {
                tooltip = d3.select("#tooltip");
                tooltip
                  .html(d.tooltip)
                  .style("left", `${event.pageX + 5}px`)
                  .style("top", `${event.pageY - 28}px`);
                tooltip.transition().duration(200).style("opacity", 0.9);
              }
            })
            .on("mouseout", (event, d) => {
              if (d.tooltip) {
                tooltip = d3.select("#tooltip");
                tooltip.transition().duration(200).style("opacity", 0);
              }
            })
            .on("click", (event, d) => {
              additionalClickFunction(event, d);
            })
            .call((enter) => enter.transition(t).attr("r", (d) => d.r)),
        (update) =>
          update.call((update) =>
            update
              .transition(t)
              .delay((d, i) => i * 8)
              .attr("cx", (d) => d.x)
              .attr("cy", (d) => d.y)
              .attr("fill", (d) => d.color)
          ),
        (exit) => exit.remove()
      );

    //  .join("circle")
    //  .attr("class", "pointCircles")
    //  .attr("cx", (d) => d.x)
    //  .attr("cy", (d) => d.y)
    //  .attr("r", (d) => d.r)
    //  .attr("fill", (d) => d.color)
    //  .attr("stroke", "black")
    //  .attr("stroke-width", 0.5);

    selection
      .selectAll("g.yAxis")
      .data([null])
      .join("g")
      .attr("class", "yAxis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    selection
      .selectAll("g.xAxis")
      .data([null])
      .join("g")
      .attr("class", "xAxis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .transition(t)
      .call(d3.axisBottom(x));

    selection
      .selectAll(".xAxisLabel")
      .data([0])
      .join("text")
      .attr("class", "xAxisLabel axisLabel")
      .attr("text-anchor", "middle")
      .attr("x", margin.left + (width - margin.left - margin.right) / 2)
      .attr("y", height - margin.bottom / 3)
      .text(xLabel);

    selection
      .selectAll(".yAxisLabel")
      .data([0])
      .join("text")
      .attr("class", "yAxisLabel axisLabel")
      .attr("x", margin.left / 3)
      .attr("y", height / 2)
      .attr("text-anchor", "middle")
      .attr("transform", `rotate(-90, ${margin.left / 3}, ${height / 2})`)
      .text(yLabel);

    // selection
    // .append("rect")
    // .attr("width", width)
    // .attr("height", height)
    // .attr("opacity", 0)
    // .on("click", () => {
    //     d3.select("#map").remove();
    // });
  };

  my.width = function (_) {
    return arguments.length ? ((width = +_), my) : width;
  };

  my.height = function (_) {
    return arguments.length ? ((height = +_), my) : width;
  };
  my.data = function (_) {
    return arguments.length ? ((data = _), my) : data;
  };

  my.xValue = function (_) {
    return arguments.length ? ((xValue = _), my) : xValue;
  };

  my.yValue = function (_) {
    return arguments.length ? ((yValue = _), my) : yValue;
  };
  my.margin = function (_) {
    return arguments.length ? ((margin = _), my) : margin;
  };
  my.radius = function (_) {
    return arguments.length ? ((radius = +_), my) : radius;
  };
  my.colorValue = function (_) {
    return arguments.length ? ((colorValue = _), my) : colorValue;
  };
  my.colorList = function (_) {
    return arguments.length ? ((colorList = _), my) : colorList;
  };
  my.tooltipValue = function (_) {
    return arguments.length ? ((tooltipValue = _), my) : tooltipValue;
  };
  my.xLabel = function (_) {
    return arguments.length ? ((xLabel = _), my) : xLabel;
  };
  my.yLabel = function (_) {
    return arguments.length ? ((yLabel = _), my) : yLabel;
  };
  my.xType = function (_) {
    return arguments.length ? ((xType = _), my) : xType;
  };
  my.yType = function (_) {
    return arguments.length ? ((yType = _), my) : yType;
  };
  my.filterOne = function (_) {
    return arguments.length ? ((filterOne = _), my) : filterOne;
  };
  my.filterTwo = function (_) {
    return arguments.length ? ((filterTwo = _), my) : filterTwo;
  };
  my.additionalClickFunction = function (_) {
    return arguments.length
      ? ((additionalClickFunction = _), my)
      : additionalClickFunction;
  };
  my.backgroundOnClick = function (_) {
    return arguments.length ? ((backgroundOnClick = _), my) : backgroundOnClick;
  };
  return my;
};
