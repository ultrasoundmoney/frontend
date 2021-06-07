import * as React from "react";
import AvatarImg from "../../assets/avatar.webp";
import useSWR from "swr";

type TwitterProfileProps = {
  name: string;
  profile_image_url: string;
  username: string;
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
    "https://mnaus.api.stdlib.com/ultrasound-money@0.0.1/",
    fetcher,
    {
      revalidateOnFocus: true,
    }
  );
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return (
    <>
      <div className="flex flex-wrap">
        {data &&
          data.slice(0, 100).map((item: TwitterProfileProps, index: number) => (
            <div key={index} className="m-2 w-10 h-10">
              <a
                target="_blank"
                href="https://twitter.com/"
                // href={item.url}
                rel="noopener noreferrer"
                role="link"
                title={item.name}
              >
                <img
                  className="rounded-full w-full"
                  src={
                    item.profile_image_url !== undefined
                      ? item.profile_image_url
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
