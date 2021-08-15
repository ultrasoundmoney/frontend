import React, { memo, FC } from "react";
import * as d3 from "d3";

let blueManatee = "rbg(136, 136, 175)";
let blueSpindle = "rgb(181, 189, 219)";

const Speedometer: FC = () => {
  let tau = 2 * Math.PI
  let width = 8
  let innerRadius = 80
  let arcLength = 2/3*tau
  let arcStartAngle = -1/3*tau
  let progress = 0.7

  let arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(innerRadius + width)
    .startAngle(-tau/3)
    .cornerRadius(width);

  let svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  let background = g.append("path")
    .datum({endAngle:arcStartAngle + arcLength})
    .style("fill", blueManatee)
    .attr("d", arc)

  let foreground = g.append("path")
    .datum({endAngle: arcStartAngle + arcLength * progress})
    .style("fill", blueSpindle)
    .attr("d", arc)

  return (
    <div className="bg-blue-tangaroa w-full rounded-lg p-8">
      <svg
        width="300"
        height="300"
        style={{border: "2px solid white"}}
      ></svg>
    </div>
  );
};




export default memo(Speedometer);
//