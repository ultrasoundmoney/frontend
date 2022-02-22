import { clamp } from "lodash";
import React, { FC, useCallback, useEffect, useState } from "react";
import { animated, config, useSpring } from "react-spring";
import { useGroupedStats1 } from "../../api/grouped-stats-1";
import { useScarcity } from "../../api/scarcity";
import * as Format from "../../format";
import * as StaticEtherData from "../../static-ether-data";
import { TimeFrameNext } from "../../time-frames";
import { timeframeBurnRateMap } from "../BurnTotal";
import ToggleSwitch from "../ToggleSwitch";
import TimeFrameIndicator from "../widget-subcomponents/TimeFrameIndicator";
import SplitGaugeSvg from "./SplitGaugeSvg";

const useGrowthRate = (
  simulateMerge: boolean,
  timeFrame: TimeFrameNext,
): number => {
  const ethSupply = useScarcity()?.ethSupply;
  const burnRates = useGroupedStats1()?.burnRates;
  const [growthRate, setGrowthRate] = useState(0);

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

    const growthRate =
      ethSupply === undefined
        ? undefined
        : (issuanceRate - feeBurnYear) / Format.ethFromWeiBIUnsafe(ethSupply);

    const rateRounded =
      growthRate === undefined
        ? undefined
        : Math.round(growthRate * 1000) / 1000;

    if (rateRounded !== undefined && rateRounded !== growthRate) {
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
  toggleSimulateMerge,
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

  const progress = clamp(growthRate * 100, -max, max) / max;

  return (
    <div className="flex flex-col justify-start items-center bg-blue-tangaroa px-4 md:px-0 py-8 pt-7 rounded-lg md:rounded-none lg:rounded-lg">
      <div className="flex justify-between">
        <div className="leading-10 z-10 flex items-center">
          <ToggleSwitch
            checked={simulateMerge}
            onToggle={toggleSimulateMerge}
          />
          <p
            className={`
              leading-10 px-4
              text-lg text-blue-spindle
              font-inter font-light
              flex flex-row items-center justify-end self-center
            `}
          >
            simulate merge
          </p>
        </div>
      </div>
      <div className="mt-6 md:mt-2 lg:mt-8 transform scale-100 md:scale-75 lg:scale-100 xl:scale-110">
        <SplitGaugeSvg max={max} progress={progress} />
        <div className="font-roboto text-white text-center font-light 2xl:text-lg -mt-20 pt-1">
          {freezeAnimated ? (
            <p className="-mb-2">
              {Format.formatPercentOneDigitSigned(growthRateAnimated.get())}
            </p>
          ) : (
            <animated.p className="-mb-2">
              {growthRateAnimated.to(toPercentOneDigitSigned)}
            </animated.p>
          )}
          <p className="font-extralight text-blue-spindle">/year</p>
          <div className="-mt-2">
            <span className="float-left">{-max}%</span>
            <span className="float-right">+{max}%</span>
          </div>
        </div>
      </div>
      {/* Height is set to align with sibling gauges */}
      <div className="flex items-center h-10 mt-6 md:mt-0 lg:mt-4 gap-x-2">
        <p className="font-inter font-light uppercase sm:text-right text-blue-spindle text-md">
          supply growth
        </p>
        <TimeFrameIndicator
          showDays={false}
          onClickTimeFrame={onClickTimeFrame}
          timeFrame={timeFrame}
        />
      </div>
      {/* This element is to align the slightly higher "supply growth" label with */}
      {/* the sibling gauges. */}
      <div className="mt-0 md:-mt-2"></div>
    </div>
  );
};

export default SupplyGrowthGauge;
