import type { FC } from "react";
import LabelText from "../../components/TextsNext/LabelText";
import type { StaticImageData } from "next/legacy/image";
import Image from "next/legacy/image";
import CountUp from "react-countup";
import fireSvg from "../../assets/fire-own.svg";
import { AmountAnimatedShell } from "./Amount";
import type { FeesBurned } from "../api/grouped-analysis-1";
import { WidgetBackground } from "../../components/WidgetSubcomponents";
import {
  decodeGroupedAnalysis1,
  useGroupedAnalysis1,
} from "../api/grouped-analysis-1";
import type { TimeFrame } from "../../mainsite/time-frames";
import TimeFrameIndicator from "./TimeFrameIndicator";
import type { OnClick } from "../../components/TimeFrameControl";

const GWEI_FORMATTING_THRESHOLD = 1e15; // Threshold in wei below which to convert format as Gwei instead of ETH
const MIN_BURN_DECIMALS = 2;

const timeframeFeesBurnedMap: Record<
  TimeFrame,
  { eth: keyof FeesBurned; usd: keyof FeesBurned }
> = {
  m5: { eth: "feesBurned5m", usd: "feesBurned5mUsd" },
  h1: { eth: "feesBurned1h", usd: "feesBurned1hUsd" },
  d1: { eth: "feesBurned24h", usd: "feesBurned24hUsd" },
  d7: { eth: "feesBurned7d", usd: "feesBurned7dUsd" },
  d30: { eth: "feesBurned30d", usd: "feesBurned30dUsd" },
  since_merge: { eth: "feesBurnedSinceMerge", usd: "feesBurnedSinceMergeUsd" },
  since_burn: { eth: "feesBurnedSinceBurn", usd: "feesBurnedSinceBurnUsd" },
};

type Props = {
  onClickTimeFrame: OnClick;
  timeFrame: TimeFrame;
};

function firstNonZeroDecimalPosition(num: number) {
  // If the number is >= 1, return 0
  if (num >= 1) {
    return 0;
  }

  // Convert the number to a string to inspect its decimal part
  const strNum = num.toFixed(20).toString();

  // Extract the decimal part by removing everything up to and including the decimal point
  const decimalPart = strNum.split(".")[1] || "";

  // Find the position of the first non-zero digit in the decimal part
  for (let i = 0; i < decimalPart.length; i++) {
    if (decimalPart[i] !== "0") {
      // Return the position (i + 1 because position is 1-indexed in this context)
      return i + 1;
    }
  }

  // If there are no non-zero decimals (or the number is 0), it means all decimals are zero
  return decimalPart.length ? decimalPart.length : 0;
}

const BlobBurnWidget: FC<Props> = ({ onClickTimeFrame, timeFrame }) => {
  const groupedAnalysis1F = useGroupedAnalysis1();
  const groupedAnalysis1 = decodeGroupedAnalysis1(groupedAnalysis1F);
  const feesBurned = groupedAnalysis1?.blobFeeBurns;
  const blobFeeBurn =
    feesBurned === undefined
      ? undefined
      : feesBurned[timeframeFeesBurnedMap[timeFrame]["eth"]];
  const blobFeeBurnUSD =
    feesBurned === undefined
      ? undefined
      : feesBurned[timeframeFeesBurnedMap[timeFrame]["usd"]];
  const burnUSDDecimals =
    blobFeeBurnUSD == undefined
      ? undefined
      : Math.max(
          firstNonZeroDecimalPosition(blobFeeBurnUSD),
          MIN_BURN_DECIMALS,
        );

  const formatBurnAsGwei =
    blobFeeBurn !== undefined && blobFeeBurn < GWEI_FORMATTING_THRESHOLD;
  const formattedBurn =
    blobFeeBurn !== undefined
      ? blobFeeBurn / (formatBurnAsGwei ? 1e9 : 1e18)
      : undefined;

  const burnDecimals =
    formattedBurn == undefined
      ? undefined
      : Math.max(firstNonZeroDecimalPosition(formattedBurn), MIN_BURN_DECIMALS);

  return (
    <WidgetBackground>
      <div className="flex flex-col gap-y-4">
        <div className="flex justify-between">
          <LabelText>blob fee burn</LabelText>
          <TimeFrameIndicator
            timeFrame={timeFrame}
            onClickTimeFrame={onClickTimeFrame}
          />
        </div>
        <div className="mb-4 flex items-center">
          <AmountAnimatedShell
            skeletonWidth="9rem"
            size="text-2xl md:text-3xl lg:text-3xl xl:text-4xl"
            unitText={formatBurnAsGwei ? "Gwei" : "ETH"}
          >
            <CountUp
              decimals={burnDecimals}
              duration={0.8}
              end={formattedBurn ?? 0}
              preserveValue={true}
              separator=","
            />
          </AmountAnimatedShell>
          <div className="ml-4 h-6 w-6 select-none md:ml-8 lg:h-8 lg:w-8">
            <Image
              alt="fire emoji symbolizing ETH burned"
              src={fireSvg as StaticImageData}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-x-1">
        <div className="flex items-baseline gap-x-1">
          <AmountAnimatedShell
            skeletonWidth="2rem"
            size="text-m"
            unitText="USD"
          >
            <CountUp
              decimals={burnUSDDecimals}
              duration={0.8}
              end={blobFeeBurnUSD ?? 0}
              preserveValue={true}
              separator=","
            />
          </AmountAnimatedShell>
        </div>
      </div>
    </WidgetBackground>
  );
};

export default BlobBurnWidget;
