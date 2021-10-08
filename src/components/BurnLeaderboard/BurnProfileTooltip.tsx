import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import twemoji from "twemoji";
import AvatarImg from "../../assets/avatar.webp";
import { followerCountConvert } from "../Helpers/helper";
import { TranslationsContext } from "../../translations-context";
import useWindowSize from "../../utils/use-window-size";

import twitterIcon from "../../assets/twitter-icon.svg";
import ethereumIcon from "../../assets/ethereum-icon.svg";

type BurnProfileTooltipProps = {
  children: React.ReactNode;
  item: {
    contractAddress?: string;
    name: string;
    contractImageUrl: string;
    description: string;
    twitterHandle: string | undefined;
    twitterFamFollowerCount?: number;
    twitterFollowersCount?: number;
  };
};

const BurnProfileTooltip: React.FC<BurnProfileTooltipProps> = ({
  children,
  item,
}) => {
  const t = React.useContext(TranslationsContext);
  function imageErrorHandler(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    const el = e.target as HTMLImageElement;
    el.onerror = null;
    el.src = AvatarImg;
  }

  const containerRef = useRef<HTMLButtonElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const { width: windowWidth } = useWindowSize();

  useLayoutEffect(() => {
    if (!isTooltipVisible) return;
    if (containerRef.current === null) return;
    if (tooltipRef.current === null) return;

    const {
      x: containerX,
      y: containerY,
    } = containerRef.current.getBoundingClientRect();
    const {
      width: tooltipWidth,
      height: tooltipHeight,
    } = tooltipRef.current.getBoundingClientRect();

    // on smaller screens shifting the tooltip on top
    if (windowWidth < 1024) {
      setTooltipPosition({
        x: containerX,
        y: containerY - tooltipHeight,
      });
      return;
    }

    setTooltipPosition({
      x: containerX - tooltipWidth,
      y: containerY,
    });
  }, [isTooltipVisible, windowWidth]);

  // closes the tooltip on scroll
  useEffect(() => {
    if (isTooltipVisible) {
      const handleScroll = () => {
        containerRef.current.blur();
        document.removeEventListener("scroll", handleScroll);
      };
      document.addEventListener("scroll", handleScroll);

      return () => {
        document.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isTooltipVisible, windowWidth]);

  const handleShowTooltip = () => {
    setIsTooltipVisible(true);
  };

  const handleHideTooltip = () => {
    setIsTooltipVisible(false);
  };

  return (
    <button
      className="opacity-100"
      ref={containerRef}
      onMouseEnter={handleShowTooltip}
      onMouseLeave={handleHideTooltip}
      onFocus={handleShowTooltip}
      onBlur={handleHideTooltip}
    >
      {isTooltipVisible && (
        <div
          ref={tooltipRef}
          className="fixed w-72 shadow-lg rounded-lg bg-blue-midnightexpress text-white px-7 py-7 z-10 fadein-animation"
          style={{ top: tooltipPosition.y, left: tooltipPosition.x }}
        >
          <div>
            <picture>
              <img
                className="rounded-full"
                width="80"
                height="80"
                src={
                  item.contractImageUrl !== null &&
                  item.contractImageUrl != undefined
                    ? item.contractImageUrl
                    : AvatarImg
                }
                alt={item.name}
                onError={imageErrorHandler}
              />
            </picture>
          </div>
          <div className="text-white my-3 text-base font-medium break-words flex items-center">
            <span className="tw-profile-text truncate">
              {item.name.startsWith("0x") && item.name.length === 42
                ? item.name.slice(0, 6) + "..." + item.name.slice(38, 42)
                : item.name}
            </span>
            {item.contractAddress && (
              <a
                target="_blank"
                rel="noreferrer"
                className="ml-2 w-5"
                href={item.contractAddress}
              >
                <img src={ethereumIcon} alt="ethereum-contract" />
              </a>
            )}
            {item.twitterHandle && (
              <a
                target="_blank"
                rel="noopener noreferrer"
                role="link"
                className="ml-2 w-5"
                href={`https://twitter.com/${item.twitterHandle}`}
              >
                <img src={twitterIcon} alt="twitter-profile" />
              </a>
            )}
          </div>
          <p
            className="text-blue-linkwater text-left mb-3 font-light text-xs break-words tw-profile-text"
            dangerouslySetInnerHTML={{
              __html: twemoji.parse(item.description ?? ""),
            }}
          />
          {item.twitterFollowersCount && item.twitterFamFollowerCount && (
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-blue-spindle text-left font-light uppercase mb-0">
                  {t.profile_follower}
                </p>
                <p className="text-white text-left font-light text-2xl">
                  {followerCountConvert(item.twitterFollowersCount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-spindle text-left font-light uppercase mb-0">
                  FAM FOLLOWERS
                </p>
                <p className="text-white text-left font-light text-2xl">
                  {followerCountConvert(item.twitterFamFollowerCount)}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      {children}
    </button>
  );
};
export default BurnProfileTooltip;
