import React, { memo, FC, useRef } from "react";
import * as d3 from "d3";
import colors from "../../colors";
import { animated, config, useSpring } from "react-spring";

type SplitGaugeSvgProps = {
  innerRadius?: number;
  max: number;
  progress: number;
};

const SplitGaugeSvg: FC<SplitGaugeSvgProps> = ({
  innerRadius = 80,
  progress = 0,
}) => {
  const { x } = useSpring({
    from: { x: 0 },
    to: { x: progress },
    delay: 200,
    config: config.gentle,
  });

  const thickness = 8;
  const width = innerRadius * 3;
  const height = innerRadius * 3;
  const tau = 2 * Math.PI;
  const backgroundArcFraction = 2 / 3;
  const foregroundArcFraction = 3 / 3;
  const backgroundStartAngle = (-1 / 3) * tau;
  const arcBase = {
    innerRadius: innerRadius,
    outerRadius: innerRadius + thickness,
  };

  // cornerRadius has no effect when passed declaratively.
  const backgroundArc = d3.arc().cornerRadius(thickness)({
    ...arcBase,
    startAngle: -tau / 3,
    endAngle: backgroundStartAngle + backgroundArcFraction * tau,
  });

  const foregroundArc = x.to((x) =>
    d3.arc().cornerRadius(thickness)({
      ...arcBase,
      startAngle: 0,
      endAngle: (1 / 3) * tau * foregroundArcFraction * x,
    })
  );

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${width / 2},${height / 2})`}>
        <path style={{ fill: colors.dusk }} d={backgroundArc}></path>
        <animated.path
          style={{ fill: progress > 0 ? colors.spindle : colors.yellow500 }}
          d={foregroundArc}
        ></animated.path>
        <animated.path
          transform={x.to((x) => `rotate(${-90 + x * 120})`)}
          style={{ fill: "white" }}
          d="M -8.19 -2.5 L 0 -2.5 L 81.9 -0.5 L 81.9 0.5 L 0 2.5 L -8.19 2.5 A 1 1 0 0 1 -8.19 -2.5"
        ></animated.path>
      </g>
    </svg>
  );
};

export default memo(SplitGaugeSvg);
