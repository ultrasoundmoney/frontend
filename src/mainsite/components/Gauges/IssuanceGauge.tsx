import type { FC } from "react";
import type { GaugeRates } from "../../api/gauge-rates";
import { useGaugeRates } from "../../api/gauge-rates";
import colors from "../../../colors";
import type { Unit } from "../../../denomination";
import type { TimeFrame } from "../../time-frames";
import BaseGauge from "./IssuanceBurnBaseGauge";

type Props = {
  simulateProofOfWork: boolean;
  timeFrame: TimeFrame;
  unit: Unit;
};

const getRate = (
  gaugeRates: GaugeRates,
  simulateProofOfWork: boolean,
  timeFrame: TimeFrame,
  unit: Unit,
) =>
  gaugeRates === undefined
    ? undefined
    : simulateProofOfWork
    ? gaugeRates[timeFrame].issuance_rate_yearly_pow[unit]
    : gaugeRates[timeFrame].issuance_rate_yearly[unit];

const IssuanceGauge: FC<Props> = ({
  simulateProofOfWork: simulateProofOfWork,
  timeFrame,
  unit,
}) => {
  const gaugeRates = useGaugeRates();
  const issuance = getRate(gaugeRates, simulateProofOfWork, timeFrame, unit);

  return (
    <div
      className={`
        flex flex-col items-center justify-start
        rounded-lg
        bg-slateus-700 px-4 pb-4 pt-7
        md:rounded-none md:rounded-tr-lg md:px-0`}
    >
      <BaseGauge
        emoji="droplet"
        gaugeUnit={unit === "eth" ? "K" : "B"}
        gradientFill="blue"
        needleColor={colors.blue400}
        title="issuance"
        unit={unit}
        value={issuance}
        valueUnit={unit === "eth" ? "ETH/year" : "USD/year"}
      />
    </div>
  );
};

export default IssuanceGauge;
