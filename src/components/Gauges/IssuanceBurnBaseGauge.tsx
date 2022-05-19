import { clamp } from "lodash";
import { FC, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import { animated, config, useSpring } from "react-spring";
import { useGroupedAnalysis1 } from "../../api/grouped-analysis-1";
import { Unit } from "../../denomination";
import { FeatureFlagsContext } from "../../feature-flags";
import { formatOneDigit, formatZeroDigit } from "../../format";
import { pipe } from "../../fp";
import Twemoji from "../Twemoji";
import GaugeSvg, { GaugeGradientFill } from "./GaugeSvg";

type BaseGuageProps = {
  emoji: string;
  gaugeUnit: string;
  needleColor?: string;
  title: string;
  value: number | undefined;
  gradientFill: GaugeGradientFill;
  valueUnit: string;
  unit: Unit;
};

const IssuanceBurnBaseGauge: FC<BaseGuageProps> = ({
  emoji,
  gaugeUnit,
  needleColor,
  title,
  value,
  gradientFill,
  valueUnit,
  unit,
}) => {
  const ethPrice = useGroupedAnalysis1()?.ethPrice;

  const { valueA } = useSpring({
    from: { valueA: 0 },
    to: { valueA: value },
    delay: 200,
    config: config.gentle,
  });

  const min = 0;
  const max = pipe(
    unit === "eth"
      ? 10
      : ethPrice === undefined
      ? 0
      : (10 * ethPrice.usd) / 10 ** 3,
    (max) => Math.max(max, unit === "eth" ? 10 : 20 ?? 0),
    Math.round,
  );

  const progress = clamp(value ?? 0, min, max) / (max - min);

  const { previewSkeletons } = useContext(FeatureFlagsContext);

  return (
    <>
      <Twemoji className="h-10 w-10 select-none" wrapper>
        {emoji}
      </Twemoji>
      <div className="mt-6 md:mt-2 lg:mt-8 transform scale-100 md:scale-75 lg:scale-100 xl:scale-110">
        <GaugeSvg
          gradientFill={gradientFill}
          needleColor={needleColor}
          progress={progress}
        />
        <div className="font-roboto text-white text-center font-light 2xl:text-lg -mt-20 pt-1">
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
                    unit === "eth" ? formatOneDigit(n) : formatZeroDigit(n)
                  }${gaugeUnit}`,
              )}
            </animated.p>
          )}
          <p className="font-extralight text-blue-spindle">{valueUnit}</p>
          <div className="-mt-2">
            <span className="float-left">
              {min}
              {gaugeUnit}
            </span>
            <span className="float-right">
              {max}
              {gaugeUnit}
            </span>
          </div>
        </div>
      </div>
      <p className="font-inter font-light uppercase text-blue-spindle text-md text-center mt-6 md:mt-2 lg:mt-6">
        {title}
      </p>
    </>
  );
};

export default IssuanceBurnBaseGauge;
