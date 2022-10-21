import type { BaseFeePerGasStatsTimeFrame } from "../api/base-fee-per-gas-stats";
import { useBaseFeePerGasStats } from "../api/base-fee-per-gas-stats";
import WidgetErrorBoundary from "./WidgetErrorBoundary";
import { WidgetBackground } from "./WidgetSubcomponents";
import LabelText from "./TextsNext/LabelText";
import TimeFrameIndicator from "./TimeFrameIndicator";
import type { FC } from "react";
import QuantifyText from "./TextsNext/QuantifyText";
import SkeletonText from "./TextsNext/SkeletonText";
import { formatOneDecimal, formatTwoDigit } from "../format";
import { WEI_PER_GWEI } from "../eth-units";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import batSvg from "../assets/bat-own.svg";
import speakerSvg from "../assets/speaker-own.svg";
import barrierSvg from "../assets/barrier-own.svg";
import type { TimeFrameNext } from "../time-frames";
import { animated, config, useSpring } from "react-spring";

const getPercentage = (
  highest: number,
  lowest: number,
  gas: number,
): number => {
  const range = highest - lowest;
  return (gas - lowest) / range;
};

const formatTooltip = (
  description: string | undefined,
  gas: number,
): string | undefined => {
  if (description === undefined) {
    return undefined;
  }
  const gasStr = formatTwoDigit(gas / WEI_PER_GWEI);
  return `${description}
${gasStr} Gwei`;
};

type MarkerProps = {
  emphasize?: boolean;
  gas: number;
  highest: number;
  label: string;
  lowest: number;
  vertical: "top" | "bottom";
  horizontal: "left" | "right";
  description?: string;
};

const Marker: FC<MarkerProps> = ({
  description,
  emphasize = false,
  gas,
  highest,
  horizontal,
  label,
  lowest,
  vertical: orientation,
}) => {
  const styles = useSpring({
    left: `${getPercentage(highest, lowest, gas) * 100}%`,
  });

  return (
    <animated.div
      className={`
        absolute flex
        -translate-x-1/2 flex-col items-center
        ${orientation === "top" ? "-top-[48px]" : "-bottom-[56px]"}
        ${label === "barrier-max" || label === "barrier-min" ? "invisible" : ""}
      `}
      style={styles}
      title={formatTooltip(description, gas)}
    >
      {orientation === "bottom" && (
        <div
          className={`
          mb-2
          h-12 w-0.5
          rounded-b-full bg-slateus-600
        `}
        ></div>
      )}
      {label === "barrier" ? (
        <>
          <div
            className={`
            absolute top-2 flex h-[15px]
            w-[53px] select-none gap-x-1
            ${horizontal === "right" ? "left-2" : "right-2"}
          `}
          >
            <Image
              alt="emoji of a bat, first-half of signifying ultra sound base fee per gas"
              src={batSvg as StaticImageData}
              width={15}
              height={15}
            />
            <Image
              alt="emoji of a speaker, second-half of signifying ultra sound base fee per gas"
              src={speakerSvg as StaticImageData}
              width={15}
              height={15}
            />
            <Image
              alt="emoji of a barrier, third-half of signifying ultra sound base fee per gas"
              src={barrierSvg as StaticImageData}
              width={15}
              height={15}
            />
          </div>
        </>
      ) : (
        <LabelText
          color={emphasize ? undefined : "text-slateus-400"}
          className={`
          absolute top-2
          ${horizontal === "right" ? "left-2" : "right-2"}
          ${emphasize ? "" : "text-slateus-400"}
        `}
        >
          {label}
        </LabelText>
      )}
      <QuantifyText
        className={`
        absolute top-6
        ${horizontal === "right" ? "left-2" : "right-2"}
      `}
        color={emphasize ? "text-white" : "text-slateus-200"}
        size="text-sm"
      >
        {formatOneDecimal(gas / WEI_PER_GWEI)}
      </QuantifyText>
      {orientation === "top" && (
        <div className={`mt-2 h-12 w-0.5 rounded-t-full bg-slateus-200`}></div>
      )}
    </animated.div>
  );
};

type Props = {
  onClickTimeFrame: () => void;
  timeFrame: TimeFrameNext;
};

