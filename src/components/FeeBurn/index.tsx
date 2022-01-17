import * as DateFns from "date-fns";
import { FC } from "react";
import CountUp from "react-countup";
import Skeleton from "react-loading-skeleton";
import {
  BurnRates,
  FeesBurned,
  useGroupedData1,
} from "../../api/grouped_stats_1";
import { londonHardforkTimestamp } from "../../dates";
import { Unit } from "../../denomination";
import * as Duration from "../../duration";
import * as Format from "../../format";
import { O, pipe } from "../../fp";
import * as StaticEtherData from "../../static-ether-data";
import { LimitedTimeFrameNext, TimeFrameNext } from "../../time_frames";
import { AmountUnitSpace } from "../Spacing";
import SpanMoji from "../SpanMoji";
import WidgetBackground from "../widget-subcomponents/WidgetBackground";
import WidgetTitle from "../widget-subcomponents/WidgetTitle";

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
  onClickTimeFrame: () => void;
  simulateMerge: boolean;
  timeFrame: TimeFrameNext;
  unit: Unit;
};

const CumulativeFeeBurn: FC<Props> = ({
  onClickTimeFrame,
  simulateMerge,
  timeFrame,
  unit,
}) => {
  const feeData = useGroupedData1();
  const burnRates = feeData?.burnRates;
  const feesBurned = feeData?.feesBurned;

  const selectedFeesBurnedEth = pipe(
    feesBurned,
    O.fromNullable,
    O.map((feesBurned) =>
      Format.ethFromWei(feesBurned[timeframeFeesBurnedMap[timeFrame]["eth"]])
    ),
    O.toUndefined
  );

  // In ETH or USD K.
  const selectedFeesBurned = pipe(
    feesBurned,
    O.fromNullable,
    O.map((feesBurned) =>
      unit === "eth"
        ? Format.ethFromWei(
            feesBurned[timeframeFeesBurnedMap[timeFrame]["eth"]]
          )
        : feesBurned[timeframeFeesBurnedMap[timeFrame][unit]] / 1000
    ),
    O.toUndefined
  );

  // In ETH / min or USD K / min.
  const selectedBurnRate =
    burnRates === undefined || null
      ? undefined
      : unit === "eth"
      ? Format.ethFromWei(burnRates[timeframeBurnRateMap[timeFrame][unit]])
      : burnRates[timeframeBurnRateMap[timeFrame][unit]] / 1000;

  // TODO: issuance changes post-merge, update this to switch to proof of stake issuance on time.
  // In ETH.
  const issuancePerMillisecond =
    (simulateMerge
      ? StaticEtherData.posIssuancePerDay
      : StaticEtherData.powIssuancePerDay + StaticEtherData.posIssuancePerDay) /
    Duration.millisFromDays(1);

  const millisecondsSinceLondonHardFork = DateFns.differenceInMilliseconds(
    new Date(),
    londonHardforkTimestamp
  );

  // In ETH.
  const selectedIssuance =
    selectedFeesBurned === undefined
      ? undefined
      : timeFrame === "all"
      ? issuancePerMillisecond * millisecondsSinceLondonHardFork
      : issuancePerMillisecond * timeFrameMillisecondsMap[timeFrame];

  // Fraction.
  const issuanceOffset =
    selectedFeesBurnedEth === undefined || selectedIssuance === undefined
      ? undefined
      : selectedFeesBurnedEth / selectedIssuance;

  // Keeps the width of the fees burned amount the same to make the animation look more stable.
  const startFeesBurned =
    selectedFeesBurned === undefined
      ? undefined
      : 10 ** (selectedFeesBurned.toFixed(0).length - 1);

  return (
    <WidgetBackground>
      <WidgetTitle
        onClickTimeFrame={onClickTimeFrame}
        timeFrame={timeFrame}
        title="burn total"
      />
      <div className="flex flex-col gap-y-8 pt-2">
        <div className="flex items-center font-roboto text-2xl md:text-4xl lg:text-3xl xl:text-4xl">
          <p className="text-white">
            {selectedFeesBurned !== undefined ? (
              <CountUp
                decimals={unit === "eth" ? 2 : 1}
                duration={0.8}
                separator=","
                start={startFeesBurned}
                end={selectedFeesBurned}
                preserveValue={true}
                suffix={unit === "eth" ? undefined : "K"}
              />
            ) : (
              <Skeleton inline={true} width="10rem" />
            )}
            <AmountUnitSpace />
            <span className="font-extralight text-blue-spindle">
              {unit === "eth" ? "ETH" : "USD"}
            </span>
          </p>
          <SpanMoji className="ml-4 md:ml-8" emoji="🔥" />
        </div>
        <div className="flex flex-col justify-between md:flex-row gap-y-8">
          <div>
            <p className="font-inter font-light text-blue-spindle uppercase md:text-md mb-2">
              burn rate
            </p>
            <p className="font-roboto text-white text-2xl">
              {selectedBurnRate !== undefined ? (
                <CountUp
                  decimals={unit === "eth" ? 2 : 1}
                  duration={0.8}
                  separator=","
                  end={selectedBurnRate}
                  preserveValue={true}
                  suffix={unit === "eth" ? undefined : "K"}
                />
              ) : (
                <Skeleton inline={true} width="4rem" />
              )}
              <AmountUnitSpace />
              <span className="font-extralight text-blue-spindle">
                {unit === "eth" ? "ETH/min" : "USD/min"}
              </span>
            </p>
          </div>
          <div className="md:text-right">
            <p className="font-inter font-light text-blue-spindle uppercase md:text-md mb-2">
              {simulateMerge ? "pos issuance offset" : "issuance offset"}
            </p>
            <p className="font-roboto text-white text-2xl">
              {selectedBurnRate !== undefined ? (
                <CountUp
                  decimals={2}
                  duration={0.8}
                  separator=","
                  end={issuanceOffset ?? 0}
                  preserveValue={true}
                  suffix={"x"}
                />
              ) : (
                <Skeleton inline={true} width="4rem" />
              )}
            </p>
          </div>
        </div>
      </div>
    </WidgetBackground>
  );
};

export default CumulativeFeeBurn;
