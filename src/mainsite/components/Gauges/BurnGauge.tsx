import type { FC } from "react";
import type { GaugeRates } from "../../api/gauge-rates";
import { useGaugeRates } from "../../api/gauge-rates";
import colors from "../../../colors";
import type { Unit } from "../../../denomination";
import type { TimeFrame } from "../../time-frames";
import IssuanceBurnBaseGauge from "./IssuanceBurnBaseGauge";

type BurnGaugeProps = {
  timeFrame: TimeFrame;
  unit: Unit;
};

const getRate = (gaugeRates: GaugeRates, timeFrame: TimeFrame, unit: Unit) =>
  gaugeRates === undefined
    ? undefined
    : gaugeRates[timeFrame].burn_rate_yearly[unit];

const BurnGauge: FC<BurnGaugeProps> = ({ timeFrame, unit }) => {
  const gaugeRates = useGaugeRates();
  const selectedRate = getRate(gaugeRates, timeFrame, unit);

  return (
    <div
      className={`
        flex flex-col items-center justify-start
        rounded-lg
        bg-slateus-700 px-4 pb-4 pt-7
        md:rounded-none md:rounded-tl-lg md:px-0
      `}
    >
      <IssuanceBurnBaseGauge
        emoji="flame"
        gaugeUnit={unit === "eth" ? "K" : "B"}
        gradientFill="orange"
        needleColor={colors.orange400}
        title="burn"
        unit={unit}
        value={selectedRate}
        valueUnit={unit === "eth" ? "ETH/year" : "USD/year"}
      />
    </div>
  );
};

export default BurnGauge;
