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
import scrollbarStyles from "../../styles/Scrollbar.module.scss";
import withBasicErrorBoundary from "../../higher-order-components/WithBasicErrorBoundary";
import type { AuthFromSection } from "../../hooks/use-auth-from-section";
import useAuthFromSection from "../../hooks/use-auth-from-section";

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
      rounded-lg border border-blue-shipcove
      bg-blue-tangaroa p-8
      text-left
      ${className}
    `}
  >
    <button
      className={`
        flex w-6
        select-none self-end
        hover:brightness-110 active:brightness-90
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
      className="mx-auto h-20 w-20 select-none rounded-full"
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

const ClaimPoap: FC<{ className?: string }> = ({ className }) => {
  const [twitterAuthStatus, setTwitterAuthStatus] = useTwitterAuthStatus();
  const [, setAuthFromSection] = useAuthFromSection();
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
    <>
      <WidgetBackground
        className={`flex max-w-3xl flex-col gap-y-8 ${className}`}
      >
        <div className="relative flex items-center justify-between">
          <div className="flex items-center" onClick={handleClickNerd}>
            <LabelText>claim poap</LabelText>
            <Nerd />
          </div>
          <div
            className={`
              ${showTooltip ? "block" : "hidden"} fixed
              top-1/2 left-1/2 z-30 w-[20rem]
              -translate-x-1/2
              -translate-y-1/2
              cursor-auto
            `}
          >
            <ClaimPoapTooltip onClickClose={() => setShowTooltip(false)} />
          </div>
          <div className="w-10 select-none md:absolute md:-right-12 md:-top-10 md:h-16 md:w-16">
            <Image
              alt="the proof of attendance protocol (POAP) logo, a protocol issuing NFTs proving you attended some event or are part of some group"
              src={logoPoapSvg as StaticImageData}
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-8">
          <div className="flex flex-col gap-y-4">
            <div className="flex items-baseline justify-between">
              <LabelText>1. your twitter</LabelText>
              <TwitterStatusText status={twitterAuthStatus} />
            </div>
            {twitterAuthStatus.type !== "authenticated" ? (
              <a
                href="/api/auth/twitter"
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
                  setAuthFromSection("poap");
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
              ${
                twitterAuthStatus.type === "authenticated"
                  ? "opacity-100"
                  : "opacity-50"
              }
            `}
          >
            <div className="flex items-baseline justify-between gap-x-1">
              <LabelText className="truncate">2. your wallet address</LabelText>
              <ClaimStatusText status={claimStatus} />
            </div>
            {twitterAuthStatus.type === "authenticated" &&
            !twitterAuthStatus.eligibleForPoap ? (
              <div className="flex h-10 items-center justify-center rounded-lg border border-slateus-400 bg-slateus-700 text-slateus-100">
                not enough fam followers to claim
              </div>
            ) : twitterAuthStatus.type === "authenticated" &&
              twitterAuthStatus.claimedPoap ? (
              <div className="flex h-10 items-center justify-center rounded-lg border-slateus-400 bg-slateus-700 text-slateus-100">
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
                    bg-transparent
                    pl-4 font-roboto text-xs
                    text-white
                    placeholder-slateus-400
                    outline-none
                    md:text-base
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
            )}
          </div>
        </div>
      </WidgetBackground>
      <div
        className={`
          fixed top-0 left-0 bottom-0 right-0
          z-20 flex items-center
          justify-center
          bg-slateus-700/60
          backdrop-blur-sm
          ${showTooltip ? "" : "hidden"}
        `}
        onClick={() => setShowTooltip(false)}
      ></div>
    </>
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
    <div className="flex items-baseline justify-end">
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
        className={`ml-2 text-slateus-400 ${
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

const EligibleHandles: FC<{ className?: string }> = ({ className }) => {
  const { data, error } = useSWR<EligibleFamClaimStatus[], Error>(
    "/api/v2/fam/poap/eligible-fam",
    fetchJsonSwr,
  );

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
    <WidgetBackground className={className}>
      <div className="mb-4 grid grid-cols-[1fr_64px] gap-x-4 md:grid-cols-[40px_2fr_64px]">
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
        <Twemoji imageClassName="inline-block align-middle h-4 ml-1" wrapper>
          <ul
            className={`-mr-1 flex max-h-[27rem] flex-col gap-y-4 overflow-y-auto pr-1 lg:max-h-[23rem] ${scrollbarStyles["styled-scrollbar"]}`}
          >
            {data.map((fam) => (
              <li
                className="grid grid-cols-[40px_1fr_64px] items-center gap-x-4 md:grid-cols-[40px_2fr_64px]"
                key={fam.twitter_id}
              >
                <div className="mt-1 -mb-1">
                  <ImageWithFallback src={fam.profile_image_url} />
                </div>
                <div className="flex h-full items-center overflow-hidden">
                  <div className="flex flex-col truncate">
                    <BodyTextV2 className="truncate">{fam.name}</BodyTextV2>
                    <BodyTextV2 className="truncate text-slateus-400">
                      <StyledLink href={`https://twitter.com/${fam.handle}`}>
                        @{fam.handle}
                      </StyledLink>
                    </BodyTextV2>
                  </div>
                </div>
                <Claimed
                  isLoading={data === undefined && error === undefined}
                  claimedOn={fam.claimed_on ?? undefined}
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
  <div className="h-20 w-20 animate-spin rounded-[50%] [border:8px_solid_#2d344a] [border-top:8px_solid_#8991ad]"></div>
);

type PoapsClaimed = {
  count: number;
};

const PoapSection: FC = () => {
  const { data: poapsClaimed, mutate } = useSWR<PoapsClaimed, Error>(
    `${getDomain()}/api/v2/fam/poap/claimed`,
    fetchJsonSwr,
  );
  const { ref, inView } = useInView({ threshold: 1 });
  const [poapSrc, setPoapSrc] = useState(ultraSoundPoapGif);

  useEffect(() => {
    if (inView) {
      const timeoutId = window.setTimeout(() => {
        setPoapSrc(ultraSoundPoapStill);
      }, 3000);

      return () => window.clearTimeout(timeoutId);
    }
  }, [inView]);

  const id: AuthFromSection = "poap";

  const handleRefreshClaimStatus = useCallback(() => {
    mutate().catch(captureException);
  }, [mutate]);

  return (
    <section className="px-4 md:px-16" id={id}>
      <SectionTitle className="mt-16 pt-16" link="poap" subtitle="only 1,559">
        ultra sound POAP
      </SectionTitle>
      <div className="my-16 flex justify-center">
        <div
          className="flex"
          ref={ref}
          onClick={() => {
            setPoapSrc(ultraSoundPoapGif);
            window.setTimeout(() => {
              setPoapSrc(ultraSoundPoapStill);
            }, 5000);
          }}
        >
          <Image
            alt="image from the ultra sound money poap given out to pre-merge fam"
            src={poapSrc}
            width={128}
            height={128}
          />
        </div>
      </div>
      <div className="grid auto-rows-min gap-4 lg:grid-cols-2">
        <WidgetBackground className="flex flex-col gap-y-4">
          <LabelText>claims</LabelText>
          <QuantifyText className="text-3xl">
            <SkeletonText width="1.1rem">{poapsClaimed?.count}</SkeletonText>
            <span className="text-slateus-200">/1,559</span>
          </QuantifyText>
        </WidgetBackground>
        <WidgetErrorBoundary title="claim POAP">
          <ClaimPoap className="col-start-1" />
        </WidgetErrorBoundary>
        <WidgetErrorBoundary title="1,559 Eligible Handles">
          <EligibleHandles className="row-span-2 lg:col-start-2 lg:row-start-1" />
        </WidgetErrorBoundary>
      </div>
    </section>
  );
};

export default withBasicErrorBoundary(PoapSection);
