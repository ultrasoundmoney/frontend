import type { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";
import type {
  ChangeEvent,
  Dispatch,
  FC,
  FormEvent,
  ReactNode,
  SetStateAction,
} from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import BodyText from "../TextsNext/BodyText";
import BodyTextV2 from "../TextsNext/BodyTextV2";
import LabelText from "../TextsNext/LabelText";
import WidgetErrorBoundary from "../WidgetErrorBoundary";
import { WidgetBackground } from "../WidgetSubcomponents";
import discordLogo from "./discord-logo.png";
import logoTwitterWhite from "./logo-twitter-white.svg";

const LoadingText: FC<{ children: ReactNode }> = ({ children }) => (
  <BodyText className="text-white animate-pulse text-xs md:text-base">
    {children}
  </BodyText>
);

const PositiveText: FC<{ children: ReactNode }> = ({ children }) => (
  <BodyText className="text-green-400 text-xs md:text-base">
    {children}
  </BodyText>
);

const NegativeText: FC<{ children: ReactNode }> = ({ children }) => (
  <BodyText className="whitespace-nowrap text-red-400 text-xs md:text-base">
    {children}
  </BodyText>
);

// Dummy item to fix baseline alignment between sections on md
const AlignmentText: FC = () => (
  <BodyText className="select-none text-xs md:text-base">&nbsp;</BodyText>
);

type AuthBody = {
  id: string;
  handle: string;
};
type AuthError = {
  message?: string;
};
type TwitterAuthStatusResponse = AuthBody | AuthError;
const getIsAuthBody = (u: unknown): u is AuthBody =>
  typeof (u as AuthBody)?.id === "string";

type TwitterAuthStatus =
  | { type: "access-denied" }
  | { type: "authenticated"; id: string; handle: string }
  | { type: "authenticating" }
  | { type: "checking" }
  | { type: "error"; message: string }
  | { type: "init" }
  | { type: "signing-out" };
const TwitterStatusText: FC<{ status: TwitterAuthStatus }> = ({ status }) =>
  status.type === "authenticated" ? (
    <PositiveText>authenticated</PositiveText>
  ) : status.type === "checking" ? (
    <LoadingText>checking...</LoadingText>
  ) : status.type === "authenticating" ? (
    <LoadingText>authenticating...</LoadingText>
  ) : status.type === "signing-out" ? (
    <LoadingText>signing out...</LoadingText>
  ) : status.type === "error" ? (
    <NegativeText>error</NegativeText>
  ) : status.type === "access-denied" ? (
    <NegativeText>access denied</NegativeText>
  ) : (
    <AlignmentText />
  );

type QueueingStatus = "init" | "invalid-handle" | "done" | "sending" | "error";
const DiscordStatusText: FC<{ status: QueueingStatus }> = ({ status }) =>
  status === "invalid-handle" ? (
    <NegativeText>invalid handle</NegativeText>
  ) : status === "error" ? (
    <NegativeText>error</NegativeText>
  ) : status === "sending" ? (
    <LoadingText>sending...</LoadingText>
  ) : status === "done" ? (
    <PositiveText>done!</PositiveText>
  ) : (
    <AlignmentText />
  );

const useTwitterAuthStatus = () => {
  const [twitterAuthStatus, setTwitterAuthStatus] = useState<TwitterAuthStatus>(
    { type: "init" },
  );

  useEffect(() => {
    const checkAuthStatus = async (): Promise<void> => {
      setTwitterAuthStatus({ type: "checking" });

      const res = await fetch("/api/auth/twitter/session");

      if (res.status === 200) {
        const body = (await res.json()) as TwitterAuthStatusResponse;

        if (getIsAuthBody(body)) {
          setTwitterAuthStatus({
            type: "authenticated",
            id: body.id,
            handle: body.handle,
          });
          return;
        } else {
          const message =
            body.message ??
            "get twitter auth status got 200 response, but no auth body";
          setTwitterAuthStatus({
            type: "error",
            message,
          });
          throw new Error(message);
        }
      }

      if (res.status === 404) {
        setTwitterAuthStatus({ type: "init" });
        return;
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

const JoinDiscordWidget: FC = () => {
  const [discordUsername, setDiscordUsername] = useState<string>();
  const [queueStatus, setQueueStatus] = useState<QueueingStatus>("init");
  const [twitterAuthStatus, setTwitterAuthStatus] = useTwitterAuthStatus();

  const handleDiscordInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      setDiscordUsername(event.target.value);
    },
    [],
  );

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const submit = async () => {
        if (twitterAuthStatus.type !== "authenticated") {
          throw new Error("tried to submit without twitter auth");
        }

        setQueueStatus("sending");

        const res = await fetch("/api/fam/queue-for-discord", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ discordIdOrUsername: discordUsername }),
        });

        if (res.status === 200) {
          setQueueStatus("done");
          return;
        }

        if (res.status === 400) {
          setQueueStatus("invalid-handle");
          return;
        }

        setQueueStatus("error");
        try {
          const body = (await res.json()) as { message?: string };
          if (typeof body.message === "string") {
            throw new Error(body.message);
          }
        } catch {
          console.error("failed to decode any discord queueing response body");
        }
      };
      submit().catch((err) => {
        throw err;
      });
    },
    [discordUsername, twitterAuthStatus, setQueueStatus],
  );

  const handleSignOut = useCallback(() => {
    const signOut = async () => {
      const res = await fetch("/api/auth/twitter", {
        method: "DELETE",
      });

      if (res.status === 200) {
        setDiscordUsername(undefined);
        setQueueStatus("init");
        setTwitterAuthStatus({ type: "init" });
        return;
      }

      setTwitterAuthStatus({
        type: "error",
        message: "failed to sign out",
      });
      throw new Error("failed to sign out");
    };

    setTwitterAuthStatus({ type: "signing-out" });
    signOut().catch((err) => {
      throw err;
    });
  }, [setTwitterAuthStatus, setDiscordUsername, setQueueStatus]);

  return (
    <WidgetErrorBoundary title="join discord queue">
      <WidgetBackground className="flex flex-col gap-y-8 max-w-3xl mx-auto">
        <div className="relative flex justify-between items-center">
          <LabelText>join discord queue</LabelText>
          <div className="w-10 md:w-16 md:absolute md:-right-12 md:-top-12 select-none">
            <Image
              alt="the discord logo, a community communication app"
              src={discordLogo}
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-8 md:flex-row md:justify-between md:gap-x-8">
          <div className="flex flex-col gap-y-4 md:w-1/2">
            <div className="flex justify-between items-baseline">
              <LabelText>1. your twitter</LabelText>
              <TwitterStatusText status={twitterAuthStatus} />
            </div>
            {twitterAuthStatus.type !== "authenticated" ? (
              <Link href="/api/auth/twitter">
                <a
                  className={`
                  flex py-1.5 md:py-2 px-3
                  self-center
                  gap-x-2
                  bg-slateus-600 hover:brightness-110 active:brightness-90
                  border border-slateus-200 rounded-full
                  outline-slateus-200
                  select-none
                  ${
                    twitterAuthStatus.type === "checking" ||
                    twitterAuthStatus.type === "authenticating"
                      ? "opacity-50 pointer-events-none"
                      : "pointer-events-auto"
                  }
                `}
                  onClick={() => {
                    setTwitterAuthStatus({ type: "authenticating" });
                  }}
                >
                  <BodyTextV2>authenticate</BodyTextV2>
                  <Image
                    alt="twitte logo in white"
                    src={logoTwitterWhite as StaticImageData}
                    height={16}
                    width={16}
                  />
                </a>
              </Link>
            ) : (
              <button
                className={`
                  flex py-1.5 md:py-2 px-3
                  self-center
                  gap-x-2
                  bg-slateus-600 hover:brightness-125 active:brightness-90
                  border border-slateus-200 rounded-full
                  outline-slateus-200
                  select-none
                `}
                onClick={handleSignOut}
              >
                <BodyTextV2>sign out @{twitterAuthStatus.handle}</BodyTextV2>
              </button>
            )}
          </div>
          <div
            className={`
            flex flex-col gap-y-4
              md:w-1/2
            ${
              twitterAuthStatus.type === "authenticated"
                ? "opacity-100"
                : "opacity-50"
            }
          `}
          >
            <div className="flex justify-between items-baseline gap-x-1">
              <LabelText className="truncate">2. your discord handle</LabelText>
              <DiscordStatusText status={queueStatus} />
            </div>
            <form
              className={`
                flex justify-center
                bg-slateus-800
                border border-slateus-500 rounded-full
                focus-within:border-slateus-400
                valid:border-emerald-400
                focus-within:valid:border-emerald-400
                [&_button]:invalid:opacity-50
                ${
                  twitterAuthStatus.type === "authenticated"
                    ? "pointer-events-auto"
                    : "pointer-events-none"
                }
              `}
              onSubmit={handleSubmit}
            >
              <input
                className={`
                  w-full
                  bg-transparent
                  text-xs md:text-base text-white
                  pl-4
                  placeholder-slateus-400
                  rounded-full
                  outline-none
                `}
                onChange={handleDiscordInputChange}
                pattern="^\d{16}|.{2,32}#\d{4}$"
                placeholder="discord_user#1559"
                required
                spellCheck="false"
                type="text"
                value={discordUsername}
              />
              <button
                className={`
                  relative
                  bg-gradient-to-tr from-cyan-400 to-indigo-600
                  rounded-full
                  px-4 py-[5px]
                  my-px
                  mr-px
                  md:py-1.5 md:m-0.5
                  text-white
                  font-light
                  flex
                  group
                  select-none
                `}
                type="submit"
              >
                <BodyTextV2 className="z-10">submit</BodyTextV2>
                <div
                  className={`
                    discord-submit
                    absolute left-[1px] right-[1px] top-[1px] bottom-[1px]
                    bg-slateus-700 rounded-full
                    group-hover:hidden
                  `}
                ></div>
              </button>
            </form>
          </div>
        </div>
      </WidgetBackground>
    </WidgetErrorBoundary>
  );
};

export default JoinDiscordWidget;
