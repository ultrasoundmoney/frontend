import * as SharedConfig from "../../config";
import type { ApiResult } from "../../fetchers";
import { fetchApiJson as fetchApiJsonShared } from "../../fetchers";

export const fetchApiJson = <A>(url: string): Promise<ApiResult<A>> =>
  fetchApiJsonShared(SharedConfig.usmDomainFromEnv(), url);

// Swr wants us to throw, but we don't like throwing, so we write code that
// doesn't throw, and add a wrapper for swr which does.
export const fetchJsonSwr = async <A>(url: string): Promise<A> => {
  const dataOrError = await fetchApiJson<A>(url);
  if ("data" in dataOrError) {
    return dataOrError.data;
  } else {
    throw dataOrError.error;
  }
};
