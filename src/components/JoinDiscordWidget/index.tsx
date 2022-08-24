import Link from "next/link";
import type { FC, FormEvent, ReactNode } from "react";
import { useEffect } from "react";
import { useCallback, useState } from "react";
import { BodyText, LabelText } from "../Texts";
import WidgetErrorBoundary from "../WidgetErrorBoundary";
import { WidgetBackground } from "../WidgetSubcomponents";
import Image from "next/image";
import discordLogo from "./discord-logo.png";

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

type TwitterAuthStatusResponse = {
  message: string;
  status: "verified" | "not-verified";
};
type TwitterAuthStatus = "verified" | "init" | "error" | "checking";
const TwitterStatusText: FC<{ status: TwitterAuthStatus }> = ({ status }) =>
  status === "verified" ? (
    <PositiveText>verified</PositiveText>
  ) : status === "checking" ? (
    <LoadingText>checking...</LoadingText>
  ) : status === "error" ? (
    <NegativeText>error</NegativeText>
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
  const [twitterAuthStatus, setTwitterAuthStatus] =
    useState<TwitterAuthStatus>("init");

  useEffect(() => {
    const checkAuthStatus = async (): Promise<void> => {
      setTwitterAuthStatus("checking");

      const res = await fetch("/api/auth/status");

      if (res.status === 200) {
        const body = (await res.json()) as TwitterAuthStatusResponse;

        if (body.status === "verified") {
          setTwitterAuthStatus("verified");
          return;
        }

        if (body.status === "not-verified") {
          setTwitterAuthStatus("init");
          return;
        }

        setTwitterAuthStatus("error");
        throw new Error(body.message || "failed to check auth status");
      }

      setTwitterAuthStatus("error");
      throw new Error(
        `failed to check auth status, response status: ${res.status}`,
      );
    };

    checkAuthStatus().catch((err) => {
      throw err;
    });
  }, []);

  return twitterAuthStatus;
};

const JoinDiscordWidget: FC = () => {
  const [discordUsername, setDiscordUsername] = useState<string>();
  const [queueStatus, setQueueStatus] = useState<QueueingStatus>("init");
  const twitterAuthStatus = useTwitterAuthStatus();

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const submit = async () => {
        if (twitterAuthStatus !== "verified") {
          console.error("tried to submit without twitter auth");
          return;
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
    [discordUsername, twitterAuthStatus],
  );

  return (
    <WidgetErrorBoundary title="join discord queue">
      <WidgetBackground className="flex flex-col gap-y-8 max-w-3xl mx-auto">
        <div className="relative flex justify-between items-center">
          <LabelText>join discord queue</LabelText>
          <div className="w-8 md:w-16 md:absolute md:-right-12 md:-top-12 select-none">
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
            <Link href="/api/auth/twitter">
              <a
                className={`
                  w-full
                  flex justify-center py-1.5 md:py-2 px-3
                  bg-slateus-600 hover:brightness-110 active:brightness-90
                  border border-slateus-200 rounded-full
                  outline-slateus-200
                  select-none
                  ${
                    twitterAuthStatus === "verified"
                      ? "opacity-50"
                      : "opacity-100"
                  }
                  ${
                    twitterAuthStatus === "checking"
                      ? "pointer-events-none"
                      : "pointer-events-auto"
                  }
                `}
              >
                <BodyText className="text-xs md:text-base">
                  authenticate
                </BodyText>
              </a>
            </Link>
          </div>
          <div
            className={`
            flex flex-col gap-y-4
              md:w-1/2
            ${twitterAuthStatus === "verified" ? "opacity-100" : "opacity-50"}
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
                focus-within:invalid:border-red-300
                ${
                  twitterAuthStatus === "verified"
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
                onChange={(event) => setDiscordUsername(event.target.value)}
                pattern="[0-9]{16}|.{2,32}#[0-9]{4}"
                placeholder="discord_user#8615"
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
                  px-4 py-1.5
                  md:py-1.5 md:m-0.5
                  text-white
                  font-light
                  flex
                  group
                  select-none
                `}
                type="submit"
              >
                <BodyText className="z-10 text-white text-xs md:text-base">
                  submit
                </BodyText>
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
