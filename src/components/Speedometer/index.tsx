import React, { memo, FC, useRef, useEffect } from "react";
import * as d3 from "d3";
import colors from "../../colors";

type SpeedometerProps = {
  progress: number;
};

const Speedometer: FC<SpeedometerProps> = ({ progress }) => {
  const svgRef = useRef(null);
  const thickness = 8;
  const innerRadius = 100;

  useEffect(() => {
    const tau = 2 * Math.PI;
    const arcFraction = 2 / 3;
    const arcStartAngle = (-1 / 3) * tau;
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
      .datum({ endAngle: arcStartAngle + arcFraction * tau })
      .style("fill", colors.dusk)
      .attr("d", arc);

    // foreground
    g.append("path")
      .datum({ endAngle: arcStartAngle + arcFraction * tau * progress })
      .style("fill", colors.spindle)
      .attr("d", arc);

    // needle
    g.append("path")
      .attr(
        "d",
        "M -8.19 -2.5 L 0 -2.5 L 81.9 -0.5 L 81.9 0.5 L 0 2.5 L -8.19 2.5 A 1 1 0 0 1 -8.19 -2.5"
      )
      .style("fill", "white")
      .attr(
        "transform",
        "rotate(" + (-210 + progress * arcFraction * 360) + ")"
      );
  }, [progress]);

  return (
    <div className="bg-blue-tangaroa w-full rounded-lg p-8">
      <svg width="300" height="300" ref={svgRef}></svg>
    </div>
  );
};

export default memo(Speedometer);
