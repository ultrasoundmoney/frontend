import { clamp } from "lodash";
import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { animated, config, useSpring } from "react-spring";
import { useGroupedAnalysis1 } from "../../api/grouped-analysis-1";
import { useScarcity } from "../../api/scarcity";
import colors from "../../colors";
import { FeatureFlagsContext } from "../../feature-flags";
import * as Format from "../../format";
import * as StaticEtherData from "../../static-ether-data";
import { TimeFrameNext } from "../../time-frames";
import { timeframeBurnRateMap } from "../BurnTotal";
import { WidgetTitle } from "../WidgetSubcomponents";
import TimeFrameIndicator from "../TimeFrameIndicator";
import SplitGaugeSvg from "./SplitGaugeSvg";

const useGrowthRate = (
  simulateMerge: boolean,
  timeFrame: TimeFrameNext,
): number | undefined => {
  const ethSupply = useScarcity()?.ethSupply;
  const burnRates = useGroupedAnalysis1()?.burnRates;
  const [growthRate, setGrowthRate] = useState<number>();

  useEffect(() => {
    if (burnRates === undefined) {
      return;
    }

    const selectedBurnRate = burnRates[timeframeBurnRateMap[timeFrame]["eth"]];

    // Convert burn rate from eth/min to eth/year.
    const feeBurnYear = Format.ethFromWei(selectedBurnRate) * 60 * 24 * 365.25;

    const issuanceRate = simulateMerge
      ? StaticEtherData.posIssuanceYear
      : StaticEtherData.posIssuanceYear + StaticEtherData.powIssuanceYear;

    const nextGrowthRate =
      ethSupply === undefined
        ? undefined
        : (issuanceRate - feeBurnYear) / Format.ethFromWeiBIUnsafe(ethSupply);

    const rateRounded =
      nextGrowthRate === undefined
        ? undefined
        : Math.round(nextGrowthRate * 1000) / 1000;

    if (rateRounded !== undefined && rateRounded !== nextGrowthRate) {
      setGrowthRate(rateRounded);
    }
  }, [burnRates, ethSupply, growthRate, simulateMerge, timeFrame]);

  return growthRate;
};

type Props = {
  onClickTimeFrame: () => void;
  simulateMerge: boolean;
  timeFrame: TimeFrameNext;
  toggleSimulateMerge: () => void;
};

const SupplyGrowthGauge: FC<Props> = ({
  onClickTimeFrame,
  simulateMerge,
  timeFrame,
}) => {
  const growthRate = useGrowthRate(simulateMerge, timeFrame);
  const toPercentOneDigitSigned = useCallback<(n: number) => string>(
    (n) => Format.formatPercentOneDigitSigned(n),
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
    <div className="flex flex-col justify-start items-center bg-blue-tangaroa px-4 md:px-0 py-8 pt-7 rounded-tl-lg rounded-tr-lg">
      {/* Height is set to align with sibling gauges */}
      <WidgetTitle>supply growth</WidgetTitle>
      {/* <div className="mt-6 md:mt-2 lg:mt-8 transform scale-100 md:scale-75 lg:scale-100 xl:scale-110"> */}
      <div className="mt-8 md:scale-90 lg:scale-100">
        <SplitGaugeSvg max={max} progress={progress} />
      </div>
      <animated.div
        className="font-roboto font-light text-3xl -mt-16 pt-1"
        style={colorStyle}
      >
        {growthRate === undefined || previewSkeletons ? (
          <div className="-mb-2">
            <Skeleton inline width="46px" />
          </div>
        ) : freezeAnimated ? (
          <p className="-mb-2">
            {Format.formatPercentOneDigitSigned(growthRateAnimated.get())}
          </p>
        ) : (
          <animated.p className="-mb-2">
            {growthRateAnimated.to(toPercentOneDigitSigned)}
          </animated.p>
        )}
      </animated.div>
      <p className="font-roboto font-light text-xs text-blue-spindle select-none mt-1 mb-5">
        /year
      </p>
      {/* </div> */}
      <TimeFrameIndicator
        onClickTimeFrame={onClickTimeFrame}
        timeFrame={timeFrame}
      />
      {/* This element is to align the slightly higher "supply growth" label with */}
      {/* the sibling gauges. */}
      <div className=""></div>
    </div>
  );
};

export default SupplyGrowthGauge;
