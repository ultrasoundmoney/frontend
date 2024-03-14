import { animated, useSpring } from "@react-spring/web";
import type { StaticImageData } from "next/legacy/image";
import Image from "next/legacy/image";
import type { FC } from "react";
import CountUp from "react-countup";
import batSvg from "../../assets/bat-own.svg";
import speakerSvg from "../../assets/speaker-own.svg";
import LabelText from "../../components/TextsNext/LabelText";
import QuantifyText from "../../components/TextsNext/QuantifyText";
import WidgetErrorBoundary from "../../components/WidgetErrorBoundary";
import { WidgetBackground } from "../../components/WidgetSubcomponents";
import { WEI_PER_GWEI } from "../../eth-units";
import { formatOneDecimal } from "../../format";
import { useBaseFeePerGasStatsTimeFrame } from "../api/base-fee-per-gas-stats";
import type { TimeFrame } from "../time-frames";
import TimeFrameIndicator from "./TimeFrameIndicator";

const GWEI_FORMATTING_THRESHOLD = 100_000_000; // Threshold in wei above which to convert to / format as Gwei

const getPercentage = (
  highest: number,
  lowest: number,
  gas: number,
): number => {
  const range = highest - lowest;
  return (gas - lowest) / range;
};

const getBlockPageLink = (u: number | undefined): string | undefined =>
  typeof u === "undefined" ? undefined : `https://etherscan.io/block/${u}`;

type MarkerProps = {
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
  convertToGwei: boolean;
};

const Marker: FC<MarkerProps> = ({
  blockNumber,
  emphasize = false,
  gas,
  highest,
  horizontal,
  label,
  lowest,
  markerColor,
  vertical,
  convertToGwei,
}) => {
  // TODO: rewrite to use translation
  const styles = useSpring({
    left: `${getPercentage(highest, lowest, gas) * 100}%`,
  });

  const gasFormatted = convertToGwei ? gas / WEI_PER_GWEI : gas;
  const unit = convertToGwei ? "Gwei" : "Wei";
  const decimals = convertToGwei ? 2 : 0;

  return (
    <animated.div
      className={`
        absolute flex
        -translate-x-1/2 flex-col items-center
        ${vertical === "top" ? "-top-[48px]" : "-bottom-[40px]"}
      `}
      style={styles}
      title="ultra sound barrier"
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
      <QuantifyText
        className={`
          absolute
          ${vertical === "top" ? "top-6" : "top-7"}
          ${horizontal === "right" ? "left-2" : "right-2"}
        `}
        color={
          label === "average"
            ? "bg-gradient-to-r bg-clip-text text-transparent from-orange-400 to-yellow-300"
            : emphasize
            ? "text-white"
            : "text-slateus-200"
        }
        size="text-sm"
        unitPostfix={vertical === "top" ? unit : undefined}
      >
        <a
          href={getBlockPageLink(blockNumber)}
          target="_blank"
          rel="noreferrer"
        >
          <CountUp
            end={gasFormatted}
            preserveValue
            formattingFn={formatOneDecimal}
            duration={1}
            useEasing
            decimals={decimals}
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
  timeFrame: TimeFrame;
};

const GasMarketWidget: FC<Props> = ({ onClickTimeFrame, timeFrame }) => {
  const baseFeePerGasStatsTimeFrame = useBaseFeePerGasStatsTimeFrame(
    timeFrame,
    true,
  );
  const barPaddingFactor = 0.08;

  const lowest =
    baseFeePerGasStatsTimeFrame === undefined
      ? undefined
      : baseFeePerGasStatsTimeFrame.min -
        baseFeePerGasStatsTimeFrame.max * barPaddingFactor;

  const highest =
    baseFeePerGasStatsTimeFrame === undefined
      ? undefined
      : baseFeePerGasStatsTimeFrame.max * (1 + barPaddingFactor);

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

  const isDataAvailable =
    baseFeePerGasStatsTimeFrame !== undefined &&
    highest !== undefined &&
    lowest !== undefined &&
    averagePercent !== undefined;

  const deltaLeft = `${averagePercent}%`;

  const deltaWidth =
    averagePercent === undefined ? undefined : `${Math.abs(averagePercent)}%`;

  const convertToGwei = baseFeePerGasStatsTimeFrame !== undefined && baseFeePerGasStatsTimeFrame.max > GWEI_FORMATTING_THRESHOLD;

  return (
    <WidgetErrorBoundary title="blob gas market">
      <WidgetBackground className="flex flex-col gap-y-4">
        <div className="flex justify-between">
          <LabelText>blob gas market</LabelText>
          <TimeFrameIndicator
            timeFrame={timeFrame}
            onClickTimeFrame={onClickTimeFrame}
          />
        </div>
        {!isDataAvailable ? (
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
            <>
              <Marker
                barrier={0}
                blockNumber={baseFeePerGasStatsTimeFrame.min_block_number}
                description="minimum gas price"
                gas={baseFeePerGasStatsTimeFrame.min}
                highest={highest}
                horizontal="left"
                label="min"
                lowest={lowest}
                markerColor="bg-slateus-400"
                vertical="bottom"
                convertToGwei={convertToGwei}
              />
              <Marker
                barrier={0}
                blockNumber={baseFeePerGasStatsTimeFrame.max_block_number}
                description="maximum gas price"
                gas={baseFeePerGasStatsTimeFrame.max}
                highest={highest}
                horizontal="right"
                label="max"
                lowest={lowest}
                markerColor="bg-slateus-400"
                vertical="bottom"
                convertToGwei={convertToGwei}
              />
              <Marker
                barrier={0}
                description="average gas price"
                emphasize
                gas={baseFeePerGasStatsTimeFrame.average}
                highest={highest}
                horizontal="right"
                label="average"
                lowest={lowest}
                markerColor={
                  averagePercent >= 0 ? "bg-orange-400" : "bg-blue-400"
                }
                vertical="top"
                convertToGwei={convertToGwei}
              />
            </>
          </div>
        )}
      </WidgetBackground>
    </WidgetErrorBoundary>
  );
};

export default GasMarketWidget;
