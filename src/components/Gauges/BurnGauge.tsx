import useFeeData from "../../use-fee-data";
import { weiToEth } from "../../utils/metric-utils";
import colors from "../../colors";
import BaseGauge from "./IssuanceBurnBaseGauge";
import SpanMoji from "../SpanMoji";

const BurnGauge = () => {
  const { burnRates } = useFeeData();

  const burnRateAllRounded =
    burnRates !== undefined
      ? // Rounding helps us skip updates.
        weiToEth(burnRates.burnRateAll * 60 * 24 * 365) / 1000000
      : 0;

  return (
    <div className="flex flex-col justify-start items-center bg-blue-tangaroa px-4 md:px-0 py-4 pt-7 rounded-lg md:rounded-r-none lg:rounded-r-lg">
      <SpanMoji className="text-4xl" emoji="🔥"></SpanMoji>
      <BaseGauge
        title="burn"
        value={burnRateAllRounded}
        valueFillColor={colors.yellow500}
        needleColor={colors.yellow500}
      />
    </div>
  );
};

export default BurnGauge;
