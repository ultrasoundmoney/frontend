import { FC } from "react";
import BaseGauge from "./IssuanceBurnBaseGauge";
import * as StaticEtherData from "../../static-ether-data";
import colors from "../../colors";
import { Unit } from "../ComingSoon";
import { useAverageEthPrice } from "../../api";
import { Timeframe } from "../FeePeriodControl";

type IssuanceGaugeProps = {
  simulateMerge: boolean;
  timeframe: Timeframe;
  unit: Unit;
};

const IssuanceGauge: FC<IssuanceGaugeProps> = ({
  simulateMerge,
  timeframe,
  unit,
}) => {
  const averageEthPrice = useAverageEthPrice(timeframe);
  const issuancePerDay = simulateMerge
    ? StaticEtherData.posIssuancePerDay
    : StaticEtherData.powIssuancePerDay + StaticEtherData.posIssuancePerDay;
  const issuance =
    averageEthPrice === undefined
      ? 0
      : unit === "eth"
      ? (issuancePerDay * 365.25) / 1_000_000
      : (issuancePerDay * 365.25 * averageEthPrice) / 1_000_000_000;

  return (
    <div className="flex flex-col justify-start items-center bg-blue-tangaroa px-4 md:px-0 py-4 pt-7 rounded-lg md:rounded-l-none lg:rounded-l-lg">
      <BaseGauge
        title="issuance"
        value={issuance}
        valueFillColor={colors.drop}
        needleColor={colors.drop}
        emoji="💧"
        gaugeUnit={unit === "eth" ? "M" : "B"}
        valueUnit={unit === "eth" ? "ETH/year" : "USD/year"}
      />
    </div>
  );
};

export default IssuanceGauge;
