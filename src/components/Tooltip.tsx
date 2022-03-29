import { FC, ReactEventHandler, useCallback, useState } from "react";
import { Linkables } from "../api/fam";
import * as Format from "../format";
import scrollbarStyles from "../styles/Scrollbar.module.scss";
import { TextInter, TextRoboto } from "./Texts";
import Twemoji from "./Twemoji";
import BioWithLinks from "./Twitter/BioWithLinks";
import { WidgetTitle } from "./widget-subcomponents";

export const TwemojiBio: FC = ({ children }) => (
  <Twemoji imageClassName="inline h-6">{children}</Twemoji>
);

type ExternalLinkProps = {
  alt: string;
  className?: HTMLAnchorElement["className"];
  icon: string;
  href: string | undefined;
};

export const ExternalLink: FC<ExternalLinkProps> = ({
  alt,
  className = "",
  icon,
  href,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <a
      className={`relative ${className}`}
      href={href}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      rel="noreferrer"
      target="_blank"
    >
      <img src={`/round-${icon}-coloroff.svg`} alt={alt} className={`w-12`} />
      <img
        className={`absolute w-12 top-0 ${isHovering ? "" : "hidden"}`}
        src={`/round-${icon}-coloron.svg`}
        alt={alt}
      />
    </a>
  );
};

export type TooltipProps = {
  coingeckoUrl?: string;
  description: string | undefined;
  famFollowerCount: number | undefined;
  followerCount: number | undefined;
  imageUrl: string | undefined;
  links?: Linkables;
  nftGoUrl?: string;
  onClickClose?: () => void;
  title: string | undefined;
  twitterUrl?: string;
};

const Tooltip: FC<TooltipProps> = ({
  coingeckoUrl,
  description,
  famFollowerCount,
  followerCount,
  imageUrl,
  links,
  nftGoUrl,
  onClickClose,
  title,
  twitterUrl,
}) => {
  const onImageError = useCallback<ReactEventHandler<HTMLImageElement>>((e) => {
    (e.target as HTMLImageElement).src =
      "/leaderboard-images/question-mark-v2.svg";
  }, []);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={`
        relative
        flex flex-col gap-y-4
        bg-blue-tangaroa p-8 rounded-lg
        border border-blue-shipcove
        w-[22rem]
      `}
    >
      <img
        alt="a close button, circular with an x in the middle"
        className="md:hidden absolute w-6 right-5 top-5 hover:brightness-90 active:brightness-110 cursor-pointer"
        onClick={onClickClose}
        src="/close.svg"
      />
      <img
        alt=""
        className="w-20 h-20 mx-auto rounded-full"
        onError={onImageError}
        src={imageUrl}
      />
      <TextInter className="font-semibold">
        <Twemoji imageClassName="inline h-5 ml-1">{title}</Twemoji>
      </TextInter>
      <div
        className={`max-h-64 overflow-y-auto ${scrollbarStyles["styled-scrollbar"]}`}
      >
        <TextInter className="md:leading-normal">
          {description === undefined ? null : links === undefined ? (
            <TwemojiBio>{description}</TwemojiBio>
          ) : (
            <BioWithLinks bio={description} linkables={links}></BioWithLinks>
          )}
        </TextInter>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-y-4">
          <WidgetTitle>followers</WidgetTitle>
          <TextRoboto className="font-extralight text-2xl">
            {followerCount === undefined
              ? "--"
              : Format.formatCompact(followerCount)}
          </TextRoboto>
        </div>
        <div className="flex flex-col gap-y-4 items-end">
          <WidgetTitle>fam followers</WidgetTitle>
          <TextRoboto className="font-extralight text-2xl">
            {famFollowerCount === undefined
              ? "--"
              : Format.formatCompact(famFollowerCount)}
          </TextRoboto>
        </div>
      </div>
      <div
        className={`
        flex flex-col gap-y-4
        ${
          twitterUrl !== undefined ||
          coingeckoUrl !== undefined ||
          nftGoUrl !== undefined
            ? "block"
            : "hidden"
        }`}
      >
        <WidgetTitle>external links</WidgetTitle>
        <div className="flex gap-x-4">
          {twitterUrl && (
            <ExternalLink
              alt="twitter logo"
              className={`${twitterUrl === "undefined" ? "hidden" : "block"}`}
              href={twitterUrl}
              icon={"twitter"}
            />
          )}
          {coingeckoUrl && (
            <ExternalLink
              alt="coingecko logo"
              className={`${coingeckoUrl === "undefined" ? "hidden" : "block"}`}
              href={coingeckoUrl}
              icon={"coingecko"}
            />
          )}
          {nftGoUrl && (
            <ExternalLink
              alt="nftgo logo"
              className={`${nftGoUrl === "undefined" ? "hidden" : "block"}`}
              href={nftGoUrl}
              icon={"nftgo"}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
