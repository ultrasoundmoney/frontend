// Rendering the D3 arc paths on the server vs the safari client results in a different path. We ignore the hydration warning.

import * as d3 from "d3-shape";
import type { FC } from "react";
import { animated, config, useSpring } from "@react-spring/web";
import colors from "../../colors";

type SplitGaugeSvgProps = {
  innerRadius?: number;
  max: number;
  progress: number;
};

const tau = 2 * Math.PI;
const thickness = 11;
const innerRadius = 80;
const width = 2 * (innerRadius + thickness);
const height = 2 * (innerRadius + thickness);
const backgroundArcFraction = 2 / 3;
const foregroundArcFraction = 3 / 3;
const backgroundStartAngle = (-1 / 3) * tau;
const arcBase = {
  innerRadius: innerRadius,
  outerRadius: innerRadius + thickness,
};
const arcGen = d3.arc().cornerRadius(thickness);
const backgroundArc =
  arcGen({
    ...arcBase,
    startAngle: -tau / 3,
    endAngle: backgroundStartAngle + backgroundArcFraction * tau,
  }) ?? "";
const arcPathFromProgress = (progress: number) =>
  arcGen({
    ...arcBase,
    startAngle: 0,
    endAngle: (1 / 3) * tau * foregroundArcFraction * progress,
  }) ?? "";
const needlePath = "M 0 -4 L 64 0 L 64 0 L 0 4 A 1 1 0 0 1 0 -4";
const rotationFromProgress = (progress: number) =>
  `rotate(${-90 + progress * 120})`;

const SplitGaugeSvg: FC<SplitGaugeSvgProps> = ({ progress = 0 }) => {
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

  return (
    <svg width={width} height={height}>
      <defs>
        {/* The linearGradient definitions somehow inherit the display: none CSS of their sibling gauges with the same id, hiding them on the split gauge too. We need to use unique IDs for the different gauges. */}
        <linearGradient id="orange-gradient-split-gauge">
          <stop offset="0%" stopColor="#F4DD0C" />
          <stop offset="100%" stopColor="#F4900C" />
        </linearGradient>
        <linearGradient id="blue-gradient-split-gauge">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <g transform={`translate(${width / 2},${height / 2})`}>
        <path style={{ fill: colors.slateus500 }} d={backgroundArc}></path>
        <animated.path
          d={x.to(arcPathFromProgress)}
          fill="url(#blue-gradient-split-gauge)"
          opacity={stylesBlue.opacity}
        ></animated.path>
        <animated.path
          d={x.to(arcPathFromProgress)}
          fill="url(#orange-gradient-split-gauge)"
          opacity={stylesOrange.opacity}
        ></animated.path>
        <animated.path
          d={needlePath}
          opacity={stylesBlue.opacity}
          style={{ fill: "#67e8f9" }}
          transform={x.to(rotationFromProgress)}
        ></animated.path>
        <animated.path
          transform={x.to(rotationFromProgress)}
          opacity={stylesOrange.opacity}
          style={{ fill: colors.orange400 }}
          d={needlePath}
        ></animated.path>
      </g>
    </svg>
  );
};

export default SplitGaugeSvg;
