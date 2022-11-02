import { getDomain } from "../config";

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

export type ApiError = {
  type: "ApiError";
  error: Error;
};

export type ApiResult<A> = { data: A } | FetchError | ApiError;

export const fetchApiJson = async <A>(url: string): Promise<ApiResult<A>> => {
  // Convert relative URLs to absolute, the server wouldn't know where to go
  // otherwise.
  const absoluteUrl =
    typeof url === "string" && url.startsWith("https://")
      ? // Already an absolute URL.
        url
      : // Convert relative URLs.

        `${getDomain()}${url}`;

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
        `failed to fetch ${url}, status: ${res.status}, message: ${message}`,
      );
      return { error, type: "ApiError" };
    }

    const error = new Error(
      `failed to fetch ${url}, status: ${res.status}, json body, but no message, logging body.`,
    );
    console.error(body);
    return { error, type: "ApiError" };
  } catch {
    const error = new Error(
      `failed to fetch ${url}, status: ${res.status}, no body.`,
    );
    return { error, type: "ApiError" };
  }
};

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
