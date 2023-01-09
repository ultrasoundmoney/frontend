import type { BaseFeePerGasStatsTimeFrame } from "../api/base-fee-per-gas-stats";
import { useBaseFeePerGasStats } from "../api/base-fee-per-gas-stats";
import WidgetErrorBoundary from "./WidgetErrorBoundary";
import { WidgetBackground } from "./WidgetSubcomponents";
import LabelText from "./TextsNext/LabelText";
import TimeFrameIndicator from "./TimeFrameIndicator";
import type { FC } from "react";
import QuantifyText from "./TextsNext/QuantifyText";
import { formatOneDecimal, formatTwoDigit } from "../format";
import { WEI_PER_GWEI } from "../eth-units";
import type { StaticImageData } from "next/legacy/image";
import Image from "next/legacy/image";
import batSvg from "../assets/bat-own.svg";
import speakerSvg from "../assets/speaker-own.svg";
import barrierSvg from "../assets/barrier-own.svg";
import type { TimeFrameNext } from "../time-frames";
import { animated, useSpring } from "react-spring";
import CountUp from "react-countup";

const getPercentage = (
  highest: number,
  lowest: number,
  gas: number,
): number => {
  const range = highest - lowest;
  return (gas - lowest) / range;
};

const formatGasTooltip = (
  description: string | undefined,
  gas: number,
): string | undefined => {
  if (description === undefined) {
    return undefined;
  }
  const gasStr = formatTwoDigit(gas);
  return `${description}
${gasStr} Gwei`;
};

const getBlockPageLink = (u: unknown): string | undefined =>
  typeof u === undefined ? undefined : `https://etherscan.io/block/${u}`;

type MarkerProps = {
  barrier: number;
  blockNumber?: number;
  description?: string;
  emphasize?: boolean;
  gas: number;
  highest: number;
  horizontal: "left" | "right";
  label: string;
  lowest: number;
  markerColor: string;
  vertical: "top" | "bottom";
};

