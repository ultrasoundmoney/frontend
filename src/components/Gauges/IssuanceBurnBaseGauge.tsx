import clamp from "lodash/clamp";
import type { StaticImageData } from "next/legacy/image";
import Image from "next/legacy/image";
import type { FC } from "react";
import { useContext } from "react";
import Skeleton from "react-loading-skeleton";
import { animated, config, useSpring } from "@react-spring/web";
import type { Unit } from "../../denomination";
import { FeatureFlagsContext } from "../../feature-flags";
import * as Format from "../../format";
import { WidgetTitle } from "../WidgetSubcomponents";
import dropletSvg from "./droplet.svg";
import flameSvg from "./flame.svg";
import type { GaugeGradientFill } from "./GaugeSvg";
import GaugeSvg from "./GaugeSvg";

type BaseGuageProps = {
  emoji: "flame" | "droplet";
  gaugeUnit: string;
  gradientFill: GaugeGradientFill;
  needleColor?: string;
  title: string;
  unit: Unit;
  value: number | undefined;
  valueUnit: string;
};

const formatValue = (unit: Unit, gaugeUnit: string, value: number): string => {
  const num =
    unit === "eth"
      ? Format.formatZeroDecimals(value)
      : // See the comment at valueScaled for why we divide by 1000 here.
        Format.formatOneDecimal(value / 1000);

  return `${num}${gaugeUnit}`;
};

const IssuanceBurnBaseGauge: FC<BaseGuageProps> = ({
  emoji,
  gaugeUnit,
  gradientFill,
  needleColor,
  title,
  unit,
  value,
  valueUnit,
}) => {
  // We scale the thousands of ETH down to hundreds, and the billions of USD to
  // thousands to make the animation distance small when toggling between them.
  // This prevents the number overshooting by the millions when it tries to
  // animate from some number of billions to some number of thousands. Because
  // USD is in billions and we divide by a million we get thousands, but we'd
  // like to display in single decimals billions. We therefore divide by a
  // thousand again, during formatting, after animation has happened.
  const valueScaled =
    value === undefined
      ? undefined
      : unit === "eth"
      ? value / 1000
      : value / 1_000_000;

  const { valueSpring } = useSpring({
    from: { valueSpring: 0 },
    to: {
      valueSpring: valueScaled,
    },
    delay: 200,
    config: config.gentle,
  });

  const min = 0;
  const max = unit === "eth" ? 6000000 : 10_000_000_000;

  const progress = clamp(value ?? 0, min, max) / (max - min);

  const { previewSkeletons } = useContext(FeatureFlagsContext);

  return (
    <>
      <WidgetTitle>{title}</WidgetTitle>
      <div className="mt-6 scale-90 lg:scale-100">
        <GaugeSvg
          gradientFill={gradientFill}
          needleColor={needleColor}
          progress={progress}
        />
        <div
          className={`
            -mt-[60px] text-center font-roboto text-3xl
            font-light
          `}
        >
          {value === undefined || previewSkeletons ? (
            <div className="-mb-2">
              <Skeleton inline width="28px" />
              <span>{gaugeUnit}</span>
            </div>
          ) : (
            <animated.p
              className={`
              -mb-2 bg-gradient-to-r bg-clip-text
              text-transparent
              ${
                title === "burn"
                  ? "from-orange-400 to-yellow-300"
                  : "from-cyan-300 to-indigo-500"
              }
              `}
            >
              {valueSpring.to(formatValue.bind(null, unit, gaugeUnit))}
            </animated.p>
          )}
        </div>
      </div>
      <p className="mt-[7px] mb-2.5 select-none font-roboto text-xs font-light text-slateus-200">
        {valueUnit}
      </p>
      {emoji === "flame" ? (
        <Image
          alt="image of a flame signifying ETH burned"
          height={24}
          src={flameSvg as StaticImageData}
          width={24}
        ></Image>
      ) : emoji === "droplet" ? (
        <Image
          alt="image of a droplet signifying ETH issued"
          height={24}
          src={dropletSvg as StaticImageData}
          width={24}
        ></Image>
      ) : null}
    </>
  );
};

export default IssuanceBurnBaseGauge;
