import React, { FC, useEffect, useState } from "react";
import { animated, config, useSpring } from "react-spring";
import { useAverageEthPrice, useFeeData } from "../../api";
import { formatPercentOneDigitSigned } from "../../format";
import * as StaticEtherData from "../../static-ether-data";
import { weiToEth } from "../../utils/metric-utils";
import { timeframeBurnRateMap } from "../FeeBurn";
import { TimeFrame } from "../TimeFrameControl";
import TimeframeIndicator from "../TimeframeIndicator";
import ToggleSwitch from "../ToggleSwitch";
import SplitGaugeSvg from "./SplitGaugeSvg";

const powIssuanceYear = StaticEtherData.powIssuancePerDay * 365.25;
const posIssuanceYear = StaticEtherData.posIssuancePerDay * 365.25;

const useGrowthRate = (
  simulateMerge: boolean,
  timeFrame: TimeFrame
): number => {
  const { burnRates } = useFeeData();
  const [growthRate, setGrowthRate] = useState(0);
  const averageEthPrice = useAverageEthPrice(timeFrame);

  useEffect(() => {
    if (burnRates === undefined || averageEthPrice === undefined) {
      return;
    }

    const selectedBurnRate = burnRates[timeframeBurnRateMap[timeFrame]["eth"]];

    // Convert burn rate from eth/min to eth/year.
    const feeBurnYear = weiToEth(selectedBurnRate) * 60 * 24 * 365.25;

    const issuanceRate = simulateMerge
      ? posIssuanceYear
      : posIssuanceYear + powIssuanceYear;

    const growthRate =
      (issuanceRate - feeBurnYear) / StaticEtherData.totalSupply;

    const rateRounded = Math.round(growthRate * 1000) / 1000;

    if (rateRounded !== growthRate) {
      setGrowthRate(rateRounded);
    }
  }, [burnRates, growthRate, simulateMerge, averageEthPrice, timeFrame]);

  return growthRate;
};

type Props = {
  onClickTimeFrame: () => void;
  simulateMerge: boolean;
  timeFrame: TimeFrame;
  toggleSimulateMerge: () => void;
};

const SupplyGrowthGauge: FC<Props> = ({
  onClickTimeFrame,
  simulateMerge,
  timeFrame,
  toggleSimulateMerge,
}) => {
  const growthRate = useGrowthRate(simulateMerge, timeFrame);

  // Workaround as react-spring is breaking our positive number with sign formatting.
  const [freezeAnimated, setFreezeAnimated] = useState(true);
  const { growthRateA } = useSpring({
    from: { growthRateA: 0 },
    to: { growthRateA: growthRate },
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

  return (
    <div className="flex flex-col justify-start items-center bg-blue-tangaroa px-4 md:px-0 py-8 pt-7 rounded-lg md:rounded-none lg:rounded-lg">
      <div className="flex justify-between">
        <div className="leading-10 z-10 flex items-center">
          <ToggleSwitch
            checked={simulateMerge}
            onToggle={toggleSimulateMerge}
          />
          <p className="leading-10 text-lg font-inter text-blue-spindle flex flex-row items-center justify-end px-4 self-center">
            simulate merge
          </p>
        </div>
      </div>
      <div className="mt-6 md:mt-2 lg:mt-8 transform scale-100 md:scale-75 lg:scale-100 xl:scale-110">
        <SplitGaugeSvg max={max} progress={(growthRate * 100) / max} />
        <div className="font-roboto text-white text-center font-light 2xl:text-lg -mt-20 pt-1">
          {freezeAnimated ? (
            <p className="-mb-2">
              {formatPercentOneDigitSigned(growthRateA.get())}
            </p>
          ) : (
            <animated.p className="-mb-2">
              {growthRateA.to((n) => formatPercentOneDigitSigned(n))}
            </animated.p>
          )}
          <p className="font-extralight text-blue-spindle">/year</p>
          <div className="-mt-2">
            <span className="float-left">{-max}%</span>
            <span className="float-right">+{max}%</span>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "-2px" }}></div>
      <div className="flex items-center mt-6 md:mt-0 lg:mt-4 gap-x-2">
        <p className="font-inter font-light uppercase sm:text-right text-blue-spindle text-md">
          supply growth
        </p>
        <TimeframeIndicator
          compressWhitespace={true}
          onClickTimeFrame={onClickTimeFrame}
          timeFrame={timeFrame}
        />
      </div>
    </div>
  );
};

export default SupplyGrowthGauge;
