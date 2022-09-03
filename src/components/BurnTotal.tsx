import * as DateFns from "date-fns";
import type { FC } from "react";
import { useContext, useEffect, useState } from "react";
import CountUp from "react-countup";
import Skeleton from "react-loading-skeleton";
import type {
  BurnRates,
  FeesBurned,
  GroupedAnalysis1,
} from "../api/grouped-analysis-1";
import { londonHardfork } from "../dates";
import type { Unit } from "../denomination";
import * as Duration from "../duration";
import { FeatureFlagsContext } from "../feature-flags";
import * as Format from "../format";
import * as StaticEtherData from "../static-ether-data";
import type { LimitedTimeFrameNext, TimeFrameNext } from "../time-frames";
import { AmountAnimatedShell } from "./Amount";
import { TextRoboto } from "./Texts";
import TimeFrameIndicator from "./TimeFrameIndicator";
import Twemoji from "./Twemoji";
import WidgetErrorBoundary from "./WidgetErrorBoundary";
import { WidgetBackground, WidgetTitle } from "./WidgetSubcomponents";

const timeframeFeesBurnedMap: Record<
  TimeFrameNext,
  { eth: keyof FeesBurned; usd: keyof FeesBurned }
> = {
  m5: { eth: "feesBurned5m", usd: "feesBurned5mUsd" },
  h1: { eth: "feesBurned1h", usd: "feesBurned1hUsd" },
  d1: { eth: "feesBurned24h", usd: "feesBurned24hUsd" },
  d7: { eth: "feesBurned7d", usd: "feesBurned7dUsd" },
  d30: { eth: "feesBurned30d", usd: "feesBurned30dUsd" },
  all: { eth: "feesBurnedAll", usd: "feesBurnedAllUsd" },
};

export const timeframeBurnRateMap: Record<
  TimeFrameNext,
  { eth: keyof BurnRates; usd: keyof BurnRates }
> = {
  m5: { eth: "burnRate5m", usd: "burnRate5mUsd" },
  h1: { eth: "burnRate1h", usd: "burnRate1hUsd" },
  d1: { eth: "burnRate24h", usd: "burnRate24hUsd" },
  d7: { eth: "burnRate7d", usd: "burnRate7dUsd" },
  d30: { eth: "burnRate30d", usd: "burnRate30dUsd" },
  all: { eth: "burnRateAll", usd: "burnRateAllUsd" },
};

const timeFrameMillisecondsMap: Record<LimitedTimeFrameNext, number> = {
  d30: Duration.millisFromDays(30),
  d7: Duration.millisFromDays(7),
  d1: Duration.millisFromHours(24),
  h1: Duration.millisFromHours(1),
  m5: Duration.millisFromMinutes(5),
};

type Props = {
  groupedAnalysis1: GroupedAnalysis1;
  onClickTimeFrame: () => void;
  simulateMerge: boolean;
  timeFrame: TimeFrameNext;
  unit: Unit;
};

