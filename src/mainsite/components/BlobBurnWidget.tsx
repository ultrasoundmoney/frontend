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
      : feesBurned[timeframeFeesBurnedMap[timeFrame]["usd"]];
    const formattedBurn =  blobFeeBurn !== undefined ? blobFeeBurn / 1e18 : undefined;

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
