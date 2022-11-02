import type { FC } from "react";
import { useAverageEthPrice } from "../../api/average-eth-price";
import colors from "../../colors";
import type { Unit } from "../../denomination";
import * as StaticEtherData from "../../static-ether-data";
import type { TimeFrameNext } from "../../time-frames";
import BaseGauge from "./IssuanceBurnBaseGauge";

type Props = {
  simulateProofOfWork: boolean;
  timeFrame: TimeFrameNext;
  unit: Unit;
};

const IssuanceGauge: FC<Props> = ({
  simulateProofOfWork: simulateProofOfWork,
  timeFrame,
  unit,
}) => {
  const averageEthPrice = useAverageEthPrice();

  const selectedAverageEthPrice = averageEthPrice?.[timeFrame];

  const issuancePerDay = simulateProofOfWork
    ? StaticEtherData.powIssuancePerDay
    : StaticEtherData.posIssuancePerDay;

  const issuance =
    selectedAverageEthPrice === undefined
      ? undefined
      : unit === "eth"
      ? (issuancePerDay * 365.25) / 1_000
      : (issuancePerDay * 365.25 * selectedAverageEthPrice) / 1_000_000_000;

  return (
    <div
      className={`
        flex flex-col items-center justify-start
        rounded-lg
        bg-blue-tangaroa px-4 py-8 pt-7
        md:rounded-none md:rounded-tr-lg md:px-0`}
    >
      <BaseGauge
        emoji="droplet"
        gaugeUnit={unit === "eth" ? "K" : "B"}
        gradientFill="blue"
        needleColor={colors.drop}
        title="issuance"
        unit={unit}
        value={issuance}
        valueUnit={unit === "eth" ? "ETH/year" : "USD/year"}
      />
    </div>
  );
};

export default IssuanceGauge;
