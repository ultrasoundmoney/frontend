import { FC } from "react";
import { useGroupedStats1 } from "../../api/grouped-stats-1";
import colors from "../../colors";
import { Unit } from "../../denomination";
import * as Format from "../../format";
import { TimeFrameNext } from "../../time-frames";
import { timeframeBurnRateMap } from "../BurnTotal";
import IssuanceBurnBaseGauge from "./IssuanceBurnBaseGauge";

type BurnGaugeProps = { timeFrame: TimeFrameNext; unit: Unit };

const BurnGauge: FC<BurnGaugeProps> = ({ timeFrame, unit }) => {
  const burnRates = useGroupedStats1()?.burnRates;

  const selectedBurnRate =
    burnRates !== undefined
      ? burnRates[timeframeBurnRateMap[timeFrame][unit]]
      : undefined;

  const burnRate =
    selectedBurnRate === undefined
      ? undefined
      : unit === "eth"
      ? Format.ethFromWei(selectedBurnRate * 60 * 24 * 365.25) / 10 ** 6
      : (selectedBurnRate * 60 * 24 * 365.25) / 10 ** 9;

  return (
    <div
      className={`
        flex flex-col justify-start items-center
        bg-blue-tangaroa
        px-4 md:px-0 py-8 pt-7
        rounded-lg md:rounded-r-none lg:rounded-r-lg
      `}
    >
      <IssuanceBurnBaseGauge
        emoji="🔥"
        gaugeUnit={unit === "eth" ? "M" : "B"}
        gradientFill="orange"
        needleColor={colors.fireOrange}
        title="burn"
        unit={unit}
        value={burnRate}
        valueUnit={unit === "eth" ? "ETH/year" : "USD/year"}
      />
    </div>
  );
};

export default BurnGauge;
