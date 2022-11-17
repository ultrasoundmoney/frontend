import { captureException } from "@sentry/nextjs";
import type { StaticImageData } from "next/legacy/image";
import Image from "next/legacy/image";
import type {
  ChangeEvent,
  CSSProperties,
  Dispatch,
  FC,
  FormEvent,
  MouseEventHandler,
  ReactNode,
  SetStateAction,
} from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { FixedSizeList } from "react-window";
import useSWR from "swr";
import { fetchJsonSwr } from "../../api/fetchers";
import type { Linkables } from "../../api/profiles";
import closeSvg from "../../assets/close.svg";
import flexSvg from "../../assets/flex-own.svg";
import logoTwitterWhite from "../../assets/logo-twitter-white.svg";
import questionMarkSvg from "../../assets/question-mark-v2.svg";
import sobSvg from "../../assets/sob-own.svg";
import { getDomain } from "../../config";
import { formatDistance } from "../../format";
import withBasicErrorBoundary from "../../higher-order-components/WithBasicErrorBoundary";
import type { AuthFromSection } from "../../hooks/use-auth-from-section";
import useAuthFromSection from "../../hooks/use-auth-from-section";
import useFuseSearch from "../../hooks/use-fuse-search";
import type { TwitterAuthStatus } from "../../hooks/use-twitter-auth";
import scrollbarStyles from "../../styles/Scrollbar.module.scss";
import type { DateTimeString } from "../../time";
import FamTooltip from "../FamTooltip";
import Nerd from "../Nerd";
import {
  AlignmentText,
  LoadingText,
  NegativeText,
  PositiveText,
} from "../StatusText";
import { BaseText, TooltipTitle } from "../Texts";
import BodyTextV2 from "../TextsNext/BodyTextV2";
import LabelText from "../TextsNext/LabelText";
import LinkText from "../TextsNext/LinkText";
import QuantifyText from "../TextsNext/QuantifyText";
import { SectionTitle } from "../TextsNext/SectionTitle";
import SkeletonText from "../TextsNext/SkeletonText";
import Twemoji from "../Twemoji";
import TwitterStatusText from "../TwitterStatusText";
import WidgetErrorBoundary from "../WidgetErrorBoundary";
import { WidgetBackground } from "../WidgetSubcomponents";
import hearNoEvilSvg from "./hear-no-evil-own.svg";
import logoPoapSvg from "./logo-poap-slateus.svg";
import magnifyingGlassSvg from "./magnifying-glass-own.svg";
import seeNoEvilSvg from "./see-no-evil-own.svg";
import speakNoEvilSvg from "./speak-no-evil-own.svg";
import ultraSoundPoapStill from "./ultrasoundpoapstill.png";
import ultraSoundPoapGif from "./utlra_sound_poap.gif";

type ClaimPoapTooltipProps = {
  className?: string;
  onClickClose?: () => void;
};

const TooltipText: FC<{ children: ReactNode; inline?: boolean }> = ({
  children,
  inline = false,
}) => (
  <BaseText font="font-inter" size="text-base" inline={inline}>
    {children}
  </BaseText>
);

const ClaimPoapTooltip: FC<ClaimPoapTooltipProps> = ({
  className = "",
  onClickClose,
}) => (
  <div
    onClick={(e) => {
      e.stopPropagation();
    }}
    className={`
      relative flex max-h-[95vh] flex-col gap-y-4
      overflow-hidden rounded-lg border
      border-slateus-400 bg-slateus-700
      p-8
      text-left
      md:max-h-[90vh]
      ${className}
    `}
  >
    <button
      className={`
        absolute right-5 top-5
        flex w-6
        select-none self-end
        hover:brightness-110 active:brightness-90
      `}
    >
      <Image
        alt="a close button, circular with an x in the middle"
        draggable={false}
        height={24}
        onClick={onClickClose}
        src={closeSvg as StaticImageData}
        width={24}
      />
    </button>
    <div className="flex select-none justify-center">
      <Image
        alt="the Proof of Attendance (POAP) logo"
        className="h-20 w-20 cursor-pointer select-none rounded-full"
        src={logoPoapSvg as StaticImageData}
        height={64}
        width={64}
      />
    </div>
    <TooltipTitle>ultra sound POAP</TooltipTitle>
    <div className="flex flex-col gap-y-4 overflow-y-scroll">
      <TooltipText>
        The ultra sound money meme spreads at L0, via humans. This exclusive
        POAP is a small reward for early meme spreaders.
      </TooltipText>
      <LabelText>eligibility</LabelText>
      <TooltipText inline={true}>
        <ul className="list-inside list-decimal">
          <li>Part of the fam pre-merge.</li>
          <li>Had 8+ fam followers in a recent snapshot.</li>
          <li>One of the first 1,559 to claim.</li>
        </ul>
      </TooltipText>
      <LabelText>Fam</LabelText>
      <Twemoji wrapper imageClassName="inline-block align-middle h-4 ml-1">
        <TooltipText>
          The fam are{" "}
          <a
            href="https://ultrasound.money/#fam"
            rel="noreferrer"
            target="_blank"
          >
            <LinkText>5,000+ supporters</LinkText>
          </a>{" "}
          with variants of the bat signal
          <span className="whitespace-nowrap">🦇🔊</span> on their Twitter
          profile.
        </TooltipText>
      </Twemoji>
      <LabelText>benefits</LabelText>
      <TooltipText>
        Beyond pride and glory, POAP holders get priority access to the{" "}
        <a
          href="https://ultrasound.money/#discord"
          rel="noreferrer"
          target="_blank"
        >
          <LinkText>ultra sound Discord.</LinkText>
        </a>
      </TooltipText>
    </div>
  </div>
);

