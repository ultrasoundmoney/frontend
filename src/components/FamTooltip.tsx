import type { FC } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { XMarkIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import type { Linkables } from "../api/profiles";
import * as Format from "../format";
import scrollbarStyles from "../styles/Scrollbar.module.scss";
import { BaseText } from "./Texts";
import BodyText from "./TextsNext/BodyText";
import Twemoji from "./Twemoji";
import BioWithLinks from "./Twitter/BioWithLinks";
import { WidgetTitle } from "./WidgetSubcomponents";
import properties from '../../public/sprite/properties.json'
import styles from "./ImageWithOnClickTooltip.module.scss";

const sizeFactor = 1.2; // (from 96px to 80px)

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
    <div
      className={`relative cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={(e) => {
        e.stopPropagation();
        window.open(href, "_blank");
      }}
    >
      <img src={`/round-${icon}-coloroff.svg`} alt={alt} className={`w-12`} />
      <img
        className={`absolute top-0 w-12 ${isHovering ? "" : "hidden"}`}
        src={`/round-${icon}-coloron.svg`}
        alt={alt}
      />
    </div>
  );
};

export type TooltipProps = {
  coingeckoUrl?: string;
  contractAddresses?: string[];
  description: string | undefined;
  famFollowerCount: number | undefined;
  followerCount: number | undefined;
  imageUrl: string | undefined;
  links?: Linkables;
  nftGoUrl?: string;
  onClickClose?: () => void;
  title: string | undefined;
  twitterUrl?: string;
  width?: string;
  getXAndY?: (imageKey: string | undefined, sizeFactor: number) => { x: number | null, y: number | null };
};

const Tooltip: FC<TooltipProps> = ({
  coingeckoUrl,
  contractAddresses,
  description,
  famFollowerCount,
  followerCount,
  imageUrl,
  links,
  nftGoUrl,
  onClickClose,
  title,
  twitterUrl,
  width = "22rem",
  getXAndY,
}) => {
  const [posX, setPosX] = useState<number | null>(null);
  const [posY, setPosY] = useState<number | null>(null);

  useEffect(() => {
    if (imageUrl !== undefined && getXAndY) {
      const { x, y } = getXAndY(imageUrl, sizeFactor);
      setPosX(x);
      setPosY(y);
    }
  }, [getXAndY, imageUrl]);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={`
        relative
        flex flex-col
        gap-y-4 rounded-lg border
        border-slateus-400 bg-slateus-700
        p-8
        ${width}
      `}
    >
      <XMarkIcon
        className="absolute right-5 top-5 w-6 cursor-pointer select-none hover:brightness-90 active:brightness-110"
        onClick={onClickClose}
      />
      {getXAndY
        ? (
          <div
            className={`${styles["fam-image-sprite"]} mx-auto h-20 w-20 select-none rounded-full`}
            style={{
              backgroundPositionX: `${posX}px`,
              backgroundPositionY: `${posY}px`,
              backgroundSize: `${properties?.width / sizeFactor}px ${properties?.height / sizeFactor}px`,
            }}
          />
        )
        : (
          <Image
            src={imageUrl ?? "/leaderboard-images/question-mark-v2.svg"}
            alt="Fam image"
            width={96}
            height={96}
            className="mx-auto h-20 w-20 select-none rounded-full"
          />
        )
      }
      <BodyText className="font-semibold">
        <Twemoji imageClassName="inline-block align-middle h-5 ml-1" wrapper>
          {title}
        </Twemoji>
      </BodyText>
      <div
        className={`max-h-64 overflow-y-auto ${scrollbarStyles["styled-scrollbar-horizontal"]} ${scrollbarStyles["styled-scrollbar-vertical"]} ${scrollbarStyles["styled-scrollbar"]}`}
      >
        <BodyText className="whitespace-pre-wrap md:leading-normal">
          {description === undefined ? null : (
            <BioWithLinks
              bio={description}
              linkables={
                links ?? { cashtags: [], hashtags: [], mentions: [], urls: [] }
              }
            ></BioWithLinks>
          )}
        </BodyText>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-y-4">
          <WidgetTitle>followers</WidgetTitle>
          <BaseText font="font-roboto" className="text-2xl font-extralight">
            {followerCount === undefined
              ? "-"
              : Format.formatCompactOneDecimal(followerCount)}
          </BaseText>
        </div>
        <div className="flex flex-col items-end gap-y-4">
          <WidgetTitle>fam followers</WidgetTitle>
          <BaseText
            font="font-roboto"
            weight="font-extralight"
            className="text-2xl"
          >
            {famFollowerCount === undefined
              ? "-"
              : Format.formatZeroDecimals(famFollowerCount)}
          </BaseText>
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
        <div className="flex select-none gap-x-4"
              onClick={(e) => {
                e.stopPropagation();
              }}
        >
          <ExternalLink
            alt="twitter logo"
            className={`${twitterUrl === undefined ? "hidden" : "block"}`}
            href={twitterUrl}
            icon={"twitter"}
          />
          <ExternalLink
            alt="coingecko logo"
            className={`${coingeckoUrl === undefined ? "hidden" : "block"}`}
            href={coingeckoUrl}
            icon={"coingecko"}
          />
          <ExternalLink
            alt="nftgo logo"
            className={`${nftGoUrl === undefined ? "hidden" : "block"}`}
            href={nftGoUrl}
            icon={"nftgo"}
          />
          {contractAddresses !== undefined &&
            contractAddresses
              // More than three and we might have trouble fitting everything.
              .slice(0, 3)
              .map((contractAddress) => (
                <ExternalLink
                  key={contractAddress}
                  alt="etherscan logo"
                  href={`https://etherscan.com/address/${contractAddress}`}
                  icon={"etherscan"}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
