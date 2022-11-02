import { secondsToMilliseconds } from "date-fns";
import useSWR from "swr";
import type { ApiResult } from "./fetchers";
import { fetchApiJson, fetchJsonSwr } from "./fetchers";

export type FamCount = {
  count: number;
};

const url = "/api/v2/fam/count";

export const fetchFamCount = (): Promise<ApiResult<FamCount>> =>
  fetchApiJson<FamCount>(url);

export const useFamCount = (): FamCount => {
  const { data } = useSWR<FamCount>(url, fetchJsonSwr, {
    refreshInterval: secondsToMilliseconds(4),
  });

  // We use an SWRConfig with fallback data for this hook.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return data!;
};
