import type { ApiResult } from "../fetchers";
import { fetchApiJson as fetchApiJsonShared } from "../fetchers";
import * as RelayConfig from "./config";

export const fetchApiJson = async <A>(url: string): Promise<ApiResult<A>> =>
  fetchApiJsonShared(RelayConfig.getDomain(), url);

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
