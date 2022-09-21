import { captureException } from "@sentry/nextjs";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import type { ChangeEvent, FC, FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import useSWR from "swr";
import { fetchJsonSwr } from "../../api/fetchers";
import closeSvg from "../../assets/close.svg";
import logoTwitterWhite from "../../assets/logo-twitter-white.svg";
import questionMarkSvg from "../../assets/question-mark-v2.svg";
import roundNerdLarge from "../../assets/round-nerd-large.svg";
import { getDomain } from "../../config";
import { formatDistance } from "../../format";
import { useTwitterAuthStatus } from "../../hooks/use-twitter-auth";
import type { DateTimeString } from "../../time";
import Nerd from "../Nerd";
import {
  AlignmentText,
  LoadingText,
  NegativeText,
  PositiveText,
} from "../StatusText";
import StyledLink from "../StyledLink";
import { TooltipTitle } from "../Texts";
import BodyTextV2 from "../TextsNext/BodyTextV2";
import LabelText from "../TextsNext/LabelText";
import QuantifyText from "../TextsNext/QuantifyText";
import { SectionTitle } from "../TextsNext/SectionTitle";
import SkeletonText from "../TextsNext/SkeletonText";
import Twemoji from "../Twemoji";
import TwitterStatusText from "../TwitterStatusText";
import WidgetErrorBoundary from "../WidgetErrorBoundary";
import { WidgetBackground } from "../WidgetSubcomponents";
import hearNoEvilSvg from "./hear-no-evil-own.svg";
import logoPoapSvg from "./logo-poap-slateus.svg";
import seeNoEvilSvg from "./see-no-evil-own.svg";
import speakNoEvilSvg from "./speak-no-evil-own.svg";
import ultraSoundPoapStill from "./ultrasoundpoapstill.png";
import ultraSoundPoapGif from "./utlra_sound_poap.gif";

type Props = {
  className?: string;
  onClickClose?: () => void;
};

const ClaimPoapTooltip: FC<Props> = ({ className = "", onClickClose }) => (
  <div
    onClick={(e) => {
      e.stopPropagation();
    }}
    className={`
      relative
      flex flex-col gap-y-4
      bg-blue-tangaroa p-8 rounded-lg
      border border-blue-shipcove
      text-left
      ${className}
    `}
  >
    <button
      className={`
        flex w-6
        active:brightness-90 hover:brightness-110
        select-none self-end
      `}
    >
      <Image
        alt="a close button, circular with an x in the middle"
        draggable={false}
        height={24}
        layout="fixed"
        onClick={onClickClose}
        src={closeSvg as StaticImageData}
        width={24}
      />
    </button>
    <Image
      alt="a nerd emoji symbolizing a knowledge deep-dive"
      className="w-20 h-20 mx-auto rounded-full select-none"
      src={roundNerdLarge as StaticImageData}
      height={80}
      width={80}
    />
    <TooltipTitle>a title</TooltipTitle>
    <LabelText>followed by a section title</LabelText>
    <div className="flex flex-col">
      <BodyTextV2>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vitae augue
        in nunc mattis aliquam. Cras ac imperdiet lacus. Sed eu nunc faucibus
        leo consectetur maximus. Ut pellentesque semper erat nec suscipit. Morbi
        id semper purus, id pharetra velit. Proin pretium sit amet massa
        facilisis efficitur.
      </BodyTextV2>
    </div>
  </div>
);

const ClaimStatusText: FC<{ status: ClaimStatus }> = ({ status }) =>
  status === "invalid-wallet-id" ? (
    <NegativeText>invalid wallet id</NegativeText>
  ) : status === "error" ? (
    <NegativeText>error</NegativeText>
  ) : status === "sending" ? (
    <LoadingText>sending...</LoadingText>
  ) : status === "done" ? (
    <PositiveText>sent!</PositiveText>
  ) : (
    <AlignmentText />
  );

type ClaimStatus = "sending" | "invalid-wallet-id" | "error" | "done" | "init";

const ClaimPoap: FC = () => {
  const [twitterAuthStatus, setTwitterAuthStatus] = useTwitterAuthStatus();
  const [walletId, setWalletId] = useState<string>("");
  const [claimStatus, setClaimStatus] = useState<ClaimStatus>("init");
  const [showTooltip, setShowTooltip] = useState(false);

  const handleWalletIdInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      setWalletId(event.target.value);
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

        setClaimStatus("sending");

        const res = await fetch("/api/v2/fam/poap/claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ walletId }),
        });

        if (res.status === 200) {
          setClaimStatus("done");
          return;
        }

        if (res.status === 400) {
          setClaimStatus("invalid-wallet-id");
          return;
        }

        try {
          const body = (await res.json()) as { message?: string };
          if (typeof body.message === "string") {
            throw new Error(body.message);
          }

          console.error(body);
          throw new Error(
            `failed to claim poap, status ${res.status}, json body but no message`,
          );
        } catch (error) {
          console.log("tried to parse unknown as json body: ", error);
          throw new Error(
            `failed to claim poap, status ${res.status}, no json body`,
          );
        }
      };

      submit().catch((error) => {
        setClaimStatus("error");
        captureException(error);
        console.error(error);
      });
    },
    [twitterAuthStatus, walletId],
  );

  const handleSignOut = useCallback(() => {
    const signOut = async () => {
      const res = await fetch("/api/auth/twitter", {
        method: "DELETE",
      });

      if (res.status === 200) {
        setWalletId("");
        setClaimStatus("init");
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
  }, [setTwitterAuthStatus]);

  const handleClickNerd = useCallback(() => {
    setShowTooltip(true);
  }, []);

  return (
    <WidgetErrorBoundary title="claim poap">
      <WidgetBackground className="flex flex-col gap-y-8 max-w-3xl">
        <div className="relative flex justify-between items-center">
          <div className="flex items-center" onClick={handleClickNerd}>
            <LabelText>claim poap</LabelText>
            <Nerd />
          </div>
          <div
            className={`
              ${showTooltip ? "block" : "hidden"} fixed
              top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              w-[20rem]
              cursor-auto
              z-30
            `}
          >
            <ClaimPoapTooltip onClickClose={() => setShowTooltip(false)} />
          </div>
          <div className="w-10 md:w-16 md:h-16 md:absolute md:-right-12 md:-top-10 select-none">
            <Image
              alt="the proof of attendance protocol (POAP) logo, a protocol issuing NFTs proving you attended some event or are part of some group"
              src={logoPoapSvg as StaticImageData}
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
              <a
                href="/api/auth/twitter"
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
              <LabelText className="truncate">2. your wallet address</LabelText>
              <ClaimStatusText status={claimStatus} />
            </div>
            {twitterAuthStatus.type === "authenticated" &&
            !twitterAuthStatus.eligibleForPoap ? (
              <div className="border border-slateus-400 bg-slateus-700 text-slateus-100 flex justify-center items-center rounded-lg h-10">
                not enough fam followers to claim
              </div>
            ) : twitterAuthStatus.type === "authenticated" &&
              twitterAuthStatus.claimedPoap ? (
              <div className="border-slateus-400 bg-slateus-700 text-slateus-100 flex justify-center items-center rounded-lg h-10">
                <Twemoji
                  className=""
                  imageClassName="inline-flex h-4 ml-1"
                  wrapper
                >
                  claimed by @{twitterAuthStatus.handle}! 🥳
                </Twemoji>
              </div>
            ) : (
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
                    font-roboto
                    w-full
                    bg-transparent
                    text-xs md:text-base text-white
                    pl-4
                    placeholder-slateus-400
                    rounded-full
                    outline-none
                  `}
                  onChange={handleWalletIdInputChange}
                  pattern="0x[0-9a-fA-F]{40}|.+\.eth"
                  placeholder="vitalik.eth / 0xd4nk..."
                  required
                  spellCheck="false"
                  type="text"
                  value={walletId}
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
            )}
          </div>
        </div>
      </WidgetBackground>
      <div
        className={`
            fixed top-0 left-0 bottom-0 right-0
            flex justify-center items-center
            z-20
            bg-slateus-700/60
            backdrop-blur-sm
            ${showTooltip ? "" : "hidden"}
          `}
        onClick={() => setShowTooltip(false)}
      ></div>
    </WidgetErrorBoundary>
  );
};

const monkeySvgs = [
  seeNoEvilSvg as StaticImageData,
  speakNoEvilSvg as StaticImageData,
  hearNoEvilSvg as StaticImageData,
];

const Claimed: FC<{
  claimedOn: DateTimeString | undefined;
  isLoading: boolean;
  famFollowerCount: number;
}> = ({ claimedOn, isLoading, famFollowerCount }) => {
  const [age, setAge] = useState<string>();

  useEffect(() => {
    if (claimedOn === undefined) {
      return;
    }

    const now = new Date();

    // Set the current age immediately.
    setAge(formatDistance(now, new Date(claimedOn)));

    // And update it every 5 seconds.
    const intervalId = window.setInterval(() => {
      setAge(formatDistance(now, new Date(claimedOn)));
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [claimedOn]);

  const randomMonkeySrc = monkeySvgs[famFollowerCount % 3];

  // console.log(isLoading, age, claimedOn);

  return (
    <div className="flex justify-end items-baseline">
      <QuantifyText>
        <SkeletonText width="4rem">
          {isLoading || randomMonkeySrc === undefined ? undefined : age ===
            undefined ? (
            <Image
              alt="random emoji monkey covering one of its senses to indicate empathetic embarassment at not claiming a POAP"
              width={32}
              height={32}
              src={randomMonkeySrc}
            />
          ) : (
            <BodyTextV2>{age}</BodyTextV2>
          )}
        </SkeletonText>
      </QuantifyText>
      <BodyTextV2
        className={`text-slateus-400 ml-2 ${
          isLoading || age === undefined ? "hidden" : ""
        }`}
      >
        {" ago"}
      </BodyTextV2>
    </div>
  );
};

type EligibleFamClaimStatus = {
  claimed_on: DateTimeString | null;
  fam_follower_count: number;
  handle: string;
  name: string;
  profile_image_url: string;
  twitter_id: string;
};

const EligibleHandles = () => {
  const { data, error } = useSWR<EligibleFamClaimStatus[], Error>(
    "/api/v2/fam/poap/eligible-fam",
    fetchJsonSwr,
  );

  // We have an error boundary, this is fine.
  if (error?.message) {
    throw error;
  }

  const ImageWithFallback: FC<{ src: string }> = ({ src }) => {
    const [imgSrc, setImgSrc] = useState<string | StaticImageData>(src);

    const onImageError = useCallback(() => {
      setImgSrc(questionMarkSvg as StaticImageData);
    }, []);

    return (
      <Image
        onError={onImageError}
        className="rounded-full"
        alt={`profile image of ${"sassal"}`}
        src={imgSrc}
        width={40}
        height={40}
      />
    );
  };

  return (
    <WidgetBackground>
      <div className="grid grid-cols-[1fr_64px] md:grid-cols-[40px_2fr_64px] gap-x-4 mb-4">
        <LabelText className="col-span-1 md:col-span-2">
          1,559 Eligible Handles
        </LabelText>
        <LabelText>claimed</LabelText>
      </div>
      {data === undefined ? (
        <div className="flex justify-center">
          <Spinner />
        </div>
      ) : (
        <Twemoji
          className="truncate"
          imageClassName="inline-block align-middle h-4 ml-1"
          wrapper
        >
          <ul className="flex flex-col max-h-[27rem] overflow-y-auto gap-y-4">
            {data.map((fam, index) => (
              <li
                className="grid grid-cols-[40px_1fr_64px] md:grid-cols-[40px_2fr_64px] gap-x-4 items-center"
                key={fam.twitter_id}
              >
                <div className="mt-1 -mb-1">
                  <ImageWithFallback src={fam.profile_image_url} />
                </div>
                <div className="flex items-center overflow-hidden h-full">
                  <div className="flex flex-col truncate">
                    <BodyTextV2 className="truncate">{fam.name}</BodyTextV2>
                    <BodyTextV2 className="text-slateus-400 truncate">
                      <StyledLink href={`https://twitter.com/${fam.handle}`}>
                        @{fam.handle}
                      </StyledLink>
                    </BodyTextV2>
                  </div>
                </div>
                <Claimed
                  isLoading={data === undefined && error === undefined}
                  claimedOn={
                    index % 10 === 0
                      ? new Date(
                          new Date().getTime() - 1000 * 60 * (index % 300),
                        ).toISOString()
                      : fam.claimed_on ?? undefined
                  }
                  famFollowerCount={fam.fam_follower_count}
                />
              </li>
            ))}
          </ul>
        </Twemoji>
      )}
    </WidgetBackground>
  );
};

