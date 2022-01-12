import { FC, ReactEventHandler, useCallback } from "react";
import Skeleton from "react-loading-skeleton";
import AvatarImg from "../../assets/avatar.webp";
import ProfileTooltip from "./ProfileTooltip";

const TwitterProfile: FC<{ profiles: TwitterProfile[] | undefined }> = ({
  profiles,
}) => {
  const currentProfiles =
    profiles === undefined
      ? (new Array(120).fill(undefined) as undefined[])
      : profiles;

  const imageErrorHandler = useCallback<ReactEventHandler<HTMLImageElement>>(
    (e) => {
      const el = e.currentTarget;
      el.onerror = null;
      el.src = AvatarImg;
    },
    []
  );

  return (
    <>
      <div className={`flex flex-wrap justify-center relative`}>
        {currentProfiles.map((item, index) => (
          <div key={index} className="m-2 w-10 h-10">
            {item === undefined ? (
              <Skeleton circle={true} height="40px" width="40" />
            ) : (
              <ProfileTooltip item={item}>
                {window.matchMedia("(min-width: 1024px)").matches ? (
                  <a
                    target="_blank"
                    href={item.profileUrl}
                    rel="noopener noreferrer"
                    role="link"
                  >
                    <picture>
                      <img
                        className="rounded-full"
                        width="40"
                        height="40"
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
                ) : (
                  <picture>
                    <img
                      className="rounded-full"
                      width="40"
                      height="40"
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
                )}
              </ProfileTooltip>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default TwitterProfile;
