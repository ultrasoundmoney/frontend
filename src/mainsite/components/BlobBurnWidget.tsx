import type { FC } from "react";
import LabelText from "../../components/TextsNext/LabelText";
import type { StaticImageData } from "next/legacy/image";
import { LabelUnitText } from "../../components/TextsNext/LabelUnitText";
import Image from "next/legacy/image";
import SkeletonText from "../../components/TextsNext/SkeletonText";
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
import { formatUsdTwoDecimals, formatUsdZeroDecimals } from "../../format";

const GWEI_FORMATTING_THRESHOLD = 1e15; // Threshold in wei below which to convert format as Gwei instead of ETH
const BURN_DECIMALS = 2;

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
        <div className="flex items-center mb-4">
          <AmountAnimatedShell
            skeletonWidth="9rem"
            size="text-2xl md:text-3xl lg:text-3xl xl:text-4xl"
            unitText={formatBurnAsGwei ? "Gwei" : "ETH"}
          >
            <CountUp
              decimals={BURN_DECIMALS}
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
          <LabelUnitText className="mt-1">
            <SkeletonText width="3rem">            <CountUp
              decimals={BURN_DECIMALS}
              duration={0.8}
              end={blobFeeBurnUSD ?? 0}
              preserveValue={true}
              separator=","
            /></SkeletonText>
          </LabelUnitText>
          <LabelText className="mt-1">USD</LabelText>
        </div>
      </div>
    </WidgetBackground>
  );
};

export default BlobBurnWidget;
