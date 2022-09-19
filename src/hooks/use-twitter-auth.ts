import type { Dispatch, SetStateAction } from "react";
import { useEffect, useMemo, useState } from "react";

export type TwitterAuthStatusResponse =
  | { status: "not-authenticated"; session: null }
  | {
      status: "authenticated";
      session: {
        id: string;
        handle: string;
        eligibleForPoap: boolean;
        claimedPoap: boolean;
      };
    };

export type TwitterAuthStatus =
  | { type: "access-denied" }
  | { type: "authenticated"; id: string; handle: string }
  | { type: "authenticating" }
  | { type: "checking" }
  | { type: "error"; message: string }
  | { type: "init" }
  | { type: "signing-out" };

export const useTwitterAuthStatus = () => {
  const [twitterAuthStatus, setTwitterAuthStatus] = useState<TwitterAuthStatus>(
    { type: "init" },
  );

  useEffect(() => {
    const checkAuthStatus = async (): Promise<void> => {
      setTwitterAuthStatus({ type: "checking" });

      const res = await fetch("/api/auth/twitter/session");

      if (res.status === 200) {
        const body = (await res.json()) as TwitterAuthStatusResponse;

        if (body.status === "authenticated") {
          setTwitterAuthStatus({
            type: "authenticated",
            id: body.session.id,
            handle: body.session.handle,
          });
          return;
        }

        if (body.status === "not-authenticated") {
          setTwitterAuthStatus({ type: "init" });
          return;
        }

        const message = "got twitter auth session 200 response, but no status";
        setTwitterAuthStatus({ type: "error", message });
        throw new Error(message);
      }

      const message = `failed to check auth status, response status: ${res.status}`;
      setTwitterAuthStatus({ type: "error", message });
      throw new Error(message);
    };

    // Because we get redirected back, it's possible the backend tried to communicate a response to us by setting a query param when the user cancelled.
    if (typeof document !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const authStatus = urlParams.get("auth");
      if (authStatus !== null && authStatus === "access_denied") {
        setTwitterAuthStatus({ type: "access-denied" });
        return;
      }
    }

    checkAuthStatus().catch((err) => {
      throw err;
    });
  }, []);

  return useMemo(
    () =>
      [twitterAuthStatus, setTwitterAuthStatus] as [
        TwitterAuthStatus,
        Dispatch<SetStateAction<TwitterAuthStatus>>,
      ],
    [twitterAuthStatus],
  );
};
