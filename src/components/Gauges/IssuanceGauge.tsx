import type { FC } from "react";
import { useAverageEthPrice } from "../../api/eth-price";
import colors from "../../colors";
import type { Unit } from "../../denomination";
import { O, pipe } from "../../fp";
import * as StaticEtherData from "../../static-ether-data";
import type { TimeFrameNext } from "../../time-frames";
import BaseGauge from "./IssuanceBurnBaseGauge";

type Props = {
  simulateMerge: boolean;
  timeFrame: TimeFrameNext;
  unit: Unit;
};

const IssuanceGauge: FC<Props> = ({ simulateMerge, timeFrame, unit }) => {
  const averageEthPrice = useAverageEthPrice();

  const selectedAverageEthPrice = pipe(
    averageEthPrice,
    O.fromNullable,
    O.map((averageEthPrice) => averageEthPrice[timeFrame]),
  );

  const issuancePerDay = simulateMerge
    ? StaticEtherData.posIssuancePerDay
    : StaticEtherData.powIssuancePerDay + StaticEtherData.posIssuancePerDay;

  const issuance = pipe(
    selectedAverageEthPrice,
    O.map((selectedAverageEthPrice) =>
      unit === "eth"
        ? (issuancePerDay * 365.25) / 1_000_000
        : (issuancePerDay * 365.25 * selectedAverageEthPrice) / 1_000_000_000,
    ),
    O.toUndefined,
  );

  return (
    <div
      className={`
        flex flex-col justify-start items-center
        bg-blue-tangaroa
        px-4 md:px-0 py-8 pt-7
        rounded-lg md:rounded-none md:rounded-tr-lg`}
    >
      <BaseGauge
        emoji="💧"
        gaugeUnit={unit === "eth" ? "M" : "B"}
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
