import type { ApiError, ApiResult, FetchError } from "../fetchers";
import {
  fetchApiJson as fetchApiJsonShared,
  fetchApiJsonTE as fetchApiJsonTEShared,
} from "../fetchers";
import type { TE } from "../fp";
import * as RelayConfig from "./config";

export const fetchApiJson = async <A>(url: string): Promise<ApiResult<A>> =>
  fetchApiJsonShared<A>(RelayConfig.getDomain(), url);

export const fetchApiJsonTE = <A>(
  url: string,
): TE.TaskEither<FetchError | ApiError, A> =>
  fetchApiJsonTEShared<A>(RelayConfig.getDomain(), url);

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
