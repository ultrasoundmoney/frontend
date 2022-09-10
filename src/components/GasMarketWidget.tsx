import type { BaseFeePerGasStats } from "../api/base-fee-per-gas-stats";
import WidgetErrorBoundary from "./WidgetErrorBoundary";
import { WidgetBackground } from "./WidgetSubcomponents";
import LabelText from "./TextsNext/LabelText";
import TimeFrameIndicator from "./TimeFrameIndicator";
import type { FC } from "react";
import QuantifyText from "./TextsNext/QuantifyText";
import SkeletonText from "./TextsNext/SkeletonText";
import { formatZeroDecimals } from "../format";
import { WEI_PER_GWEI } from "../eth-units";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import batSvg from "../assets/bat-own.svg";
import speakerSvg from "../assets/speaker-own.svg";

const getPercentage = (
  highest: number,
  lowest: number,
  gas: number,
): number => {
  const range = highest - lowest;
  return (gas - lowest) / range;
};

type MarkerProps = {
  highest: number;
  lowest: number;
  label: string;
  gas: number;
  orientation: "up" | "down";
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
    {label === "barrier" ? (
      <>
        <div className="flex gap-x-1">
          <Image
            alt="emoji of a bat, first-half of signifying ultra sound base fee per gas"
            src={batSvg as StaticImageData}
            width={16}
            height={16}
          />
          <Image
            alt="emoji of a speaker, second-half of signifying ultra sound base fee per gas"
            src={speakerSvg as StaticImageData}
            width={16}
            height={16}
          />
        </div>
      </>
    ) : (
      <LabelText>{label}</LabelText>
    )}
    <SkeletonText>
      {gas !== undefined && (
        <QuantifyText unitPostfix="Gwei">
          {formatZeroDecimals(gas / WEI_PER_GWEI)}
        </QuantifyText>
      )}
    </SkeletonText>
  </div>
);

type Props = {
  baseFeePerGasStats: BaseFeePerGasStats | undefined;
};

const GasMarketWidget: FC<Props> = ({ baseFeePerGasStats }) => {
  console.log("rendering gas widget");
  const lowest =
    baseFeePerGasStats === undefined
      ? undefined
      : Math.min(baseFeePerGasStats.min, baseFeePerGasStats.barrier);

  const highest =
    baseFeePerGasStats === undefined
      ? undefined
      : Math.max(baseFeePerGasStats.max, baseFeePerGasStats.barrier);

  const markerList =
    baseFeePerGasStats === undefined
      ? []
      : [
          { label: "barrier", gas: baseFeePerGasStats.barrier },
          { label: "min", gas: baseFeePerGasStats.min },
          { label: "max", gas: baseFeePerGasStats.max },
          { label: "average", gas: baseFeePerGasStats.average },
        ].sort(({ gas: gasA }, { gas: gasB }) => gasA - gasB);

  const gasRange =
    highest === undefined || lowest === undefined
      ? undefined
      : highest - lowest;

  const averagePercent =
    baseFeePerGasStats === undefined ||
    gasRange === undefined ||
    lowest === undefined
      ? undefined
      : ((baseFeePerGasStats.average - lowest) / gasRange) * 100;

  const barrierPercent =
    baseFeePerGasStats === undefined ||
    gasRange === undefined ||
    lowest === undefined
      ? undefined
      : ((baseFeePerGasStats.barrier - lowest) / gasRange) * 100;

  const deltaPercent =
    barrierPercent !== undefined && averagePercent !== undefined
      ? averagePercent - barrierPercent
      : undefined;

  return (
    <WidgetErrorBoundary title="gas market">
      <WidgetBackground className="flex flex-col">
        <div className="flex justify-between">
          <LabelText>gas market</LabelText>
          <TimeFrameIndicator
            className="pointer-events-none"
            timeFrame="h1"
            onClickTimeFrame={() => undefined}
          />
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
          {deltaPercent !== undefined && (
            <div
              className={` absolute bg-gradient-to-r ${
                deltaPercent >= 0
                  ? "from-orange-400 to-yellow-500"
                  : "to-indigo-500 from-cyan-300 "
              } h-2`}
              style={{
                left:
                  deltaPercent >= 0
                    ? `${barrierPercent}%`
                    : `${averagePercent}%`,
                width: `${Math.abs(deltaPercent)}%`,
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
                orientation={index % 2 === 0 ? "up" : "down"}
              />
            ))}
        </div>
      </WidgetBackground>
    </WidgetErrorBoundary>
  );
};

export default GasMarketWidget;
