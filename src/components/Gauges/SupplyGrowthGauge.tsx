import { FC, useEffect, useState } from "react";
import { useFeeData } from "../../api";
import * as StaticEtherData from "../../static-ether-data";
import { weiToEth } from "../../utils/metric-utils";
import ToggleSwitch from "../ToggleSwitch";
import SplitGaugeSvg from "./SplitGaugeSvg";
import { animated, config, useSpring } from "react-spring";
import { formatPercentOneDigitSigned } from "../../format";

type SupplyGrowthGaugeProps = {
  simulateMerge: boolean;
  toggleSimulateMerge: () => void;
};

const powIssuanceYear = StaticEtherData.powIssuancePerDay * 365.25;
const posIssuanceYear = StaticEtherData.posIssuancePerDay * 365.25;

const useGrowthRate = (simulateMerge: boolean): number => {
  const { burnRates } = useFeeData();
  const [growthRate, setGrowthRate] = useState(0);

  useEffect(() => {
    if (burnRates === undefined) {
      return;
    }

    // Burn rates are per minute.
    const feeBurnYear =
      burnRates !== undefined
        ? weiToEth(burnRates.burnRate30d) * 60 * 24 * 365.25
        : 0;
    const growthRateWithPoWIssuance =
      (powIssuanceYear + posIssuanceYear - feeBurnYear) /
      StaticEtherData.totalSupply;
    const growthRateWithoutPoWIssuance =
      (posIssuanceYear - feeBurnYear) / StaticEtherData.totalSupply;
    const newRate = simulateMerge
      ? growthRateWithoutPoWIssuance
      : growthRateWithPoWIssuance;
    const rateRounded = Math.round(newRate * 1000) / 1000;

    if (rateRounded !== growthRate) {
      setGrowthRate(rateRounded);
    }
  }, [burnRates, growthRate, simulateMerge]);

  return growthRate;
};

const SupplyGrowthGauge: FC<SupplyGrowthGaugeProps> = ({
  simulateMerge,
  toggleSimulateMerge,
}) => {
  const growthRate = useGrowthRate(simulateMerge);

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

  const max = 4;

  return (
    <div className="flex flex-col justify-start items-center bg-blue-tangaroa px-4 md:px-0 py-4 pt-7 rounded-lg md:rounded-l-none lg:rounded-l-lg">
      <div className="leading-10 z-10 flex items-center">
        <ToggleSwitch checked={simulateMerge} onToggle={toggleSimulateMerge} />
        <p className="leading-10 text-lg font-inter text-blue-spindle flex flex-row items-center justify-end px-4 self-center">
          simulate merge
        </p>
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
      <p className="font-inter font-light uppercase text-blue-spindle text-md text-center mt-6 md:mt-2 lg:mt-6">
        supply growth
      </p>
    </div>
  );
};

export default SupplyGrowthGauge;
