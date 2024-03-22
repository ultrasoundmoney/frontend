import type { FC } from "react";
import LabelText from "../../components/TextsNext/LabelText";
import { LabelUnitText } from "../../components/TextsNext/LabelUnitText";
import QuantifyText from "../../components/TextsNext/QuantifyText";
import SkeletonText from "../../components/TextsNext/SkeletonText";
import CountUp from "react-countup";
import { AmountAnimatedShell } from "./Amount";
import type { FeesBurned } from "../api/grouped-analysis-1";
import { WidgetBackground } from "../../components/WidgetSubcomponents";
import {
  decodeGroupedAnalysis1,
  useGroupedAnalysis1,
} from "../api/grouped-analysis-1";
import type { TimeFrame } from "../../mainsite/time-frames";
import TimeFrameIndicator from "./TimeFrameIndicator";

const GWEI_FORMATTING_THRESHOLD = 1e15; // Threshold in wei below which to convert format as Gwei instead of ETH
const ETH_BURN_DECIMALS=3;
const USD_BURN_DECIMALS=9;

function addCommas(inputNumber: number) {
    // Convert number to string without scientific notation
    let strNumber = inputNumber.toFixed(20).replace(/\.?0+$/, '');

    // Split the number into integer and fractional parts
    let parts = strNumber.split(".");
    let integerPart = parts[0];
    let fractionalPart = parts[1] || "";

    // Add commas to the integer part
    let integerWithCommas = integerPart?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Add commas to the fractional part
    let fractionalWithCommas = fractionalPart.replace(/\d{3}(?=\d)/g, match => match + ',');

    // Combine integer and fractional parts
    let result = integerWithCommas + (fractionalPart ? "." + fractionalWithCommas : "");

    return result;
}

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

const NON_ZERO_DECIMALS = 2;
// Should format number to the precision of the first couple of non-zero digits
function formatNumber(num: number) {
  // Handle zero separately to avoid complications
  if (num === 0) return "0";

  // Convert to string using toFixed with enough precision
  let numStr = num.toFixed(20);

  // Check for scientific notation and convert if necessary
  if (numStr.indexOf("e") !== -1) {
    const [base, exponent] = num
      .toString()
      .split("e")
      .map((item) => parseInt(item, 10));
    if (exponent !== undefined && base !== undefined) {
      numStr = (base * Math.pow(10, exponent - 20)).toFixed(20);
    }
  }

  // Remove trailing zeros and the decimal point if not needed
  numStr = numStr.replace(/\.?0+$/, "");

  // Find the first non-zero digit after the decimal
  const start = numStr.indexOf(".") + 1;
  let nonZeroDecimals = 0;
  let end = start;
  for (let i = start; i < numStr.length; i++) {
    if (numStr[i] !== "0" || nonZeroDecimals > 0) {
      nonZeroDecimals++;
    }
    end = i + 1;
    if (nonZeroDecimals === NON_ZERO_DECIMALS) break;
  }

  // Ensure the string is not longer than necessary to show the first NON_ZERO_DECIMALS non-zero decimals
  numStr = numStr.slice(0, end);

  // Handling very small numbers that become empty after removing trailing zeros
  if (numStr === "" || numStr === "-") return "0";

  return numStr;
}

type Props = {
  onClickTimeFrame: () => void;
  timeFrame: TimeFrame;
};

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
      : addCommas(parseFloat(feesBurned[timeframeFeesBurnedMap[timeFrame]["usd"]].toFixed(USD_BURN_DECIMALS)));

  const formatBurnAsGwei =
    blobFeeBurn !== undefined && blobFeeBurn < GWEI_FORMATTING_THRESHOLD;
  const formattedBurn =
    blobFeeBurn !== undefined
      ? blobFeeBurn / (formatBurnAsGwei ? 1e9 : 1e18)
      : undefined;

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
        <div className="flex flex-col gap-y-4 pt-4">
          <div className="flex items-center">
            <AmountAnimatedShell
              skeletonWidth="9rem"
              size="text-2xl md:text-3xl lg:text-3xl xl:text-4xl"
              unitText={formatBurnAsGwei ? "Gwei" : "ETH"}
            >
              <CountUp
                decimals={ETH_BURN_DECIMALS}
                duration={0.8}
                end={formattedBurn ?? 0}
                preserveValue={true}
                separator=","
              />
            </AmountAnimatedShell>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-x-1">
        <div className="flex items-baseline gap-x-1">
          <LabelUnitText className="mt-1">
            <SkeletonText width="3rem">{blobFeeBurnUSD}</SkeletonText>
          </LabelUnitText>
          <LabelText className="mt-1">USD</LabelText>
        </div>
      </div>
    </WidgetBackground>
  );
};

export default BlobBurnWidget;
