import { useContext, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import useSWR from "swr";
import * as Duration from "../duration";
import { FeatureFlagsContext } from "../feature-flags";
import { NEA } from "../fp";
import { BurnRecords, decodeBurnRecords, RawBurnRecords } from "./burn-records";
import fetcher from "./default-fetcher";
import { feesBasePath, feesWsUrl } from "./fees";
import { Leaderboards } from "./leaderboards";

type WeiPerMinute = number;
type Wei = number;

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
export type FeeData = {
  baseFeePerGas: number;
  burnRates: BurnRates;
  burnRecords: BurnRecords["records"];
  deflationaryStreak: DeflationaryStreakState;
  ethPrice: EthPrice | undefined;
  feesBurned: FeesBurned;
  latestBlockFees: NEA.NonEmptyArray<LatestBlock>;
  leaderboards: Leaderboards;
  number: number;
};

type RawFeeData = {
  baseFeePerGas: number;
  burnRates: BurnRates;
  burnRecords: RawBurnRecords["records"];
  deflationaryStreak: DeflationaryStreakState;
  ethPrice: EthPrice | null;
  feesBurned: FeesBurned;
  latestBlockFees: NEA.NonEmptyArray<LatestBlock>;
  leaderboards: Leaderboards;
  number: number;
};

const decodeFeeData = (raw: RawFeeData): FeeData => ({
  ...raw,
  ethPrice: raw.ethPrice ?? undefined,
  burnRecords: decodeBurnRecords({
    number: raw.number,
    records: raw.burnRecords,
  }).records,
});

export const useGroupedAnalysis1 = (): FeeData | undefined => {
  const { useWebSockets } = useContext(FeatureFlagsContext);
  const { data } = useSWR<RawFeeData>(`${feesBasePath}/all`, fetcher, {
    refreshInterval: Duration.millisFromSeconds(1),
    isPaused: () => useWebSockets,
  });
  const dataWs = useGroupedAnalysis1Ws();
  const [latestGroupedAnalysis1, setLatestGroupedAnalysis1] =
    useState<FeeData>();

  useEffect(() => {
    if (useWebSockets) {
      if (dataWs !== undefined) {
        setLatestGroupedAnalysis1(decodeFeeData(dataWs));
      }
      return undefined;
    }

    if (data !== undefined) {
      setLatestGroupedAnalysis1(decodeFeeData(data));
      return undefined;
    }
  }, [data, dataWs, useWebSockets]);

  return latestGroupedAnalysis1;
};

type GroupedAnallysis1Envelope = {
  id: "grouped-analysis-1";
  message: RawFeeData;
};

const getIsGroupedAnalysisMessage = (
  u: unknown,
): u is GroupedAnallysis1Envelope =>
  u != null &&
  typeof (u as GroupedAnallysis1Envelope).id === "string" &&
  (u as GroupedAnallysis1Envelope).id === "grouped-analysis-1";

export const useGroupedAnalysis1Ws = (): // enabled: boolean,
RawFeeData | undefined => {
  const { useWebSockets } = useContext(FeatureFlagsContext);
  const [latestGroupedAnalysis1, setLatestGroupedAnalysis1] =
    useState<RawFeeData>();
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

    const newBlock = NEA.head(lastJsonMessage.message.latestBlockFees);
    if (
      newBlock.number > NEA.head(latestGroupedAnalysis1.latestBlockFees).number
    ) {
      setLatestGroupedAnalysis1(lastJsonMessage.message);
      return undefined;
    }
  }, [lastJsonMessage, latestGroupedAnalysis1, setLatestGroupedAnalysis1]);

  return latestGroupedAnalysis1;
};