const GasMarketWidget: FC<Props> = ({ onClickTimeFrame, timeFrame }) => {
  const baseFeePerGasStats = useBaseFeePerGasStats();
  const baseFeePerGasStatsTimeFrame =
    baseFeePerGasStats?.[timeFrame] ??
    (undefined as BaseFeePerGasStatsTimeFrame | undefined);
  const barPaddingFactor = 0.08;
  const lowest =
    baseFeePerGasStatsTimeFrame === undefined ||
    baseFeePerGasStats === undefined
      ? undefined
      : Math.min(baseFeePerGasStats.barrier, baseFeePerGasStatsTimeFrame.min) -
        Math.max(baseFeePerGasStatsTimeFrame.max, baseFeePerGasStats.barrier) *
          barPaddingFactor;

  const highest =
    baseFeePerGasStatsTimeFrame === undefined ||
    baseFeePerGasStats === undefined
      ? undefined
      : Math.max(baseFeePerGasStatsTimeFrame.max, baseFeePerGasStats.barrier) *
        (1 + barPaddingFactor);

  const gasRange =
    highest === undefined || lowest === undefined
      ? undefined
      : highest - lowest;

  const averagePercent =
    baseFeePerGasStatsTimeFrame === undefined ||
    gasRange === undefined ||
    lowest === undefined
      ? undefined
      : ((baseFeePerGasStatsTimeFrame.average - lowest) / gasRange) * 100;

  const barrierPercent =
    baseFeePerGasStatsTimeFrame === undefined ||
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
    <WidgetErrorBoundary title="gas market (Gwei)">
      <WidgetBackground className="flex flex-col gap-y-4">
        <div className="flex justify-between">
          <LabelText>gas market</LabelText>
          <TimeFrameIndicator
            timeFrame={timeFrame}
            onClickTimeFrame={onClickTimeFrame}
          />
        </div>
        {baseFeePerGasStatsTimeFrame === undefined ? (
          <div className="flex h-[120px] items-center justify-center">
            <LabelText color="text-slateus-300">
              {timeFrame} time frame not yet available
            </LabelText>
          </div>
        ) : (
          <div
            className={`
              relative
              my-14
              flex
              h-2
              rounded-full
              bg-blue-highlightbg
            `}
          >
            {deltaPercent !== undefined && (
              <div
                className={`
                  absolute h-2
                  bg-gradient-to-r
                  ${
                    deltaPercent >= 0
                      ? "from-orange-400 to-yellow-500"
                      : "from-cyan-300 to-indigo-500"
                  }
                `}
                style={{
                  left:
                    deltaPercent >= 0
                      ? `${barrierPercent}%`
                      : `${averagePercent}%`,
                  width: `${Math.abs(deltaPercent)}%`,
                }}
              ></div>
            )}
            {baseFeePerGasStats !== undefined &&
              baseFeePerGasStatsTimeFrame !== undefined &&
              highest !== undefined &&
              lowest !== undefined && (
                <>
                  <Marker
                    description="minimum gas price"
                    gas={baseFeePerGasStatsTimeFrame.min}
                    highest={highest}
                    horizontal="left"
                    label="min"
                    lowest={lowest}
                    vertical="bottom"
                  />
                  <Marker
                    description="maximum gas price"
                    gas={baseFeePerGasStatsTimeFrame.max}
                    highest={highest}
                    horizontal="right"
                    label="max"
                    lowest={lowest}
                    vertical="bottom"
                  />
                  <Marker
                    description="average gas price"
                    gas={baseFeePerGasStatsTimeFrame.average}
                    highest={highest}
                    horizontal={
                      baseFeePerGasStatsTimeFrame.average >
                      baseFeePerGasStats.barrier
                        ? "right"
                        : "left"
                    }
                    label="average"
                    lowest={lowest}
                    vertical="top"
                  />
                  <Marker
                    description="ultra sound barrier"
                    gas={baseFeePerGasStats.barrier}
                    highest={highest}
                    horizontal={
                      baseFeePerGasStats.barrier <=
                      baseFeePerGasStatsTimeFrame.average
                        ? "left"
                        : "right"
                    }
                    label="barrier"
                    lowest={lowest}
                    vertical="top"
                  />
                </>
              )}
          </div>
        )}
      </WidgetBackground>
    </WidgetErrorBoundary>
  );
};

export default GasMarketWidget;
