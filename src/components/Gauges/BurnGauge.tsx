import { useFeeData } from "../../api";
import { weiToEth } from "../../utils/metric-utils";
import colors from "../../colors";
import BaseGauge from "./IssuanceBurnBaseGauge";

const BurnGauge = () => {
  const { burnRates } = useFeeData();

  const burnRateAllRounded =
    burnRates !== undefined
      ? // Rounding helps us skip updates.
        weiToEth(burnRates.burnRateAll * 60 * 24 * 365.25) / 1000000
      : 0;

  return (
    <div className="flex flex-col justify-start items-center bg-blue-tangaroa px-4 md:px-0 py-4 pt-7 rounded-lg md:rounded-r-none lg:rounded-r-lg">
      <BaseGauge
        title="burn"
        value={burnRateAllRounded}
        valueFillColor={colors.fireOrange}
        needleColor={colors.fireOrange}
        emoji="🔥"
      />
    </div>
  );
};

export default BurnGauge;