const Marker: FC<MarkerProps> = ({
  barrier,
  blockNumber,
  description,
  emphasize = false,
  gas,
  highest,
  horizontal,
  label,
  lowest,
  markerColor,
  vertical,
}) => {
  // TODO: rewrite to use translation
  const styles = useSpring({
    left: `${getPercentage(highest, lowest, gas) * 100}%`,
  });

  return (
    <animated.div
      className={`
        absolute flex
        -translate-x-1/2 flex-col items-center
        ${vertical === "top" ? "-top-[48px]" : "-bottom-[40px]"}
      `}
      style={styles}
      title={formatGasTooltip(description, gas / WEI_PER_GWEI)}
    >
      {vertical === "bottom" && (
        <div
          className={`
            h-12 w-px
            rounded-b-full
            ${markerColor}
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
            ${vertical === "top" ? "top-2" : "top-3"}
            ${horizontal === "right" ? "left-2" : "right-2"}
            ${emphasize ? "" : "text-slateus-400"}
          `}
        >
          {label}
        </LabelText>
      )}
      <QuantifyText
        className={`
          absolute
          ${vertical === "top" ? "top-6" : "top-7"}
          ${horizontal === "right" ? "left-2" : "right-2"}
        `}
        color={
          label === "average"
            ? `bg-gradient-to-r bg-clip-text text-transparent ${
                gas >= barrier
                  ? "from-orange-400 to-yellow-300"
                  : "from-cyan-300 to-indigo-500"
              }`
            : emphasize
            ? "text-white"
            : "text-slateus-200"
        }
        size="text-sm"
        unitPostfix={vertical === "top" ? "Gwei" : undefined}
      >
        <a
          href={getBlockPageLink(blockNumber)}
          target="_blank"
          rel="noreferrer"
        >
          <CountUp
            end={gas / WEI_PER_GWEI}
            preserveValue
            formattingFn={formatOneDecimal}
            duration={1}
            useEasing
            decimals={1}
          />
        </a>
      </QuantifyText>
      {vertical === "top" && (
        <div className={`mt-2 h-12 w-px rounded-t-full ${markerColor}`}></div>
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
  const barrier = baseFeePerGasStats.barrier * WEI_PER_GWEI;
  const baseFeePerGasStatsTimeFrame =
    baseFeePerGasStats?.[timeFrame] ??
    (undefined as BaseFeePerGasStatsTimeFrame | undefined);
  const barPaddingFactor = 0.08;
  const lowest =
    baseFeePerGasStatsTimeFrame === undefined ||
    baseFeePerGasStats === undefined
      ? undefined
      : Math.min(barrier, baseFeePerGasStatsTimeFrame.min) -
        Math.max(baseFeePerGasStatsTimeFrame.max, barrier) * barPaddingFactor;

  const highest =
    baseFeePerGasStatsTimeFrame === undefined ||
    baseFeePerGasStats === undefined
      ? undefined
      : Math.max(baseFeePerGasStatsTimeFrame.max, barrier) *
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
      : ((barrier - lowest) / gasRange) * 100;

  const deltaPercent =
    barrierPercent !== undefined && averagePercent !== undefined
      ? averagePercent - barrierPercent
      : undefined;

  const isDataAvailable =
    baseFeePerGasStats !== undefined &&
    baseFeePerGasStatsTimeFrame !== undefined &&
    highest !== undefined &&
    lowest !== undefined &&
    deltaPercent !== undefined;

  const deltaLeft =
    deltaPercent === undefined
      ? undefined
      : deltaPercent >= 0
      ? `${barrierPercent}%`
      : `${averagePercent}%`;

  const deltaWidth =
    deltaPercent === undefined ? undefined : `${Math.abs(deltaPercent)}%`;

  return (
    <WidgetErrorBoundary title="gas market">
      <WidgetBackground className="flex flex-col gap-y-4">
        <div className="flex justify-between">
          <LabelText>gas market</LabelText>
          <TimeFrameIndicator
            timeFrame={timeFrame}
            onClickTimeFrame={onClickTimeFrame}
          />
        </div>
        {baseFeePerGasStatsTimeFrame === undefined ? (
          <div className="flex h-[96px] items-center justify-center">
            <LabelText color="text-slateus-300">
              data not yet available
            </LabelText>
          </div>
        ) : (
          <div
            className={`
              relative
              my-11
              mx-11
              flex
              h-2
              rounded-full
              bg-slateus-600
            `}
          >
            {isDataAvailable && (
              <>
                <Marker
                  barrier={barrier}
                  blockNumber={baseFeePerGasStatsTimeFrame.min_block_number}
                  description="minimum gas price"
                  gas={baseFeePerGasStatsTimeFrame.min}
                  highest={highest}
                  horizontal="left"
                  label="min"
                  lowest={lowest}
                  markerColor="bg-slateus-400"
                  vertical="bottom"
                />
                <Marker
                  barrier={barrier}
                  blockNumber={baseFeePerGasStatsTimeFrame.max_block_number}
                  description="maximum gas price"
                  gas={baseFeePerGasStatsTimeFrame.max}
                  highest={highest}
                  horizontal="right"
                  label="max"
                  lowest={lowest}
                  markerColor="bg-slateus-400"
                  vertical="bottom"
                />
                <Marker
                  barrier={barrier}
                  description="average gas price"
                  emphasize
                  gas={baseFeePerGasStatsTimeFrame.average}
                  highest={highest}
                  horizontal={
                    baseFeePerGasStatsTimeFrame.average > barrier
                      ? "right"
                      : "left"
                  }
                  label="average"
                  lowest={lowest}
                  markerColor={
                    deltaPercent >= 0 ? "bg-orange-400" : "bg-blue-400"
                  }
                  vertical="top"
                />
                <Marker
                  barrier={barrier}
                  description="ultra sound barrier"
                  emphasize
                  gas={barrier}
                  highest={highest}
                  horizontal={
                    barrier <= baseFeePerGasStatsTimeFrame.average
                      ? "left"
                      : "right"
                  }
                  label="barrier"
                  lowest={lowest}
                  markerColor={
                    deltaPercent >= 0 ? "bg-orange-400" : "bg-blue-400"
                  }
                  vertical="top"
                />
              </>
            )}
            {deltaPercent !== undefined && (
              <div
                className={`
                  absolute h-2
                  ${deltaPercent >= 0 ? "bg-orange-400" : "bg-drop"}
                `}
                style={{
                  left: deltaLeft,
                  width: deltaWidth,
                }}
              ></div>
            )}
          </div>
        )}
      </WidgetBackground>
    </WidgetErrorBoundary>
  );
};

export default GasMarketWidget;
