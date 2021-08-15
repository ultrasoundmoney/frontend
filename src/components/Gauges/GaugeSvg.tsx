import React, { memo, FC } from "react";
import * as d3 from "d3";
import { animated, config, useSpring } from "react-spring";
import colors from "../../colors";

type GaugeSvgProps = {
  innerRadius?: number;
  progress: number;
  progressFillColor?: string;
  needleColor?: string;
};

const GaugeSvg: FC<GaugeSvgProps> = ({
  innerRadius = 80,
  progress = 0,
  progressFillColor = colors.spindle,
  needleColor = "white",
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
  const arcFraction = 2 / 3;
  const arcStartAngle = (-1 / 3) * tau;
  const arcBase = {
    innerRadius: innerRadius,
    outerRadius: innerRadius + thickness,
    startAngle: -tau / 3,
  };

  // cornerRadius has no effect when passed declaratively.
  const backgroundArc = d3.arc().cornerRadius(thickness)({
    ...arcBase,
    endAngle: arcStartAngle + arcFraction * tau,
  });

  const foregroundArc = x.to((x) =>
    d3.arc().cornerRadius(thickness)({
      ...arcBase,
      endAngle: arcStartAngle + arcFraction * tau * x,
    })
  );

  const needlePath = "M 0 -4 L 64 0 L 64 0 L 0 4 A 1 1 0 0 1 0 -4";

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${width / 2},${height / 2})`}>
        <path style={{ fill: colors.dusk }} d={backgroundArc}></path>
        <animated.path
          style={{ fill: progressFillColor }}
          d={foregroundArc}
        ></animated.path>
        <animated.path
          transform={x.to((x) => `rotate(${-210 + x * arcFraction * 360})`)}
          style={{ fill: needleColor }}
          d={needlePath}
        ></animated.path>
      </g>
    </svg>
  );
};

export default memo(GaugeSvg);
