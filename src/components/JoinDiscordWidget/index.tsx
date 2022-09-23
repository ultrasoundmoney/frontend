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
import withWidgetErrorBoundary from "../../higher-order-components/WithWidgetErrorBoundary";
import useAuthFromSection from "../../hooks/use-auth-from-section";
import BodyTextV2 from "../TextsNext/BodyTextV2";
import LabelText from "../TextsNext/LabelText";
import { WidgetBackground } from "../WidgetSubcomponents";
import discordLogo from "./discord-logo.png";
import logoTwitterWhite from "./logo-twitter-white.svg";

const LoadingText: FC<{ children: ReactNode }> = ({ children }) => (
  <BodyTextV2 className="animate-pulse text-white">{children}</BodyTextV2>
);

const PositiveText: FC<{ children: ReactNode }> = ({ children }) => (
  <BodyTextV2 className="text-green-400">{children}</BodyTextV2>
);

const NegativeText: FC<{ children: ReactNode }> = ({ children }) => (
  <BodyTextV2 className="whitespace-nowrap text-red-400">{children}</BodyTextV2>
);

// Dummy item to fix baseline alignment between sections on md
const AlignmentText: FC = () => (
  <BodyTextV2 className="select-none">&nbsp;</BodyTextV2>
);

type TwitterAuthStatusResponse =
  | { status: "not-authenticated"; session: null }
  | {
      status: "authenticated";
      session: {
        id: string;
        handle: string;
      };
    };

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

const JoinDiscordWidget: FC = () => {
  const [discordIdOrUsername, setDiscordUsername] = useState<string>();
  const [queueStatus, setQueueStatus] = useState<QueueingStatus>("init");
  const [twitterAuthStatus, setTwitterAuthStatus] = useTwitterAuthStatus();
  const [, setAuthFromSection] = useAuthFromSection();

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
          body: JSON.stringify({ discordIdOrUsername }),
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
    [discordIdOrUsername, twitterAuthStatus, setQueueStatus],
  );

  const handleSignOut = useCallback(() => {
    const signOut = async () => {
      const res = await fetch("/api/auth/twitter", {
        method: "DELETE",
      });

      if (res.status === 200) {
        setDiscordUsername("");
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
    <WidgetBackground className="flex max-w-3xl flex-col gap-y-8 md:mx-auto">
      <div className="relative flex items-center justify-between">
        <LabelText>join discord queue</LabelText>
        <div className="w-10 select-none md:absolute md:-right-12 md:-top-12 md:w-16">
          <Image
            alt="the discord logo, a community communication app"
            src={discordLogo}
          />
        </div>
      </div>
      <div className="flex flex-col gap-y-8 md:flex-row md:justify-between md:gap-x-8">
        <div className="flex flex-col gap-y-4 md:w-1/2">
          <div className="flex items-baseline justify-between">
            <LabelText>1. your twitter</LabelText>
            <TwitterStatusText status={twitterAuthStatus} />
          </div>
          {twitterAuthStatus.type !== "authenticated" ? (
            <Link href="/api/auth/twitter">
              <a
                className={`
                    flex select-none gap-x-2 self-center
                    rounded-full
                    border
                    border-slateus-200 bg-slateus-600 py-1.5
                    px-3 outline-slateus-200 hover:brightness-110
                    active:brightness-90
                    md:py-2
                    ${
                      twitterAuthStatus.type === "checking" ||
                      twitterAuthStatus.type === "authenticating"
                        ? "pointer-events-none opacity-50"
                        : "pointer-events-auto"
                    }
                  `}
                onClick={() => {
                  setTwitterAuthStatus({ type: "authenticating" });
                  setAuthFromSection("discord");
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
                  flex select-none gap-x-2 self-center
                  rounded-full
                  border
                  border-slateus-200 bg-slateus-600 py-1.5
                  px-3 outline-slateus-200 hover:brightness-125
                  active:brightness-90
                  md:py-2
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
          <div className="flex items-baseline justify-between gap-x-1">
            <LabelText className="truncate">2. your discord handle</LabelText>
            <DiscordStatusText status={queueStatus} />
          </div>
          <form
            className={`
                flex justify-center
                rounded-full
                border border-slateus-500 bg-slateus-800
                valid:border-emerald-400
                focus-within:border-slateus-400
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
                  rounded-full
                  bg-transparent pl-4 text-xs
                  text-white
                  placeholder-slateus-400
                  outline-none
                  md:text-base
                `}
              onChange={handleDiscordInputChange}
              pattern="^\d{16}|.{2,32}#\d{4}$"
              placeholder="discord_user#1559"
              required
              spellCheck="false"
              type="text"
              value={discordIdOrUsername}
            />
            <button
              className={`
                  group
                  relative my-px mr-px
                  flex
                  select-none rounded-full
                  bg-gradient-to-tr
                  from-cyan-400
                  to-indigo-600 px-4
                  py-[5px]
                  font-light
                  text-white
                  md:m-0.5
                  md:py-1.5
                `}
              type="submit"
            >
              <BodyTextV2 className="z-10">submit</BodyTextV2>
              <div
                className={`
                    discord-submit
                    absolute left-[1px] right-[1px] top-[1px] bottom-[1px]
                    rounded-full bg-slateus-700
                    group-hover:hidden
                  `}
              ></div>
            </button>
          </form>
        </div>
      </div>
    </WidgetBackground>
  );
};

export default withWidgetErrorBoundary("join discord queue", JoinDiscordWidget);
