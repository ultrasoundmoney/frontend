import type { TE } from "./fp";
import { E, pipe, T } from "./fp";

export type SiteEnv = "usm";

export type FetchError = {
  type: "FetchError";
  error: Error;
};

type SafeResponse =
  | {
      type: "Response";
      res: Response;
    }
  | FetchError;

const fetchSafe = async (url: RequestInfo): Promise<SafeResponse> => {
  // Make a request, catch Fetch errors.
  try {
    const res = await fetch(url);
    return { res, type: "Response" };
  } catch (error) {
    if (error instanceof Error) {
      return { error, type: "FetchError" };
    }

    return { error: new Error(String(error)), type: "FetchError" };
  }
};

// Convert relative URLs to absolute, the server wouldn't know where to go
// otherwise.
export const absoluteUrlFromUrl = (domain: string, url: string): string =>
  typeof url === "string" && url.startsWith("https://")
    ? url
    : `${domain}${url}`;

export type ApiError = {
  code: number;
  error: Error;
  type: "ApiError";
};

export type ApiResult<A> = { data: A } | FetchError | ApiError;

/** Fetch a JSON API response, and return the data, or an error. */
export const fetchApiJson = async <A>(
  apiDomain: string,
  url: string,
): Promise<ApiResult<A>> => {
  const absoluteUrl = absoluteUrlFromUrl(apiDomain, url);
  const safeRes = await fetchSafe(absoluteUrl);
  if (safeRes.type === "FetchError") {
    return safeRes;
  }

  const res = safeRes.res;

  if (res.status === 200) {
    // This function is meant to only fetch JSON API responses. If we can't
    // decode a json body, we let the error bubble.
    const body = (await res.json()) as A;
    return { data: body };
  }

  // Something went wrong, there may be a json body with a hint, there may not.
  try {
    const body = (await res.json()) as {
      message?: string;
      msg?: string;
    };

    const message = body?.message || body?.msg;

    if (typeof message === "string") {
      const error = new Error(
        `failed to fetch ${absoluteUrl}, status: ${res.status}, message: ${message}`,
      );
      return { error, type: "ApiError", code: res.status };
    }

    const error = new Error(
      `failed to fetch ${absoluteUrl}, status: ${res.status}, json body, but no message, logging body.`,
    );
    console.error(body);
    return { error, type: "ApiError", code: res.status };
  } catch {
    const error = new Error(
      `failed to fetch ${absoluteUrl}, status: ${res.status}, no body.`,
    );
    return { error, type: "ApiError", code: res.status };
  }
};

export const fetchApiJsonTE = <A>(
  apiDomain: string,
  url: string,
): TE.TaskEither<FetchError | ApiError, A> =>
  pipe(
    () => fetchApiJson<A>(apiDomain, url),
    T.map((apiResult) =>
      "data" in apiResult ? E.right(apiResult.data) : E.left(apiResult),
    ),
  );
