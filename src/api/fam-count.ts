import { secondsToMilliseconds } from "date-fns";
import useSWR from "swr";
import type { ApiResult } from "./fetchers";
import { fetchJson, fetchJsonSwr } from "./fetchers";

export type FamCount = {
  count: number;
};

const url = "/api/v2/fam/count";

export const fetchFamCount = (): Promise<ApiResult<FamCount>> =>
  fetchJson<FamCount>(url);

export const useFamCount = (): FamCount | undefined => {
  const { data } = useSWR<FamCount>(url, fetchJsonSwr, {
    refreshInterval: secondsToMilliseconds(4),
  });

  return data;
};
