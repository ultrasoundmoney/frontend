import { useContext, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import useSWR from "swr";
import { getDomain } from "../config";
import * as Duration from "../duration";
import type { Wei } from "../eth-units";
import { FeatureFlagsContext } from "../feature-flags";
import type { BurnRecords, BurnRecordsF } from "./burn-records";
import { decodeBurnRecords } from "./burn-records";
import fetcher from "./default-fetcher";
import { feesWsUrl } from "./fees";
import type { Leaderboards } from "./leaderboards";

type WeiPerMinute = number;

export type BurnRates = {
  burnRate5m: WeiPerMinute;
  burnRate5mUsd: number;
  burnRate1h: WeiPerMinute;
  burnRate1hUsd: number;
  burnRate24h: WeiPerMinute;
  burnRate24hUsd: number;
  burnRate30d: WeiPerMinute;
  burnRate30dUsd: number;
  burnRate7d: WeiPerMinute;
  burnRate7dUsd: number;
  burnRateAll: WeiPerMinute;
  burnRateAllUsd: number;
};

export type FeesBurned = {
  feesBurned5m: Wei;
  feesBurned5mUsd: number;
  feesBurned1h: Wei;
  feesBurned1hUsd: number;
  feesBurned24h: Wei;
  feesBurned24hUsd: number;
  feesBurned7d: Wei;
  feesBurned7dUsd: number;
  feesBurned30d: Wei;
  feesBurned30dUsd: number;
  feesBurnedAll: Wei;
  feesBurnedAllUsd: number;
};

export type LatestBlock = {
  fees: Wei;
  feesUsd: number;
  number: number;
  baseFeePerGas: Wei;
  minedAt: string;
};

export type EthPrice = {
  usd: number;
  usd24hChange: number;
  btc: number;
  btc24hChange: number;
};

export type DeflationaryStreakMode = "preMerge" | "postMerge";
export type DeflationaryStreak = {
  startedOn: string;
  count: number;
};
export type DeflationaryStreakState = Record<
  DeflationaryStreakMode,
  DeflationaryStreak | null
>;
export type GroupedAnalysis1 = {
  baseFeePerGas: number;
  burnRates: BurnRates;
  burnRecords: BurnRecords["records"];
  deflationaryStreak: DeflationaryStreakState;
  ethPrice: EthPrice | undefined;
  feesBurned: FeesBurned;
  latestBlockFees: LatestBlock[];
  leaderboards: Leaderboards;
  number: number;
};

export type GroupedAnalysis1F = {
  baseFeePerGas: number;
  burnRates: BurnRates;
  burnRecords: BurnRecordsF["records"];
  deflationaryStreak: DeflationaryStreakState;
  ethPrice: EthPrice | undefined;
  feesBurned: FeesBurned;
  latestBlockFees: LatestBlock[];
  leaderboards: Leaderboards;
  number: number;
};

export const decodeGroupedAnalysis1 = (
  raw: GroupedAnalysis1F,
): GroupedAnalysis1 => ({
  ...raw,
  burnRecords: decodeBurnRecords({
    number: raw.number,
    records: raw.burnRecords,
  }).records,
});

export const useGroupedAnalysis1 = (): GroupedAnalysis1F | undefined => {
  const { data } = useSWR<GroupedAnalysis1F>(
    `${getDomain()}/api/fees/grouped-analysis-1`,
    fetcher,
    {
      refreshInterval: Duration.millisFromSeconds(1),
      suspense: true,
    },
  );

  return data;
};

type GroupedAnallysis1Envelope = {
  id: "grouped-analysis-1";
  message: GroupedAnalysis1F;
};

const getIsGroupedAnalysisMessage = (
  u: unknown,
): u is GroupedAnallysis1Envelope =>
  u != null &&
  typeof (u as GroupedAnallysis1Envelope).id === "string" &&
  (u as GroupedAnallysis1Envelope).id === "grouped-analysis-1";

export const useGroupedAnalysis1Ws = (): // enabled: boolean,
GroupedAnalysis1F | undefined => {
  const { useWebSockets } = useContext(FeatureFlagsContext);
  const [latestGroupedAnalysis1, setLatestGroupedAnalysis1] =
    useState<GroupedAnalysis1F>();
  const [socketUrl] = useState(feesWsUrl);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { lastJsonMessage } = useWebSocket(
    socketUrl,
    {
      onOpen: () => console.log("ws opened"),
      onClose: () => console.log("ws closed"),
      onError: (event) => console.log("ws error", event),
      //Will attempt to reconnect on all close events, such as server shutting down
      shouldReconnect: () => true,
      share: true,
    },
    useWebSockets,
  );

  useEffect(() => {
    if (!getIsGroupedAnalysisMessage(lastJsonMessage)) {
      return undefined;
    }

    if (latestGroupedAnalysis1 === undefined) {
      setLatestGroupedAnalysis1(lastJsonMessage.message);
      return undefined;
    }

    const newBlock = lastJsonMessage.message.latestBlockFees[0];
    if (newBlock.number > latestGroupedAnalysis1.latestBlockFees[0].number) {
      setLatestGroupedAnalysis1(lastJsonMessage.message);
      return undefined;
    }
  }, [lastJsonMessage, latestGroupedAnalysis1, setLatestGroupedAnalysis1]);

  return latestGroupedAnalysis1;
};
