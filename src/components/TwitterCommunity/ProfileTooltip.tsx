import * as React from "react";
import AvatarImg from "../../assets/avatar.webp";
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
  Data?: Data;
};
const ProfileTooltip: React.FC<ProfileTooltipProps> = ({
  children,
  item,
  Data,
}) => {
  return (
    <>
      <div className="has-tooltip">
        <div className="tooltip max-w-xs shadow-lg rounded-lg bg-blue-tangaroa text-white px-7 py-7">
          <img
            className="rounded-full"
            width="80"
            height="80"
            src={
              item.profileImageUrl !== null && item.profileImageUrl != undefined
                ? item.profileImageUrl
                : AvatarImg
            }
            title={item.name}
            alt={item.name}
          />
          <h1 className="text-white my-3 text-base font-medium">{item.name}</h1>
          <p className="text-blue-linkwater text-left mb-3 font-light text-xs">
            {item.bio}
          </p>
          <p className="text-xs text-blue-spindle text-left font-light uppercase mb-0">
            {Data.profile_follower}
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
