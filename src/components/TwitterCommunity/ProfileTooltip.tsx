import { FC, ReactEventHandler, useCallback, useContext } from "react";
import twemoji from "twemoji";
import AvatarImg from "../../assets/avatar.webp";
import * as Format from "../../format";
import { TranslationsContext } from "../../translations-context";
import styles from "./ProfileTooltip.module.scss";

export type TwitterProfile = {
  name: string;
  profileImageUrl: string;
  profileUrl: string;
  bio: string | null;
  followersCount: number;
  famFollowerCount: number;
};

type ProfileTooltipProps = {
  item: TwitterProfile;
};

const ProfileTooltip: FC<ProfileTooltipProps> = ({ children, item }) => {
  const t = useContext(TranslationsContext);

  const imageErrorHandler = useCallback<ReactEventHandler<HTMLImageElement>>(
    (e) => {
      const el = e.currentTarget;
      el.onerror = null;
      el.src = AvatarImg as unknown as string;
    },
    [],
  );

  return (
    <div className={`${styles["has-tooltip"]} opacity-70 hover:opacity-100`}>
      <div
        className={`${styles["tooltip"]} shadow-lg rounded-lg bg-blue-tangaroa text-white px-7 py-7 z-10`}
      >
        <a
          target="_blank"
          href={item.profileUrl}
          rel="noopener noreferrer"
          role="link"
        >
          <picture>
            {/* using Image here break the images */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="rounded-full"
              width="80"
              height="80"
              src={
                item.profileImageUrl !== null &&
                item.profileImageUrl != undefined
                  ? item.profileImageUrl
                  : (AvatarImg as unknown as string)
              }
              alt={item.name}
              onError={imageErrorHandler}
            />
          </picture>
        </a>
        <div
          className={`text-white my-3 text-base font-medium ${styles.profileText} break-words`}
          dangerouslySetInnerHTML={{
            __html: twemoji.parse(item.name),
          }}
        />
        {typeof item.bio === "string" && (
          <p
            className={`text-blue-linkwater text-left mb-3 font-light text-xs break-words ${styles.profileText}`}
            dangerouslySetInnerHTML={{
              __html: twemoji.parse(item.bio),
            }}
          />
        )}
        <div className="flex justify-between">
          <div>
            <p className="text-xs text-blue-spindle text-left font-light uppercase mb-0">
              {t.profile_follower}
            </p>
            <p className="text-white text-left font-light text-2xl">
              {Format.followerCountConvert(item.followersCount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-blue-spindle text-left font-light uppercase mb-0">
              FAM FOLLOWERS
            </p>
            <p className="text-white text-left font-light text-2xl">
              {Format.followerCountConvert(item.famFollowerCount)}
            </p>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};
export default ProfileTooltip;
