import { getDomain } from "../config";

export const fetchAnyJson = async <A>(url: RequestInfo): Promise<A> => {
  const res = await fetch(url);
  return res.json() as Promise<A>;
};

export const fetchJson = async <A>(url: RequestInfo): Promise<A> => {
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
    const body = (await res.json()) as Promise<A>;
    return body;
  }

  // Try to decode but handle failure.
  try {
    const body = (await res.json()) as {
      message?: string;
      msg?: string;
    };

    const message = body?.message || body?.msg;

    if (typeof message === "string") {
      throw new Error(`failed to fetch ${url}, message: ${message}`);
    }

    console.log(body);
    throw new Error(
      `failed to fetch ${url}, status: ${res.status}, json body, but no message, logged body.`,
    );
  } catch {
    throw new Error(`failed to fetch ${url}, status: ${res.status}, no body.`);
  }
};
