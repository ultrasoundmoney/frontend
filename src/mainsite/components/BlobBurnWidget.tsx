import * as DateFns from "date-fns";
import type { FC } from "react";
import LabelText from "../../components/TextsNext/LabelText";
import { LabelUnitText } from "../../components/TextsNext/LabelUnitText";
import QuantifyText from "../../components/TextsNext/QuantifyText";
import SkeletonText from "../../components/TextsNext/SkeletonText";
import type { FeesBurned } from "../api/grouped-analysis-1";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../components/WidgetSubcomponents";
import {
  decodeGroupedAnalysis1,
  useGroupedAnalysis1,
} from "../api/grouped-analysis-1";
import type { TimeFrame } from "../../mainsite/time-frames";

type Props = {
  timeFrame: TimeFrame;
};

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

const NON_ZERO_DECIMALS = 4;
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

const GasStreakWidget: FC<Props> = ({ timeFrame }) => {
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
      : formatNumber(feesBurned[timeframeFeesBurnedMap[timeFrame]["usd"]]);
  const formattedBurn =
    blobFeeBurn !== undefined ? formatNumber(blobFeeBurn / 1e18) : undefined;

  return (
    <WidgetBackground>
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-x-2">
          <WidgetTitle>blob fee burn</WidgetTitle>
        </div>
        <QuantifyText color="text-slateus-200" className="ml-1" size="text-4xl">
          <SkeletonText width="8rem">{formattedBurn} ETH</SkeletonText>
        </QuantifyText>
        <div className="flex items-center gap-x-1">
          <div className="flex items-baseline gap-x-1">
            <LabelUnitText className="mt-1">
              <SkeletonText width="3rem">{blobFeeBurnUSD}</SkeletonText>
            </LabelUnitText>
            <LabelText className="mt-1">USD</LabelText>
          </div>
        </div>
      </div>
    </WidgetBackground>
  );
};

export default GasStreakWidget;
