import * as React from "react";
import AvatarImg from "../../assets/avatar.webp";
import ProfileTooltip from "./ProfileTooltip";

type TwitterProfilePros = {
  Data?: Data;
  profileList: TwitterProfile[];
};
const TwitterProfile: React.FC<TwitterProfilePros> = ({
  Data,
  profileList,
}) => {
  function imageErrorHandler(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    const el = e.target as HTMLImageElement;
    el.onerror = null;
    el.src = AvatarImg;
  }
  return (
    <>
      <div className="flex flex-wrap justify-center relative">
        {profileList &&
          profileList
            .slice(0, 60)
            .map((item: TwitterProfile, index: number) => (
              <div key={index} className="m-2 w-10 h-10">
                <ProfileTooltip item={item} Data={Data}>
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
              </div>
            ))}
      </div>
    </>
  );
};

export default TwitterProfile;
