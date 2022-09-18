import { getDomain } from "../config";

export type ApiResult<A> = { data: A } | { error: Error };

// This may look safe, but it's simply handling API errors, fetch itself may still throw.
const fetchUnsafe = async <A>(url: RequestInfo): Promise<ApiResult<A>> => {
  // Convert relative URLs to absolute, the server wouldn't know where to go otherwise.
  const absoluteUrlOrRequestInfo =
    typeof url === "string" && url.startsWith("https://")
      ? url
      : // This branch catches relative URLs
      typeof url === "string"
      ? `${getDomain()}${url}`
      : // It might not be a URL at all.
        url;

  const res = await fetch(absoluteUrlOrRequestInfo);

  if (res.status === 200) {
    const body = (await res.json()) as A;
    return { data: body };
  }

  // Try to decode but handle failure.
  try {
    const body = (await res.json()) as {
      message?: string;
      msg?: string;
    };

    const message = body?.message || body?.msg;

    if (typeof message === "string") {
      const error = new Error(`failed to fetch ${url}, message: ${message}`);
      return { error };
    }

    const error = new Error(
      `failed to fetch ${url}, status: ${res.status}, json body, but no message, logging body.`,
    );
    console.error(body);
    return { error };
  } catch {
    const error = new Error(
      `failed to fetch ${url}, status: ${res.status}, no body.`,
    );
    return { error };
  }
};

export const fetchJson = async <A>(url: RequestInfo): Promise<ApiResult<A>> => {
  try {
    return await fetchUnsafe(url);
  } catch (error) {
    if (error instanceof Error) {
      return { error };
    }

    if (typeof error === "string") {
      return { error: new Error(error) };
    }

    return {
      error: new Error(
        `fetch failed, caught something, but not an error, ${error}`,
      ),
    };
  }
};

// Swr wants us to throw, but we don't like throwing, so we write code that doesn't throw, and add a wrapper for swr.
export const fetchJsonSwr = async <A>(url: RequestInfo): Promise<A> => {
  const dataOrError = await fetchJson<A>(url);
  if ("data" in dataOrError) {
    return dataOrError.data;
  } else {
    throw dataOrError.error;
  }
};
