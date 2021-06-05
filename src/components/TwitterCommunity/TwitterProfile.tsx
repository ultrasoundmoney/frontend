import * as React from "react";
import AvatarImg from "../../assets/avatar.webp";
import useSWR from "swr";

type TwitterProfileProps = {
  thumbnailUrl: string;
  url: string;
  title: string;
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
    "https://jsonplaceholder.typicode.com/photos",
    fetcher
  );
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return (
    <>
      <div className="flex flex-wrap">
        {data &&
          data.slice(0, 50).map((item: TwitterProfileProps, index: number) => (
            <div key={index} className="m-2 w-10 h-10">
              <a
                target="_blank"
                // href="https://twitter.com/"
                href={item.url}
                rel="noopener noreferrer"
                role="link"
                title={item.title}
              >
                <img
                  className="rounded-full w-full"
                  src={
                    item.thumbnailUrl !== undefined
                      ? item.thumbnailUrl
                      : AvatarImg
                  }
                  title={item.title}
                  alt={item.title}
                />
              </a>
            </div>
          ))}
      </div>
    </>
  );
};

export default TwitterProfile;
