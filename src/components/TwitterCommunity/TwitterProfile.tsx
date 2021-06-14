import * as React from "react";
import AvatarImg from "../../assets/avatar.webp";
import useSWR from "swr";
import ProfileTooltip from "./ProfileTooltip";

type TwitterProfileProps = {
  name: string;
  profileImageUrl: string;
  profileUrl: string;
  bio: string;
  followersCount: number;
};
const fetcher = (url: string) =>
  fetch(url, {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  }).then((r) => r.json());
const TwitterProfile: React.FC<{ Data?: Data }> = ({ Data }) => {
  const { data } = useSWR("https://api.ultrasound.money/fam/profiles", fetcher);
  return (
    <>
      <div className="flex flex-wrap justify-center">
        {data &&
          data.slice(0, 60).map((item: TwitterProfileProps, index: number) => (
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
