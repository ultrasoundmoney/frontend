import CountUp from "react-countup";
import { FC } from "react";
import useFeeData from "../../use-fee-data";
import * as StaticEtherData from "../../static-ether-data";
import { weiToEth } from "../../utils/metric-utils";
import ToggleSwitch from "../ToggleSwitch";
import SplitGaugeSvg from "./SplitGaugeSvg";

type SupplyGrowthGaugeProps = {
  simulateMerge: boolean;
  toggleSimulateMerge: () => void;
};
const SupplyGrowthGauge: FC<SupplyGrowthGaugeProps> = ({
  simulateMerge,
  toggleSimulateMerge,
}) => {
  const { burnRates } = useFeeData();

  const powIssuanceYear = StaticEtherData.powIssuancePerDay * 365;
  const posIssuanceYear = StaticEtherData.posIssuancePerDay * 365;
  // Burn rates are per minute.
  const feeBurnYear =
    burnRates !== undefined
      ? weiToEth(burnRates.burnRate30d) * 60 * 24 * 365
      : 0;
  const growthRateWithPoWIssuance =
    (powIssuanceYear + posIssuanceYear - feeBurnYear) /
    StaticEtherData.totalSupply;
  const growthRateWithoutPoWIssuance =
    (posIssuanceYear - feeBurnYear) / StaticEtherData.totalSupply;
  const growthRate = simulateMerge
    ? growthRateWithoutPoWIssuance
    : growthRateWithPoWIssuance;

  const max = 4;

  return (
    <div className="flex flex-col items-center bg-blue-tangaroa px-4 md:px-0 lg:px-2 py-4 rounded-lg md:rounded-none lg:rounded-lg">
      <p className="relative z-10 font-inter text-blue-spindle flex flex-row items-center justify-end px-4 md:text-sm self-center">
        <ToggleSwitch
          className="mr-4"
          checked={simulateMerge}
          onToggle={toggleSimulateMerge}
        />
        simulate merge
      </p>
      <div className="w-4 h-4"></div>
      <div className="relative transform md:scale-gauge-md md:-mx-4 md:-mt-10 lg:-mt-0 lg:scale-100">
        <span className="absolute transform left-1/2 -translate-x-1/2 text-center -mb-6 font-roboto font-light text-white">
          0%
        </span>
        <SplitGaugeSvg max={max} progress={(growthRate * 100) / max} />
        <span className="absolute left-5 top-44 font-roboto font-light text-white">
          {-max}%
        </span>
        <span className="absolute right-7 top-44 font-roboto font-light text-white">
          +{max}%
        </span>
      </div>
      <p className="relative font-roboto font-light text-white text-center text-lg -mt-24">
        <CountUp
          decimals={2}
          duration={1}
          separator=","
          end={growthRate * 100}
          preserveValue={true}
        />
      </p>
      <span className="relative font-extralight text-blue-spindle -mt-1">
        %/year
      </span>
      <p className="relative font-inter font-light uppercase text-blue-spindle text-md text-center mt-8 md:mt-6">
        supply growth
      </p>
    </div>
  );
};

export default SupplyGrowthGauge;
