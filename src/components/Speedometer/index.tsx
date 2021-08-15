import React, { memo, FC, useRef, useEffect } from "react";
import * as d3 from "d3";

const blueManatee = "rbg(136, 136, 175)";
const blueSpindle = "rgb(181, 189, 219)";

const Speedometer: FC = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    console.log("svg effect");
    console.log("updating svg!");
    const tau = 2 * Math.PI;
    const thickness = 8;
    const innerRadius = 80;
    const arcLength = (2 / 3) * tau;
    const arcStartAngle = (-1 / 3) * tau;
    const progress = 0.7;
    const arc = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(innerRadius + thickness)
      .startAngle(-tau / 3)
      .cornerRadius(thickness);

    const svg = d3.select(svgRef.current);
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const g = svg
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // background
    g.append("path")
      .datum({ endAngle: arcStartAngle + arcLength })
      .style("fill", blueManatee)
      .attr("d", arc);

    // foreground
    g.append("path")
      .datum({ endAngle: arcStartAngle + arcLength * progress })
      .style("fill", blueSpindle)
      .attr("d", arc);
  }, []);

  return (
    <div className="bg-blue-tangaroa w-full rounded-lg p-8">
      <svg
        width="300"
        height="300"
        style={{ border: "2px solid white" }}
        ref={svgRef}
      ></svg>
    </div>
  );
};

export default memo(Speedometer);
//
