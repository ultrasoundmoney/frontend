import clamp from "lodash/clamp";
import type { FC } from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { animated, config, useSpring } from "react-spring";
import type { BurnRates } from "../../api/grouped-analysis-1";
import type { Scarcity } from "../../api/scarcity";
import colors from "../../colors";
import { FeatureFlagsContext } from "../../feature-flags";
import * as Format from "../../format";
import * as StaticEtherData from "../../static-ether-data";
import type { TimeFrameNext } from "../../time-frames";
import { timeframeBurnRateMap } from "../BurnTotal";
import TimeFrameIndicator from "../TimeFrameIndicator";
import { WidgetTitle } from "../WidgetSubcomponents";
import SplitGaugeSvg from "./SplitGaugeSvg";

const useGrowthRate = (
  scarcity: Scarcity | undefined,
  burnRates: BurnRates,
  simulateMerge: boolean,
  timeFrame: TimeFrameNext,
): number | undefined => {
  const [growthRate, setGrowthRate] = useState<number>();

  useEffect(() => {
    if (scarcity === undefined) {
      return;
    }

    const selectedBurnRate = burnRates[timeframeBurnRateMap[timeFrame]["eth"]];

    // Convert burn rate from eth/min to eth/year.
    const feeBurnYear = Format.ethFromWei(selectedBurnRate) * 60 * 24 * 365.25;

    const issuanceRate = simulateMerge
      ? StaticEtherData.posIssuanceYear
      : StaticEtherData.posIssuanceYear + StaticEtherData.powIssuanceYear;

    const nextGrowthRate =
      scarcity.ethSupply === undefined
        ? undefined
        : (issuanceRate - feeBurnYear) /
          Format.ethFromWeiBIUnsafe(scarcity.ethSupply);

    const rateRounded =
      nextGrowthRate === undefined
        ? undefined
        : Math.round(nextGrowthRate * 1000) / 1000;

    if (rateRounded !== undefined && rateRounded !== nextGrowthRate) {
      setGrowthRate(rateRounded);
    }
  }, [burnRates, growthRate, scarcity, simulateMerge, timeFrame]);

  return growthRate;
};

type Props = {
  scarcity: Scarcity | undefined;
  burnRates: BurnRates;
  onClickTimeFrame: () => void;
  simulateMerge: boolean;
  timeFrame: TimeFrameNext;
  toggleSimulateMerge: () => void;
};

const SupplyGrowthGauge: FC<Props> = ({
  scarcity,
  burnRates,
  onClickTimeFrame,
  simulateMerge,
  timeFrame,
}) => {
  const growthRate = useGrowthRate(
    scarcity,
    burnRates,
    simulateMerge,
    timeFrame,
  );
  const toPercentOneDigitSigned = useCallback<(n: number) => string>(
    (n) => Format.formatPercentOneDecimalSigned(n),
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

  const max = 10;

  const progress = clamp((growthRate ?? 0) * 100, -max, max) / max;

  const { previewSkeletons } = useContext(FeatureFlagsContext);

  const colorStyle = useSpring({
    from: { color: colors.drop },
    to: { color: colors.fireOrange },
    reverse: progress > 0,
  });

  return (
    <div
      // HACK: on tablet the growth gauge is a different height from the burn and issuance gauges so we do some nasty margin hacking to try and align them.
      className={`
        flex flex-col justify-start items-center
        bg-blue-tangaroa
        px-4 md:px-0 py-8 pt-7
        rounded-tl-lg rounded-tr-lg md:rounded-none
        pb-[36px] -mb-[4px]
      `}
    >
      <WidgetTitle>supply growth</WidgetTitle>
      <div className="mt-8 lg:mt-9 md:scale-90 lg:scale-100">
        <SplitGaugeSvg max={max} progress={progress} />
      </div>
      <animated.div
        className="font-roboto font-light text-3xl -mt-16"
        style={colorStyle}
      >
        {growthRate === undefined || previewSkeletons ? (
          <div className="-mb-2">
            <Skeleton inline width="46px" />
          </div>
        ) : freezeAnimated ? (
          <p className="-mb-2">
            {Format.formatPercentOneDecimalSigned(growthRateAnimated.get())}
          </p>
        ) : (
          <animated.p className="-mb-2">
            {growthRateAnimated.to(toPercentOneDigitSigned)}
          </animated.p>
        )}
      </animated.div>
      <p className="font-roboto font-light text-xs text-blue-spindle select-none mb-7 lg:mb-6">
        /year
      </p>
      <TimeFrameIndicator
        onClickTimeFrame={onClickTimeFrame}
        timeFrame={timeFrame}
      />
    </div>
  );
};

export default SupplyGrowthGauge;
