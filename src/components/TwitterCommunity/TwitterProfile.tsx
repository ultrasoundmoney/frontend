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
  return (
    <>
      <div className="flex flex-wrap justify-center relative">
        {profileList &&
          profileList
            .slice(0, 60)
            .map((item: TwitterProfile, index: number) => (
              <div key={index} className="m-2 w-10 h-10">
                <a
                  target="_blank"
                  href={item.profileUrl}
                  rel="noopener noreferrer"
                  role="link"
                  title={item.name}
                >
                  <ProfileTooltip item={item} Data={Data}>
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
                      title={item.name}
                      alt={item.name}
                    />
                  </ProfileTooltip>
                </a>
              </div>
            ))}
      </div>
    </>
  );
};

export default TwitterProfile;
