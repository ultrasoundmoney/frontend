import * as React from "react";
import twemoji from "twemoji";
import AvatarImg from "../../assets/avatar.webp";
import { useTranslations } from "../../utils/use-translation";
import { followerCountConvert } from "../Helpers/helper";

type ProfileTooltipProps = {
  children: React.ReactNode;
  item: {
    name: string;
    profileImageUrl: string;
    profileUrl: string;
    bio: string;
    followersCount: number;
  };
};
const ProfileTooltip: React.FC<ProfileTooltipProps> = ({ children, item }) => {
  const { translations: t } = useTranslations();
  function imageErrorHandler(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    const el = e.target as HTMLImageElement;
    el.onerror = null;
    el.src = AvatarImg;
  }
  return (
    <>
      <div className="has-tooltip opacity-70 hover:opacity-100">
        <div className="tooltip shadow-lg rounded-lg bg-blue-tangaroa text-white px-7 py-7 z-10">
          <a
            target="_blank"
            href={item.profileUrl}
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
            className="text-white my-3 text-base font-medium tw-profile-text"
            dangerouslySetInnerHTML={{
              __html: twemoji.parse(item.name),
            }}
          />
          <p
            className="text-blue-linkwater text-left mb-3 font-light text-xs break-words tw-profile-text"
            dangerouslySetInnerHTML={{
              __html: twemoji.parse(item.bio),
            }}
          />
          <p className="text-xs text-blue-spindle text-left font-light uppercase mb-0">
            {t.profile_follower}
          </p>
          <p className="text-white text-left font-light text-2xl">
            {followerCountConvert(item.followersCount)}
          </p>
        </div>
        {children}
      </div>
    </>
  );
};
export default ProfileTooltip;