const BurnTotal: FC<Props> = ({
  groupedAnalysis1,
  onClickTimeFrame,
  simulateMerge,
  timeFrame,
  unit,
}) => {
  const burnRates = groupedAnalysis1.burnRates;
  const feesBurned = groupedAnalysis1.feesBurned;
  const { previewSkeletons } = useContext(FeatureFlagsContext);
  const [millisecondsSinceLondonHardFork, setMillisecondsSinceLondonHardfork] =
    useState<number>();

  const selectedFeesBurnedEth =
    feesBurned === undefined
      ? undefined
      : feesBurned[timeframeFeesBurnedMap[timeFrame]["eth"]];

  // In ETH or USD K.
  const selectedFeesBurned =
    feesBurned === undefined
      ? undefined
      : unit === "eth"
      ? feesBurned[timeframeFeesBurnedMap[timeFrame]["eth"]]
      : feesBurned[timeframeFeesBurnedMap[timeFrame][unit]];

  // In ETH / min or USD K / min.
  const selectedBurnRate =
    burnRates === undefined
      ? undefined
      : unit === "eth"
      ? burnRates[timeframeBurnRateMap[timeFrame][unit]]
      : burnRates[timeframeBurnRateMap[timeFrame][unit]];

  // TODO: issuance changes post-merge, update this to switch to proof of stake issuance on time.
  // In ETH.
  const issuancePerMillisecond =
    (simulateMerge
      ? StaticEtherData.posIssuancePerDay
      : StaticEtherData.powIssuancePerDay + StaticEtherData.posIssuancePerDay) /
    Duration.millisFromDays(1);

  useEffect(() => {
    setMillisecondsSinceLondonHardfork(
      DateFns.differenceInMilliseconds(new Date(), londonHardfork),
    );
  }, []);

  // In ETH.
  const selectedIssuance =
    selectedFeesBurned === undefined ||
    millisecondsSinceLondonHardFork === undefined
      ? undefined
      : timeFrame === "all"
      ? issuancePerMillisecond * millisecondsSinceLondonHardFork
      : issuancePerMillisecond * timeFrameMillisecondsMap[timeFrame];

  // Fraction.
  const issuanceOffset =
    selectedFeesBurnedEth === undefined || selectedIssuance === undefined
      ? undefined
      : Format.ethFromWei(selectedFeesBurnedEth) / selectedIssuance;

  return (
    <WidgetErrorBoundary title="burn total">
      <WidgetBackground className="relative overflow-hidden">
        <div
          className={`
            absolute top-15 md:top-20 -left-20
            w-full h-full
            opacity-[0.13]
            blur-[50px] md:blur-[70px]
            pointer-events-none
            will-change-transform
          `}
        >
          <div
            className={`
              absolute
              w-4/5 h-4/5 md:w-3/5 md:h-3/5 rounded-[35%]
              bg-[#243AFF]
              pointer-events-none
            `}
          ></div>
        </div>
        <div
          className={`
            absolute top-0 md:top-5 -left-20
            w-full h-full
            opacity-[0.25]
            blur-[50px] md:blur-[70px]
            pointer-events-none
            will-change-transform
          `}
        >
          <div
            className={`
              absolute
              -left-5 md:left-0
              w-full h-4/5 md:w-4/5 md:h-3/5 rounded-[35%]
              bg-[#FF8D24]
              pointer-events-none
            `}
          ></div>
        </div>
        <div className="flex items-center justify-between">
          <WidgetTitle>burn total</WidgetTitle>
          <TimeFrameIndicator
            onClickTimeFrame={onClickTimeFrame}
            timeFrame={timeFrame}
          />
        </div>
        <div className="flex flex-col gap-y-4 pt-4">
          <div
            className={`
            flex items-center
            text-2xl md:text-3xl lg:text-3xl xl:text-4xl
          `}
          >
            <AmountAnimatedShell
              skeletonWidth="9rem"
              textClassName=""
              unitText={unit === "eth" ? "ETH" : "USD"}
            >
              {selectedFeesBurned && (
                <CountUp
                  decimals={unit === "eth" ? 2 : 0}
                  duration={0.8}
                  end={
                    unit === "eth"
                      ? Format.ethFromWei(selectedFeesBurned)
                      : selectedFeesBurned
                  }
                  preserveValue={true}
                  separator=","
                />
              )}
            </AmountAnimatedShell>
            <div className="ml-4 md:ml-8">
              <Twemoji imageClassName="h-6 lg:h-8 select-none" wrapper>
                🔥
              </Twemoji>
            </div>
          </div>
          <div className="flex flex-col gap-y-4 justify-between lg:flex-row">
            <div className="flex flex-col gap-y-4">
              <WidgetTitle>burn rate</WidgetTitle>
              <AmountAnimatedShell
                skeletonWidth="4rem"
                textClassName="text-2xl md:text-3xl lg:text-2xl xl:text-4xl"
                unitText={unit === "eth" ? "ETH/min" : "USD/min"}
              >
                {selectedBurnRate && (
                  <CountUp
                    decimals={unit === "eth" ? 2 : 1}
                    duration={0.8}
                    end={
                      unit === "eth"
                        ? Format.ethFromWei(selectedBurnRate)
                        : selectedBurnRate / 1000
                    }
                    preserveValue={true}
                    separator=","
                    suffix={unit === "usd" ? "K" : ""}
                  />
                )}
              </AmountAnimatedShell>
            </div>
            <div className="lg:text-right flex flex-col gap-y-4">
              <WidgetTitle>
                {simulateMerge ? "pos issuance offset" : "issuance offset"}
              </WidgetTitle>
              <TextRoboto className="text-2xl md:text-3xl lg:text-2xl xl:text-4xl">
                {selectedBurnRate === undefined || previewSkeletons ? (
                  <Skeleton inline={true} width="4rem" />
                ) : (
                  <CountUp
                    decimals={2}
                    duration={0.8}
                    separator=","
                    end={issuanceOffset ?? 0}
                    preserveValue={true}
                    suffix={"x"}
                  />
                )}
              </TextRoboto>
            </div>
          </div>
        </div>
      </WidgetBackground>
    </WidgetErrorBoundary>
  );
};

export default BurnTotal;