const ClaimStatusText: FC<{ status: ClaimStatus }> = ({ status }) =>
  status === "invalid-address" ? (
    <NegativeText>invalid wallet id</NegativeText>
  ) : status === "error" ? (
    <NegativeText>error</NegativeText>
  ) : status === "sending" ? (
    <LoadingText>sending...</LoadingText>
  ) : status === "sent" ? (
    <PositiveText>sent!</PositiveText>
  ) : (
    <AlignmentText />
  );

type ClaimStatus = "sending" | "invalid-address" | "error" | "sent" | "init";

const ClaimPoap: FC<{
  className?: string;
  refreshClaimStatus: () => void;
  setTwitterAuthStatus: Dispatch<SetStateAction<TwitterAuthStatus>>;
  twitterAuthStatus: TwitterAuthStatus;
}> = ({
  className,
  refreshClaimStatus,
  twitterAuthStatus,
  setTwitterAuthStatus,
}) => {
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
          setClaimStatus("sent");
          refreshClaimStatus();
          return;
        }

        if (res.status === 400) {
          setClaimStatus("invalid-address");
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
    [refreshClaimStatus, twitterAuthStatus.type, walletId],
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

    signOut().catch((error) => {
      captureException(error);
    });
  }, [setTwitterAuthStatus]);

  const handleClickNerd = useCallback(() => {
    setShowTooltip(true);
  }, []);

  const NotEligible = () => (
    <div className="flex min-h-[82px] flex-col gap-y-4">
      <LabelText className="flex min-h-[24px] items-center">
        status: not eligible
      </LabelText>
      <div className="flex select-none justify-center">
        <Image
          alt="a sobbing emoji signifying sadness at not being eligible"
          className="select-none"
          height={40}
          src={sobSvg as StaticImageData}
          width={40}
        />
        <button className="ml-4" onClick={() => setShowTooltip(true)}>
          <LinkText>show criteria</LinkText>
        </button>
      </div>
    </div>
  );

  const Claimed: FC = () => (
    <div className="flex min-h-[82px] flex-col gap-y-4">
      <LabelText className="flex min-h-[24px] items-center">
        status: claimed
      </LabelText>
      <div className="flex select-none justify-center">
        <Image
          alt="a sobbing emoji signifying sadness at not being eligible"
          className="select-none"
          height={40}
          src={flexSvg as StaticImageData}
          width={40}
        />
      </div>
    </div>
  );

  return (
    <>
      <WidgetBackground
        className={`
          flex max-w-3xl flex-col justify-between
          ${className}
        `}
      >
        <div className="relative flex items-start justify-between">
          <div
            className="flex cursor-pointer items-center"
            onClick={handleClickNerd}
          >
            <LabelText>claim poap</LabelText>
            <Nerd />
          </div>
          <div
            className={`
              ${showTooltip ? "block" : "hidden"} fixed
              top-1/2 left-1/2 z-30 w-[20rem] -translate-x-1/2
              -translate-y-1/2
              cursor-auto
              md:w-[24rem]
            `}
          >
            <ClaimPoapTooltip onClickClose={() => setShowTooltip(false)} />
          </div>
          <div className="-mr-1.5 select-none">
            <Image
              alt="the proof of attendance protocol (POAP) logo, a protocol issuing NFTs proving you attended some event or are part of some group"
              height={40}
              src={logoPoapSvg as StaticImageData}
              width={40}
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-8">
          <div className="flex flex-col gap-y-4">
            <div className="flex items-baseline justify-between">
              <LabelText>your twitter</LabelText>
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
                  flex select-none items-center gap-x-2
                  self-center
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
                <Image
                  alt="twitte logo in white"
                  src={logoTwitterWhite as StaticImageData}
                  height={16}
                  width={16}
                />
              </button>
            )}
          </div>
          {twitterAuthStatus.type === "authenticated" &&
          !twitterAuthStatus.eligibleForPoap ? (
            <NotEligible />
          ) : twitterAuthStatus.type === "authenticated" &&
            twitterAuthStatus.claimedPoap ? (
            <Claimed />
          ) : (
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
                <LabelText>your wallet address</LabelText>
                <ClaimStatusText status={claimStatus} />
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
                    bg-transparent
                    pl-4 font-inter text-xs font-light
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
            </div>
          )}
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
  monkey: StaticImageData;
}> = ({ claimedOn, isLoading, monkey }) => {
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

  return (
    <div className="flex items-baseline justify-end">
      <QuantifyText>
        <SkeletonText width="4rem">
          {isLoading || monkey === undefined ? undefined : age === undefined ? (
            <div className="h-8 w-8 select-none">
              <Image
                title="not claimed"
                alt="random emoji monkey covering one of its senses to indicate empathetic embarassment at not claiming a POAP"
                width={32}
                height={32}
                src={monkey}
              />
            </div>
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

type EligibleFam = {
  bio: string | null;
  claimed_on: DateTimeString | null;
  fam_follower_count: number;
  follower_count: number;
  handle: string;
  linkables: Linkables;
  name: string;
  onEnterImage: (handle: string) => void;
  onLeaveImage: () => void;
  profile_image_url: string;
  twitter_id: string;
};

const ImageWithFallback: FC<{
  handle: string;
  onMouseEnter?: MouseEventHandler<HTMLImageElement>;
  onMouseLeave?: MouseEventHandler<HTMLImageElement>;
  src: string;
}> = ({ handle, src, onMouseEnter, onMouseLeave }) => {
  const [imgSrc, setImgSrc] = useState<string | StaticImageData>(src);

  const onImageError = useCallback(() => {
    setImgSrc(questionMarkSvg as StaticImageData);
  }, []);

  return (
    <div className="relative mt-0.5 h-[40px] w-[40px] min-w-[40px] hover:brightness-75">
      <Image
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        alt={`profile image of ${handle}`}
        className={`max-h-[40px] max-w-[40px] select-none rounded-full`}
        onError={onImageError}
        src={imgSrc}
        layout="fill"
        sizes="40px"
      />
    </div>
  );
};

type RowProps = {
  data: EligibleFam[];
  index: number;
  style: CSSProperties;
  className?: string;
};

const Row: FC<RowProps> = ({ data, style = {}, index, className = "" }) => {
  const fam = data[index];
  if (fam === undefined) {
    return <div>row unavailable</div>;
  }

  return (
    <li
      style={style}
      className={`flex h-16 w-full items-center justify-between gap-x-4 pr-1 ${className}`}
      key={fam.twitter_id}
    >
      <div className="flex items-center overflow-x-hidden">
        <ImageWithFallback
          handle={fam.handle}
          onMouseEnter={() => fam.onEnterImage(fam.handle)}
          onMouseLeave={fam.onLeaveImage}
          src={fam.profile_image_url}
        />
        <a
          className="cursor-pointer overflow-x-hidden hover:brightness-90 active:brightness-75"
          href={`https://twitter.com/${fam.handle}`}
          rel="noreferrer"
          target="_blank"
        >
          <Twemoji imageClassName="inline-block align-middle h-4 ml-1">
            <div className="ml-4 flex h-full flex-col items-start overflow-x-hidden">
              <BodyTextV2 className="w-full truncate">{fam.name}</BodyTextV2>
              <BodyTextV2 className="truncate text-slateus-400">
                @{fam.handle}
              </BodyTextV2>
            </div>
          </Twemoji>
        </a>
      </div>
      <Claimed
        isLoading={false}
        claimedOn={fam.claimed_on ?? undefined}
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        monkey={monkeySvgs[index % 3]!}
      />
    </li>
  );
};

const EligibleHandles: FC<{ className?: string }> = ({ className }) => {
  const { data } = useSWR<EligibleFam[], Error>(
    "/api/v2/fam/poap/eligible-fam",
    fetchJsonSwr,
  );
  const [searchHandle, setSearchHandle] = useState("");
  const [tooltipActiveHandle, setTooltipActiveHandle] = useState<string>();

  const handleOnEnterImage = useCallback((handle: string) => {
    setTooltipActiveHandle(handle);
  }, []);

  const handleOnLeaveImage = useCallback(() => {
    setTooltipActiveHandle(undefined);
  }, []);

  const dataWithHandlers = data?.map((item) => ({
    ...item,
    onEnterImage: handleOnEnterImage,
    onLeaveImage: handleOnLeaveImage,
  }));

  const searchResults = useFuseSearch(
    dataWithHandlers,
    searchHandle,
    { keys: ["handle", "name"] },
    { limit: 10 },
  );

  const accountMap = useMemo(() => {
    if (data === undefined) {
      return undefined;
    }

    return Object.fromEntries(
      data.map((fam) => [fam.handle, fam] as [string, EligibleFam]),
    );
  }, [data]);

  const tooltipActiveAccount =
    accountMap === undefined || tooltipActiveHandle === undefined
      ? undefined
      : accountMap[tooltipActiveHandle];

  return (
    <WidgetBackground className={`flex flex-col justify-between ${className}`}>
      <div
        className={`
          ${tooltipActiveHandle !== undefined ? "block" : "hidden"} fixed
          top-1/2 right-0 z-30 w-[20rem] -translate-y-1/2
          cursor-auto
          md:right-10
          md:w-[24rem]
        `}
      >
        {tooltipActiveAccount && (
          <FamTooltip
            description={tooltipActiveAccount.bio ?? undefined}
            famFollowerCount={tooltipActiveAccount.fam_follower_count}
            followerCount={tooltipActiveAccount.follower_count}
            imageUrl={tooltipActiveAccount.profile_image_url}
            title={tooltipActiveAccount.name}
            links={tooltipActiveAccount.linkables}
            onClickClose={() => setTooltipActiveHandle(undefined)}
            width="20rem"
          />
        )}
      </div>
      <div className="mb-4 flex justify-between">
        <LabelText>Eligible Accounts</LabelText>
        <LabelText className="text-right">claimed?</LabelText>
      </div>
      {dataWithHandlers === undefined ? (
        <div className="flex h-full items-center justify-center">
          <Spinner />
        </div>
      ) : searchResults === undefined ||
        (searchHandle.length === 0 && searchResults.length === 0) ? (
        <FixedSizeList
          height={434}
          itemCount={dataWithHandlers.length}
          itemSize={64}
          width="100%"
          itemData={dataWithHandlers}
          className={`${scrollbarStyles["styled-scrollbar-vertical"]} ${scrollbarStyles["styled-scrollbar"]}`}
        >
          {Row}
        </FixedSizeList>
      ) : searchResults.length === 0 ? (
        <div className="flex h-full w-full items-center justify-center">
          <BodyTextV2 color="text-slateus-200">no search results</BodyTextV2>
        </div>
      ) : (
        <FixedSizeList
          height={434}
          itemCount={searchResults.length}
          itemSize={64}
          width="100%"
          itemData={searchResults.map((result) => result.item)}
          className={`${scrollbarStyles["styled-scrollbar-vertical"]} ${scrollbarStyles["styled-scrollbar"]}`}
        >
          {Row}
        </FixedSizeList>
      )}
      <div className="relative">
        <input
          className={`
            w-full
            rounded-full
            border border-slateus-500
            bg-slateus-800 py-1.5 pl-4
            font-inter text-xs font-light
            text-white placeholder-slateus-400 outline-none
            focus-within:border-slateus-400
            md:py-2
            md:text-base
          `}
          onChange={(event) => {
            setTooltipActiveHandle(undefined);
            setSearchHandle(event.target.value);
          }}
          placeholder="search..."
          type="text"
          value={searchHandle}
        />
        <div className="absolute top-1.5 right-3 select-none md:top-3">
          <Image
            alt="magnifying glass indicating this input is to search for handles"
            src={magnifyingGlassSvg as StaticImageData}
            width={16}
            height={16}
          />
        </div>
      </div>
    </WidgetBackground>
  );
};

const Spinner = () => (
  <div className="h-20 w-20 animate-spin rounded-[50%] [border:8px_solid_#2d344a] [border-top:8px_solid_#8991ad]"></div>
);

type RecentClaimAccount = {
  bio: string;
  claimed_on: DateTimeString;
  fam_follower_count: number;
  follower_count: number;
  handle: string;
  linkables: Linkables | null;
  name: string;
  profile_image_url: string | null;
  twitter_id: string;
};

type PoapsClaimed = {
  count: number;
  index: number;
  latest_claimers: RecentClaimAccount[];
};

const Claimer: FC<{ handle: string; src: string | null; index: number }> = ({
  handle,
  index,
  src,
}) => {
  const [imgSrc, setImgSrc] = useState<string | StaticImageData | null>(src);

  const onImageError = useCallback(() => {
    setImgSrc(questionMarkSvg as StaticImageData);
  }, []);

  return (
    <a
      href={`https://twitter.com/${handle}`}
      rel="noreferrer"
      target="_blank"
      className={`
        relative mt-0.5 ${index !== 0 ? "-ml-2" : ""}
        h-[40px] w-[40px] min-w-[40px]
        rounded-full
        border border-slateus-200
        hover:brightness-90
        active:brightness-75
      `}
      style={{ zIndex: 10 - index }}
    >
      <Image
        alt={`profile image of ${handle}`}
        className={"max-h-[40px] max-w-[40px] select-none rounded-full"}
        onError={onImageError}
        src={imgSrc === null ? (questionMarkSvg as StaticImageData) : imgSrc}
        layout="fill"
        sizes="40px"
      />
    </a>
  );
};

const PoapSection: FC<{
  setTwitterAuthStatus: Dispatch<SetStateAction<TwitterAuthStatus>>;
  twitterAuthStatus: TwitterAuthStatus;
}> = ({ setTwitterAuthStatus, twitterAuthStatus }) => {
  const { data: poapsClaimed, mutate } = useSWR<PoapsClaimed, Error>(
    `${getDomain()}/api/v2/fam/poap/claimed`,
    fetchJsonSwr,
  );
  const { ref, inView } = useInView({ threshold: 1 });
  const [animatePoap, setAnimatePoap] = useState(true);
  const animationTimeoutId = useRef<number>();

  useEffect(() => {
    if (inView) {
      const timeoutId = window.setTimeout(() => {
        setAnimatePoap(false);
      }, 3000);

      return () => window.clearTimeout(timeoutId);
    }
  }, [inView]);

  const id: AuthFromSection = "poap";

  const handleRefreshClaimStatus = useCallback(() => {
    mutate().catch(captureException);
  }, [mutate]);

  const handleClickPoap = useCallback(() => {
    if (animatePoap) {
      setAnimatePoap(false);
      if (typeof animationTimeoutId.current === "number") {
        window.clearTimeout(animationTimeoutId.current);
      }
      return;
    }

    setAnimatePoap(true);
    animationTimeoutId.current = window.setTimeout(() => {
      setAnimatePoap(false);
    }, 5000);
  }, [animatePoap]);

  return (
    <section className="px-4 md:px-16" id={id}>
      <SectionTitle className="mt-16 pt-16" link="poap" subtitle="only 1,559">
        ultra sound POAP
      </SectionTitle>
      <div className="my-12 flex justify-center">
        <div
          className="flex cursor-pointer select-none"
          ref={ref}
          onClick={handleClickPoap}
        >
          <Image
            className="select-none"
            alt="image from the ultra sound money poap given out to pre-merge fam"
            src={animatePoap ? ultraSoundPoapGif : ultraSoundPoapStill}
            width={144}
            height={144}
          />
        </div>
      </div>
      <div className="grid auto-rows-min gap-4 lg:grid-cols-2">
        <WidgetBackground className="flex flex-col gap-y-8 overflow-hidden">
          <div className="flex flex-col gap-y-4">
            <LabelText>claims</LabelText>
            <QuantifyText className="text-3xl">
              <SkeletonText width="4rem">{poapsClaimed?.count}</SkeletonText>
              <span className="text-slateus-200">/1,559</span>
            </QuantifyText>
          </div>
          <div className="flex flex-col gap-y-4">
            <LabelText>latest claimers</LabelText>
            <div
              className={`flex w-full overflow-x-scroll pb-2 ${scrollbarStyles["styled-scrollbar"]} ${scrollbarStyles["styled-scrollbar-horizontal"]}`}
            >
              {poapsClaimed?.latest_claimers
                .slice(0, 10)
                .map((claimer, index) => (
                  <Claimer
                    key={claimer.twitter_id}
                    handle={claimer.handle}
                    src={claimer.profile_image_url}
                    index={index}
                  />
                ))}
            </div>
          </div>
        </WidgetBackground>
        <WidgetErrorBoundary title="claim POAP">
          <ClaimPoap
            className="col-start-1"
            refreshClaimStatus={handleRefreshClaimStatus}
            twitterAuthStatus={twitterAuthStatus}
            setTwitterAuthStatus={setTwitterAuthStatus}
          />
        </WidgetErrorBoundary>
        <WidgetErrorBoundary title="Eligible Handles">
          <EligibleHandles className="row-span-2 lg:col-start-2 lg:row-start-1" />
        </WidgetErrorBoundary>
      </div>
    </section>
  );
};

export default withBasicErrorBoundary(PoapSection);
