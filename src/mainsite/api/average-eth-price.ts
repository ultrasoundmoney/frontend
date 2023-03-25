import useSWR from "swr";
import * as Duration from "../../duration";
import type { ApiResult } from "../../fetchers";
import type { TimeFrame } from "../time-frames";
import { fetchApiJson, fetchJsonSwr } from "./fetchers";

export type AverageEthPrice = Record<TimeFrame, number>;

const url = "/api/v2/fees/average-eth-price";

export const fetchAverageEthPrice = (): Promise<ApiResult<AverageEthPrice>> =>
  fetchApiJson<AverageEthPrice>(url);

export const useAverageEthPrice = (): AverageEthPrice => {
  const { data } = useSWR<AverageEthPrice>(url, fetchJsonSwr, {
    refreshInterval: Duration.millisFromSeconds(8),
  });

  return {
    m5: 1500,
    h1: 1500,
    d1: 1500,
    d7: 1500,
    d30: 1500,
    since_merge: 1500,
    since_burn: 1500,
  };

  // We use an SWRConfig with fallback data for this hook.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return data!;
};
