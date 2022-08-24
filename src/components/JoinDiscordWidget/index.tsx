import Link from "next/link";
import type { FC } from "react";
import { useEffect } from "react";
import { useCallback, useState } from "react";
import { BodyText, LabelText } from "../Texts";
import WidgetErrorBoundary from "../WidgetErrorBoundary";
import { WidgetBackground } from "../WidgetSubcomponents";
import Image from "next/image";
import discordLogo from "./discord-logo.png";

type TwitterAuthStatusResponse = {
  message: string;
  status: "verified" | "not-verified";
};
type TwitterAuthStatus = "verified" | "init" | "error" | "checking";
const TwitterStatusText: FC<{ status: TwitterAuthStatus }> = ({ status }) =>
  status === "verified" ? (
    <BodyText className="text-green-400 text-xs md:text-base">
      verified
    </BodyText>
  ) : status === "checking" ? (
    <BodyText className="text-white animate-pulse text-xs md:text-base">
      checking...
    </BodyText>
  ) : status === "error" ? (
    <BodyText className="whitespace-nowrap text-red-400 text-xs md:text-base">
      error
    </BodyText>
  ) : null;

type QueueingStatus = "init" | "invalid-handle" | "done" | "sending" | "error";
const DiscordStatusText: FC<{ status: QueueingStatus }> = ({ status }) =>
  status === "invalid-handle" ? (
    <BodyText className="whitespace-nowrap text-red-400 text-xs md:text-base">
      invalid handle
    </BodyText>
  ) : status === "error" ? (
    <BodyText className="whitespace-nowrap text-red-400 text-xs md:text-base">
      error
    </BodyText>
  ) : status === "sending" ? (
    <BodyText className="whitespace-nowrap text-white animate-pulse text-xs md:text-base">
      sending...
    </BodyText>
  ) : status === "done" ? (
    <BodyText className="whitespace-nowrap text-green-400 text-xs md:text-base">
      done!
    </BodyText>
  ) : null;

const JoinDiscordWidget: FC = () => {
  const [discordUsername, setDiscordUsername] = useState<string>();
  const [queueStatus, setQueueStatus] = useState<QueueingStatus>("init");
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

  const handleSubmit = useCallback(async () => {
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
  }, [discordUsername, twitterAuthStatus]);

  return (
    <WidgetErrorBoundary title="join discord queue">
      <WidgetBackground className="flex flex-col gap-y-8">
        <div className="relative flex justify-between items-center">
          <LabelText>join discord queue</LabelText>
          <div className="w-8 md:w-16 md:absolute md:-right-12 md:-top-12">
            <Image
              alt="the discord logo, a community communication app"
              src={discordLogo}
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-8 md:flex-row md:justify-between md:gap-x-8">
          <div className="flex flex-col gap-y-4 md:w-1/2">
            <div className="flex justify-between">
              <LabelText>1. your twitter</LabelText>
              <TwitterStatusText status={twitterAuthStatus} />
            </div>
            <Link href="/api/auth/twitter">
              <a
                className={`
                w-full
                flex justify-center py-[6px] px-3
                bg-slateus-600 hover:brightness-110 active:brightness-90
                border border-slateus-200 rounded-full
                outline-slateus-200
                select-none
                ${
                  twitterAuthStatus === "verified"
                    ? "opacity-50"
                    : "opacity-100"
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
            <div className="flex justify-between gap-x-1">
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
              onSubmit={() => {
                handleSubmit().catch(console.error);
              }}
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
                px-4 py-2
                text-white
                font-light
                flex
                group
              `}
                type="submit"
              >
                <BodyText className="z-10 text-white text-xs md:text-base">
                  submit
                </BodyText>
                <div
                  className={`
                  discord-submit
                  absolute left-1 right-1 top-1 bottom-1
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
