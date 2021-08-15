import useFeeData from "../use-fee-data";
import { weiToEth } from "../utils/metric-utils";
import colors from "../colors";
import BaseGauge from "./BaseGauge";

const BurnGauge = () => {
  const { burnRates } = useFeeData();

  const burnRateAllRounded =
    burnRates !== undefined
      ? // Rounding helps us skip updates.
        Math.round(weiToEth(burnRates.burnRateAll) * 100) / 100
      : 0;

  return (
    <BaseGauge
      title="burn"
      value={burnRateAllRounded}
      valueFillColor={colors.yellow500}
    />
  );
};

export default BurnGauge;
