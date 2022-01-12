import React, { memo, FC } from "react";
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
  const stylesBlue = useSpring({
    opacity: progress > 0 ? 1 : 0,
    delay: 200,
    config: config.gentle,
  });
  const stylesOrange = useSpring({
    opacity: progress > 0 ? 0 : 1,
    delay: 200,
    config: config.gentle,
  });

  const thickness = 8;
  const width = 2 * (innerRadius + thickness);
  const height = 2 * (innerRadius + thickness);
  const tau = 2 * Math.PI;
  const backgroundArcFraction = 2 / 3;
  const foregroundArcFraction = 3 / 3;
  const backgroundStartAngle = (-1 / 3) * tau;
  const arcBase = {
    innerRadius: innerRadius,
    outerRadius: innerRadius + thickness,
  };

  // cornerRadius has no effect when passed declaratively.
  const backgroundArc =
    d3.arc().cornerRadius(thickness)({
      ...arcBase,
      startAngle: -tau / 3,
      endAngle: backgroundStartAngle + backgroundArcFraction * tau,
    }) ?? undefined;

  const foregroundArc = x.to(
    (x) =>
      d3.arc().cornerRadius(thickness)({
        ...arcBase,
        startAngle: 0,
        endAngle: (1 / 3) * tau * foregroundArcFraction * x,
      }) ?? ""
  );

  const needlePath = "M 0 -4 L 64 0 L 64 0 L 0 4 A 1 1 0 0 1 0 -4";

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${width / 2},${height / 2})`}>
        <path style={{ fill: colors.dusk }} d={backgroundArc}></path>
        <animated.path
          style={{ fill: colors.drop }}
          opacity={stylesBlue.opacity}
          d={foregroundArc}
        ></animated.path>
        <animated.path
          style={{ fill: colors.fireOrange }}
          opacity={stylesOrange.opacity}
          d={foregroundArc}
        ></animated.path>
        <animated.path
          transform={x.to((x) => `rotate(${-90 + x * 120})`)}
          opacity={stylesBlue.opacity}
          style={{ fill: colors.drop }}
          d={needlePath}
        ></animated.path>
        <animated.path
          transform={x.to((x) => `rotate(${-90 + x * 120})`)}
          opacity={stylesOrange.opacity}
          style={{ fill: colors.fireOrange }}
          d={needlePath}
        ></animated.path>
      </g>
    </svg>
  );
};

export default SplitGaugeSvg;
