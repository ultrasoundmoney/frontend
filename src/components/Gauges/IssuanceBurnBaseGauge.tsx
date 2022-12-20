import clamp from "lodash/clamp";
import type { StaticImageData } from "next/legacy/image";
import Image from "next/legacy/image";
import type { FC } from "react";
import { useContext } from "react";
import Skeleton from "react-loading-skeleton";
import { animated, config, useSpring } from "react-spring";
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
  const { valueA } = useSpring({
    from: { valueA: 0 },
    to: { valueA: value },
    delay: 200,
    config: config.gentle,
  });

  const min = 0;
  const max =
    unit === "eth"
      ? // thousands of ETH
        6000
      : // Billions of USD
        10;

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
              {valueA.to(
                (n) =>
                  `${
                    unit === "eth"
                      ? Format.formatZeroDecimals(n)
                      : Format.formatOneDecimal(n)
                  }${gaugeUnit}`,
              )}
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
