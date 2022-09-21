import type { FC } from "react";
import { useBurnRates } from "../../api/burn-rates";
import colors from "../../colors";
import type { Unit } from "../../denomination";
import * as Format from "../../format";
import type { TimeFrameNext } from "../../time-frames";
import { timeframeBurnRateMap } from "../BurnTotal";
import IssuanceBurnBaseGauge from "./IssuanceBurnBaseGauge";

type BurnGaugeProps = {
  timeFrame: TimeFrameNext;
  unit: Unit;
};

const BurnGauge: FC<BurnGaugeProps> = ({ timeFrame, unit }) => {
  const burnRates = useBurnRates();
  const preBurnRate =
    burnRates === undefined
      ? undefined
      : burnRates[timeframeBurnRateMap[timeFrame][unit]];
  const burnRate =
    preBurnRate === undefined
      ? undefined
      : unit === "eth"
      ? Format.ethFromWei(preBurnRate * 60 * 24 * 365.25) / 10 ** 3
      : (preBurnRate * 60 * 24 * 365.25) / 10 ** 9;

  return (
    <div
      className={`
        flex flex-col justify-start items-center
        bg-blue-tangaroa
        px-4 md:px-0 py-8 pt-7
        rounded-lg md:rounded-none md:rounded-tl-lg
      `}
    >
      <IssuanceBurnBaseGauge
        emoji="flame"
        gaugeUnit={unit === "eth" ? "K" : "B"}
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
