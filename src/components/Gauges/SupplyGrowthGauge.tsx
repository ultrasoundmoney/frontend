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
    <div className="flex flex-col items-center bg-blue-tangaroa px-4 md:px-0 lg:px-2 py-4 rounded-lg md:rounded-none lg:rounded-lg pt-8 lg:pt-10">
      <div className="flex items-center">
        <ToggleSwitch checked={simulateMerge} onToggle={toggleSimulateMerge} />
        <p className="relative z-10 font-inter text-blue-spindle flex flex-row items-center justify-end px-4 self-center">
          simulate merge
        </p>
      </div>
      <div className="w-3 h-3"></div>
      <div className="relative transform md:scale-gauge-md md:-mx-4 md:-mt-14 lg:-mt-5 lg:scale-100 xl:scale-110">
        <SplitGaugeSvg max={max} progress={(growthRate * 100) / max} />
        <span className="absolute left-5 top-44 font-roboto font-light text-lg lg:text-base text-white">
          {-max}%
        </span>
        <span className="absolute right-7 top-44 font-roboto font-light text-lg text-white">
          +{max}%
        </span>
      </div>
      <p className="relative font-roboto font-light text-white text-center text-lg md:text-base lg:text-lg -mt-24">
        <CountUp
          decimals={2}
          duration={1}
          separator=","
          end={growthRate * 100}
          preserveValue={true}
        />
      </p>
      <span className="relative font-roboto font-extralight text-blue-spindle -mt-1">
        %/year
      </span>
      <p className="relative font-inter font-light uppercase text-blue-spindle text-md text-center mt-8 md:mt-6 mb-4 md:mb-0">
        supply growth
      </p>
    </div>
  );
};

export default SupplyGrowthGauge;
