import * as d3 from "d3";

export const weeklyActivityPlot = () => {
  let width;
  let height;
  let data;
  let yValue;
  let xValue;
  let margin = { top: 50, right: 50, bottom: 80, left: 50 };

  const my = (selection) => {
    const squares = selection
      .selectAll(".squares")
      .append("rect")
      .attr("width", "15px")
      .attr("height", "15px")
      ;
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
};
