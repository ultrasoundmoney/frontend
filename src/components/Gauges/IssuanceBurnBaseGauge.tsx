import clamp from "lodash/clamp";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import type { FC } from "react";
import { useContext } from "react";
import Skeleton from "react-loading-skeleton";
import { animated, config, useSpring } from "react-spring";
import type { EthPriceStats } from "../../api/eth-price-stats";
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
  ethPriceStats: EthPriceStats;
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
      ? // millions of ETH
        6
      : // Billions of USD
        10;

  const progress = clamp(value ?? 0, min, max) / (max - min);

  const { previewSkeletons } = useContext(FeatureFlagsContext);

  return (
    <>
      <WidgetTitle>{title}</WidgetTitle>
      <div className="mt-8 scale-90 lg:scale-100">
        <GaugeSvg
          gradientFill={gradientFill}
          needleColor={needleColor}
          progress={progress}
        />
        <div
          className="font-roboto text-white text-center font-light text-3xl -mt-[60px]"
          style={{ color: needleColor }}
        >
          {value === undefined || previewSkeletons ? (
            <div className="-mb-2">
              <Skeleton inline width="28px" />
              <span>{gaugeUnit}</span>
            </div>
          ) : (
            <animated.p className="-mb-2">
              {valueA.to(
                (n) =>
                  `${
                    unit === "eth"
                      ? Format.formatOneDecimal(n)
                      : Format.formatZeroDecimals(n)
                  }${gaugeUnit}`,
              )}
            </animated.p>
          )}
        </div>
      </div>
      <p className="font-roboto font-light text-xs text-blue-spindle select-none mt-[7px] mb-2.5">
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
