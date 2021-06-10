import * as React from "react";
import AvatarImg from "../../assets/avatar.webp";
import useSWR from "swr";

type TwitterProfileProps = {
  name: string;
  profileImageUrl: string;
  profileUrl: string;
};
const fetcher = (url: string) =>
  fetch(url, {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  }).then((r) => r.json());
const TwitterProfile: React.FC<{}> = () => {
  const { data, error } = useSWR(
    "http://serve-fam-1761382800.us-east-2.elb.amazonaws.com/fam",
    fetcher
  );
  if (error) return <div>Data loading...</div>;
  if (!data) return <div>loading...</div>;
  return (
    <>
      <div className="flex flex-wrap">
        {data &&
          data.slice(0, 100).map((item: TwitterProfileProps, index: number) => (
            <div key={index} className="m-2 w-10 h-10">
              <a
                target="_blank"
                href={item.profileUrl}
                rel="noopener noreferrer"
                role="link"
                title={item.name}
              >
                <img
                  className="rounded-full w-full"
                  src={
                    item.profileImageUrl !== null &&
                    item.profileImageUrl != undefined
                      ? item.profileImageUrl
                      : AvatarImg
                  }
                  title={item.name}
                  alt={item.name}
                />
              </a>
            </div>
          ))}
      </div>
    </>
  );
};

export default TwitterProfile;
