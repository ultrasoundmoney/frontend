import clamp from "lodash/clamp";
import type { FC } from "react";
import { useCallback, useContext, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { animated, config, useSpring } from "@react-spring/web";
import type { GaugeRates } from "../../api/gauge-rates";
import { useGaugeRates } from "../../api/gauge-rates";
import { FeatureFlagsContext } from "../../../feature-flags";
import * as Format from "../../../format";
import type { TimeFrame } from "../../time-frames";
import TimeFrameIndicator from "../TimeFrameIndicator";
import { WidgetTitle } from "../../../components/WidgetSubcomponents";
import SplitGaugeSvg from "./SplitGaugeSvg";
import { OnClick } from "../../../components/TimeFrameControl";

const getRate = (
  gaugeRates: GaugeRates,
  simulateProofOfWork: boolean,
  timeFrame: TimeFrame,
) =>
  gaugeRates === undefined
    ? undefined
    : simulateProofOfWork
    ? gaugeRates[timeFrame].supply_growth_rate_yearly_pow
    : gaugeRates[timeFrame].supply_growth_rate_yearly;

type Props = {
  onClickTimeFrame: OnClick;
  simulateProofOfWork: boolean;
  timeFrame: TimeFrame;
};

const SupplyGrowthGauge: FC<Props> = ({
  onClickTimeFrame,
  simulateProofOfWork,
  timeFrame,
}) => {
  const gaugeRates = useGaugeRates();
  const growthRate = getRate(gaugeRates, simulateProofOfWork, timeFrame);
  const toPercentTwoDigitSigned = useCallback<(n: number) => string>(
    (n) => Format.formatPercentTwoDecimalSigned(n),
    [],
  );

  // Workaround as react-spring is breaking our positive number with sign formatting.
  const [freezeAnimated, setFreezeAnimated] = useState(true);
  const { growthRateAnimated } = useSpring({
    from: { growthRateAnimated: 0 },
    to: { growthRateAnimated: growthRate },
    delay: 200,
    config: config.gentle,
    onRest: () => {
      setFreezeAnimated(true);
    },
    onStart: () => {
      setFreezeAnimated(false);
    },
  });

  const max = 5;

  const progress = clamp((growthRate ?? 0) * 100, -max, max) / max;

  const { previewSkeletons } = useContext(FeatureFlagsContext);

  return (
    <div
      className={`
        flex flex-col items-center
        justify-start
        rounded-tl-lg rounded-tr-lg bg-slateus-700 px-4
        pb-4 pt-7
        md:rounded-none md:px-0
      `}
    >
      <WidgetTitle>supply growth</WidgetTitle>
      <div className="mt-6 md:scale-90 lg:scale-100">
        <SplitGaugeSvg max={max} progress={progress} />
        <animated.div
          className={`
            -mt-[60px] bg-gradient-to-r bg-clip-text text-center font-roboto text-3xl font-light text-transparent
            ${
              growthRate !== undefined && growthRate > 0
                ? "from-cyan-300 to-indigo-500"
                : "from-orange-400 to-yellow-300"
            }
          `}
          // style={colorStyle}
        >
          {growthRate === undefined || previewSkeletons ? (
            <div className="-mb-2">
              <Skeleton inline width="46px" />
            </div>
          ) : freezeAnimated ? (
            <p className="-mb-2">
              {Format.formatPercentTwoDecimalSigned(growthRateAnimated.get())}
            </p>
          ) : (
            <animated.p className="-mb-2">
              {growthRateAnimated.to(toPercentTwoDigitSigned)}
            </animated.p>
          )}
        </animated.div>
      </div>
      <p className="mt-[7px] mb-2.5 select-none font-roboto text-xs font-light text-slateus-200">
        /year
      </p>
      <div className="flex h-6 items-center">
        <TimeFrameIndicator
          onClickTimeFrame={onClickTimeFrame}
          timeFrame={timeFrame}
        />
      </div>
    </div>
  );
};

export default SupplyGrowthGauge;