const Spinner = () => (
  <div className="[border:8px_solid_#2d344a] [border-top:8px_solid_#8991ad] rounded-[50%] w-20 h-20 animate-spin"></div>
);

type PoapsClaimed = {
  count: number;
};

const PoapSection: FC = () => {
  const { data: poapsClaimed, error } = useSWR<PoapsClaimed, Error>(
    `${getDomain()}/api/v2/fam/poap/claimed`,
    fetchJsonSwr,
  );
  const { ref, inView } = useInView({ threshold: 1 });
  const [poapSrc, setPoapSrc] = useState(ultraSoundPoapGif);

  if (error?.message) {
    throw error;
  }

  useEffect(() => {
    if (inView) {
      const timeoutId = window.setTimeout(() => {
        setPoapSrc(ultraSoundPoapStill);
      }, 3000);

      return () => window.clearTimeout(timeoutId);
    }
  }, [inView]);

  return (
    <section id="poap">
      <SectionTitle className="mt-16 pt-16" link="poap" subtitle="only 1,559">
        ultra sound POAP
      </SectionTitle>
      <div className="flex justify-center my-16">
        <div
          className="flex"
          ref={ref}
          onMouseEnter={() => setPoapSrc(ultraSoundPoapGif)}
          onMouseLeave={() => setPoapSrc(ultraSoundPoapStill)}
        >
          <Image
            alt="image from the ultra sound money poap given out to pre-merge fam"
            src={poapSrc}
            width={128}
            height={128}
          />
        </div>
      </div>
      <div className="relative flex flex-col gap-y-4">
        <WidgetBackground className="flex flex-col gap-y-4">
          <LabelText>claims</LabelText>
          <QuantifyText className="text-3xl">
            <SkeletonText width="1.1rem">{poapsClaimed?.count}</SkeletonText>
            <span className="text-slateus-200">/1,559</span>
          </QuantifyText>
        </WidgetBackground>
        <WidgetErrorBoundary title="claim POAP">
          <ClaimPoap />
        </WidgetErrorBoundary>
        <WidgetErrorBoundary title="1,559 Eligible Handles">
          <EligibleHandles />
        </WidgetErrorBoundary>
      </div>
    </section>
  );
};

export default PoapSection;
