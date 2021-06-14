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
        <div className="tooltip max-w-xs p-4 shadow-lg rounded-lg bg-blue-tangaroa text-white">
          <img
            className="rounded-full"
            width="60"
            height="60"
            src={
              item.profileImageUrl !== null && item.profileImageUrl != undefined
                ? item.profileImageUrl
                : AvatarImg
            }
            title={item.name}
            alt={item.name}
          />
          <h1 className="text-white my-3 font-normal text-sm">{item.name}</h1>
          <p className="text-xs text-blue-spindle text-left mb-3">{item.bio}</p>
          <p className="text-xs text-blue-spindle text-left font-light uppercase mb-0">
            {Data.profile_follower}
          </p>
          <p className="text-blue-spindle text-left font-light text-2xl">
            {followerCountConvert(item.followersCount)}
          </p>
        </div>
        {children}
      </div>
    </>
  );
};
export default ProfileTooltip;
