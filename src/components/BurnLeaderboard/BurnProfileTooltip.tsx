import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import twemoji from "twemoji";
import AvatarImg from "../../assets/avatar.webp";
import { followerCountConvert } from "../Helpers/helper";
import { TranslationsContext } from "../../translations-context";
import useWindowSize from "../../utils/use-window-size";
import { isContractAddress } from "../../utils/is-contract-address";

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
  className?: string;
};

const BurnProfileTooltip: React.FC<BurnProfileTooltipProps> = ({
  children,
  item,
  className,
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

  const { width: windowWidth, height: windowHeight } = useWindowSize();

  useLayoutEffect(() => {
    if (!isTooltipVisible) return;
    if (containerRef.current === null) return;
    if (tooltipRef.current === null) return;

    const {
      x: containerX,
      y: containerY,
      height: containerHeight,
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

    if (windowHeight < containerY + tooltipHeight) {
      setTooltipPosition({
        x: containerX - tooltipWidth - 8,
        y: containerY + containerHeight - tooltipHeight,
      });
      return;
    }

    setTooltipPosition({
      // extra 8 for a small padding of the tooltip container
      x: containerX - tooltipWidth - 8,
      y: containerY,
    });
  }, [isTooltipVisible, windowWidth, windowHeight]);

  // closes the tooltip on scroll
  useEffect(() => {
    if (isTooltipVisible) {
      const leaderboardList = document.querySelector("#leaderboard-list");
      const handleScroll = () => {
        if (containerRef.current === null) {
          return;
        }
        containerRef.current.blur();
        document.removeEventListener("scroll", handleScroll);
        leaderboardList?.removeEventListener("scroll", handleScroll);
      };
      document.addEventListener("scroll", handleScroll);
      leaderboardList?.addEventListener("scroll", handleScroll);

      return () => {
        document.removeEventListener("scroll", handleScroll);
        leaderboardList?.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isTooltipVisible]);

  const handleShowTooltip = () => {
    setIsTooltipVisible(true);
  };

  const handleHideTooltip = () => {
    // need timeout so that browser registers the click
    // on profile image which has a link to twitter
    setTimeout(() => {
      setIsTooltipVisible(false);
    }, 0);
  };

  const renderItemImage = () => (
    <picture>
      <img
        className="rounded-full"
        width="80"
        height="80"
        src={
          item.contractImageUrl !== null && item.contractImageUrl != undefined
            ? item.contractImageUrl
            : AvatarImg
        }
        alt={item.name}
        onError={imageErrorHandler}
      />
    </picture>
  );

  return (
    <button
      className={`opacity-100 ${className ? className : ""}`}
      ref={containerRef}
      onMouseEnter={handleShowTooltip}
      onMouseLeave={() => {
        if (document.activeElement === containerRef.current) {
          containerRef.current?.blur();
        } else {
          handleHideTooltip();
        }
      }}
      onFocus={handleShowTooltip}
      onBlur={handleHideTooltip}
    >
      {isTooltipVisible && (
        <div
          className="fixed pr-2 z-50"
          style={{ top: tooltipPosition.y, left: tooltipPosition.x }}
        >
          <div
            ref={tooltipRef}
            className="w-72 shadow-lg rounded-lg bg-blue-midnightexpress text-white px-7 py-7 z-10 fadein-animation cursor-default"
          >
            <div className="w-20 h-20">
              {item.twitterHandle ? (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  role="link"
                  href={
                    item.twitterHandle
                      ? `https://twitter.com/${item.twitterHandle}`
                      : "#"
                  }
                >
                  {renderItemImage()}
                </a>
              ) : (
                renderItemImage()
              )}
            </div>
            <div className="text-white my-3 text-base font-medium break-words flex items-center">
              <span className="tw-profile-text truncate">
                {isContractAddress(item.name) ? (
                  <span className="font-roboto">
                    {item.name.slice(0, 6)}
                    <span className="font-inter">...</span>
                    {item.name.slice(38, 42)}
                  </span>
                ) : (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: twemoji.parse(item.name),
                    }}
                  />
                )}
              </span>
            </div>
            {typeof item.description === "string" ? (
              <p
                className="text-blue-linkwater text-left mb-3 font-light text-xs break-words tw-profile-text"
                dangerouslySetInnerHTML={{
                  __html: twemoji.parse(item.description ?? ""),
                }}
              />
            ) : (
              <p className="text-blue-linkwater text-left mb-3 font-light text-xs break-words tw-profile-text">
                {item.description}
              </p>
            )}
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
        </div>
      )}
      {children}
    </button>
  );
};
export default BurnProfileTooltip;
