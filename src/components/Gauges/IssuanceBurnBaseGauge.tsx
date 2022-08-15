import { clamp } from "lodash";
import type { FC } from "react";
import { useContext } from "react";
import Skeleton from "react-loading-skeleton";
import { animated, config, useSpring } from "react-spring";
import { useGroupedAnalysis1 } from "../../api/grouped-analysis-1";
import type { Unit } from "../../denomination";
import { FeatureFlagsContext } from "../../feature-flags";
import * as Format from "../../format";
import { pipe } from "../../fp";
import Twemoji from "../Twemoji";
import { WidgetTitle } from "../WidgetSubcomponents";
import type { GaugeGradientFill } from "./GaugeSvg";
import GaugeSvg from "./GaugeSvg";

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
      <Twemoji className="h-6 w-6 select-none" wrapper>
        {emoji}
      </Twemoji>
    </>
  );
};

export default IssuanceBurnBaseGauge;
