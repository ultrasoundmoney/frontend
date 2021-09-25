import * as React from "react";
import twemoji from "twemoji";
import AvatarImg from "../../assets/avatar.webp";
import { followerCountConvert } from "../Helpers/helper";
import { TranslationsContext } from "../../translations-context";
import { string } from "fp-ts";

type BurnProfileTooltipProps = {
  children: React.ReactNode;
  item: {
    contractAddress?: string;
    name: string;
    profileImageUrl: string;
    twitterProfile?: TwitterProfile;
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
  return (
    <div className="has-tooltip opacity-100">
      <div className="tooltip tooltip--bottom-left shadow-lg rounded-lg bg-blue-tangaroa text-white px-7 py-7 z-10">
        <a
          target="_blank"
          href={item.contractAddress}
          rel="noopener noreferrer"
          role="link"
        >
          <picture>
            <img
              className="rounded-full"
              width="80"
              height="80"
              src={
                item.profileImageUrl !== null &&
                item.profileImageUrl != undefined
                  ? item.profileImageUrl
                  : AvatarImg
              }
              alt={item.name}
              onError={imageErrorHandler}
            />
          </picture>
        </a>
        <div
          className="text-white my-3 text-base font-medium tw-profile-text break-words"
          dangerouslySetInnerHTML={{
            __html: twemoji.parse(item.name),
          }}
        />
        <p
          className="text-blue-linkwater text-left mb-3 font-light text-xs break-words tw-profile-text"
          dangerouslySetInnerHTML={{
            __html: twemoji.parse(item.twitterProfile.bio),
          }}
        />
        <div className="flex justify-between">
          <div>
            <p className="text-xs text-blue-spindle text-left font-light uppercase mb-0">
              {t.profile_follower}
            </p>
            <p className="text-white text-left font-light text-2xl">
              {followerCountConvert(item.twitterProfile.followersCount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-blue-spindle text-left font-light uppercase mb-0">
              FAM FOLLOWERS
            </p>
            <p className="text-white text-left font-light text-2xl">
              {followerCountConvert(item.twitterProfile.famFollowerCount)}
            </p>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};
export default BurnProfileTooltip;
