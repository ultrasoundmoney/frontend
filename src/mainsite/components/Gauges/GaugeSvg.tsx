import * as d3 from "d3-shape";
import type { FC } from "react";
import { animated, config, useSpring } from "@react-spring/web";
import colors from "../../../colors";

export type GaugeGradientFill = "orange" | "blue";

type GaugeSvgProps = {
  gradientFill?: GaugeGradientFill;
  innerRadius?: number;
  matteFill?: string;
  needleColor?: string;
  progress: number;
};

const getFillColor = (
  progressFillColor: string | undefined,
  gradientFillColor: string | undefined,
) =>
  progressFillColor !== undefined
    ? progressFillColor
    : gradientFillColor !== undefined
    ? `url(#${gradientFillColor}-gradient-base-gauge)`
    : colors.slateus200;

const tau = 2 * Math.PI;
const thickness = 11;
const innerRadius = 80;
const width = 2 * (innerRadius + thickness);
const height = 2 * (innerRadius + thickness);
// Portion of a full circle which is filled by the gauge.
const arcFraction = 2 / 3;
const arcStartAngle = -tau / 3;

const arcGen = d3.arc().cornerRadius(thickness);

// Config to render the arc with the endAngle still missing.
const arcBase: Omit<d3.DefaultArcObject, "endAngle"> = {
  innerRadius: innerRadius,
  outerRadius: innerRadius + thickness,
  startAngle: arcStartAngle,
};

// Inputs are static, no reason to fear output would suddenly be null.
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const backgroundArc = arcGen({
  ...arcBase,
  endAngle: arcStartAngle + arcFraction * tau,
})!;

const arcPathFromProgress = (progress: number): string =>
  arcGen({
    ...arcBase,
    endAngle: arcStartAngle + arcFraction * tau * progress,
  }) ?? "";

const GaugeSvg: FC<GaugeSvgProps> = ({
  progress = 0,
  matteFill: progressFillColor,
  gradientFill: gradientFillColor,
  needleColor = "white",
}) => {
  const { progressSpring } = useSpring({
    from: { progressSpring: 0 },
    to: { progressSpring: progress },
    delay: 200,
    config: config.gentle,
  });

  const fillColor = getFillColor(progressFillColor, gradientFillColor);

  return (
    <svg width={width} height={height}>
      <defs>
        {/* The linearGradient definitions somehow inherit the display: none CSS of their sibling gauges with the same id, hiding them on the split gauge too. We need to use unique IDs for the different gauges. */}
        <linearGradient y1="1" id="orange-gradient-base-gauge">
          <stop offset="0%" stopColor="#E79800" />
          <stop offset="100%" stopColor="#EDDB36" />
        </linearGradient>
        <linearGradient id="blue-gradient-base-gauge">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <g transform={`translate(${width / 2},${height / 2})`}>
        <path style={{ fill: colors.slateus500 }} d={backgroundArc}></path>
        <animated.path
          d={progressSpring.to(arcPathFromProgress)}
          fill={fillColor}
        ></animated.path>
        <animated.path
          transform={progressSpring.to(
            (x) => `rotate(${-210 + x * arcFraction * 360})`,
          )}
          style={{ fill: needleColor }}
          d="M 0 -4 L 64 0 L 64 0 L 0 4 A 1 1 0 0 1 0 -4"
        ></animated.path>
      </g>
    </svg>
  );
};

export default GaugeSvg;
