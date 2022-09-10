import type { BaseFeePerGasStats } from "../api/base-fee-per-gas-stats";
import WidgetErrorBoundary from "./WidgetErrorBoundary";
import { WidgetBackground } from "./WidgetSubcomponents";
import LabelText from "./TextsNext/LabelText";
import TimeFrameIndicator from "./TimeFrameIndicator";
import type { FC } from "react";
import QuantifyText from "./TextsNext/QuantifyText";
import SkeletonText from "./TextsNext/SkeletonText";
import { formatUsdZeroDecimals, formatZeroDecimals } from "../format";
import { WEI_PER_GWEI } from "../eth-units";

type Props = {
  baseFeePerGasStats: BaseFeePerGasStats | undefined;
};

const GasMarketWidget: FC<Props> = ({ baseFeePerGasStats }) => {
  console.log("rendering gas market widget");

  const gasRange =
    baseFeePerGasStats === undefined
      ? undefined
      : baseFeePerGasStats.max - baseFeePerGasStats.min;

  const averagePercent =
    baseFeePerGasStats === undefined || gasRange === undefined
      ? undefined
      : ((baseFeePerGasStats.average - baseFeePerGasStats.min) / gasRange) *
        100;

  const barrierPercent =
    baseFeePerGasStats === undefined || gasRange === undefined
      ? undefined
      : ((baseFeePerGasStats.barrier - baseFeePerGasStats.min) / gasRange) *
        100;

  const delta =
    barrierPercent !== undefined && averagePercent !== undefined
      ? barrierPercent - averagePercent
      : undefined;

  type MarkerProps = {
    highest: number;
    lowest: number;
    label: string;
    gas: number;
    orientation: "up" | "down";
  };

  const lowest =
    baseFeePerGasStats === undefined
      ? undefined
      : Math.min(baseFeePerGasStats.min, baseFeePerGasStats.barrier);

  const highest =
    baseFeePerGasStats === undefined
      ? undefined
      : Math.max(baseFeePerGasStats.max, baseFeePerGasStats.barrier);

  const getPercentage = (
    highest: number,
    lowest: number,
    gas: number,
  ): number | undefined => {
    const range = highest - lowest;
    return (gas - lowest) / range;
  };

  const Marker: FC<MarkerProps> = ({
    highest,
    lowest,
    gas,
    label,
    orientation,
  }) => (
    <div
      className={`
        absolute  -translate-x-1/2
        flex flex-col items-center
        ${orientation === "up" ? "-top-12" : "-bottom-12"}
      `}
      style={{
        left: `${getPercentage(highest, lowest, gas) * 100}%`,
      }}
    >
      <LabelText>{label}</LabelText>
      <SkeletonText>
        {gas !== undefined && (
          <QuantifyText unitPostfix="Gwei">
            {formatZeroDecimals(gas / WEI_PER_GWEI)}
          </QuantifyText>
        )}
      </SkeletonText>
    </div>
  );

  const markerList =
    baseFeePerGasStats === undefined
      ? []
      : [
          { label: "barrier", gas: baseFeePerGasStats.barrier },
          { label: "min", gas: baseFeePerGasStats.min },
          { label: "max", gas: baseFeePerGasStats.max },
          { label: "average", gas: baseFeePerGasStats.average },
        ];

  return (
    <WidgetErrorBoundary title="gas market">
      <WidgetBackground className="flex flex-col">
        <div className="flex justify-between">
          <LabelText>gas market</LabelText>
          <TimeFrameIndicator
            timeFrame="h1"
            onClickTimeFrame={() => undefined}
          ></TimeFrameIndicator>
        </div>
        <div
          className={`
            relative
            flex
            h-2
            my-16 mx-10
            bg-blue-highlightbg
            rounded-full
          `}
        >
          {delta !== undefined && (
            <div
              className={` absolute bg-gradient-to-r ${
                delta < 0
                  ? "from-orange-300 to-yellow-500"
                  : "from-cyan-300 to-indigo-500"
              } h-2`}
              style={{
                left: `${barrierPercent}%`,
                width: `${Math.abs(delta)}%`,
              }}
            ></div>
          )}

          {markerList !== undefined &&
            highest !== undefined &&
            lowest !== undefined &&
            markerList.map(({ label, gas }, index) => (
              <Marker
                highest={highest}
                lowest={lowest}
                key={label}
                label={label}
                gas={gas}
                orientation={index % 2 !== 0 ? "up" : "down"}
              />
            ))}
        </div>
      </WidgetBackground>
    </WidgetErrorBoundary>
  );
};

export default GasMarketWidget;
