import * as React from "react";
import useSWR from "swr";
import twemoji from "twemoji";
import { useTranslations } from "../../utils/use-translation";
import TwitterProfile from "./TwitterProfile";

type TwitterCommunityPros = {};
const fetcher = (url: string) =>
  fetch(url, {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  }).then((r) => r.json());

const TwitterCommunity: React.FC<TwitterCommunityPros> = () => {
  const { translations: t } = useTranslations();
  const [isCopied, setIsCopied] = React.useState<boolean>(false);
  const [tool, setTool] = React.useState(false);
  const { data } = useSWR(
    "https://api.ultrasound.money/fam/2/profiles",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  if (!data) {
    return null;
  }
  const getFamCount = new Intl.NumberFormat().format(
    isNaN(data && data.count) ? 0 : data && data.count
  );
  const getText =
    getFamCount !== undefined
      ? t.title_community.replace("#XXX", getFamCount)
      : t.title_community;
  const handelClickedToCopyText = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText("🦇🔊")
        .then(() => {
          setIsCopied(true);
        })
        .catch(() => setIsCopied(false));
    } else {
      setIsCopied(false);
    }
  };
  const handleMouseEnter = () => {
    const parent = document.getElementById("bat-sound");
    parent.onmouseenter = () => {
      setTool(true);
    };
    parent.onmouseleave = () => {
      setTool(false);
    };
  };
  return (
    <>
      <h1 className="text-white text-2xl md:text-3xl text-center font-light mb-8">
        <a
          target="_blank"
          href="https://twitter.com/i/lists/1376636817089396750/members"
          rel="noopener noreferrer"
          role="link"
          title={t.title_community_hover}
          className="hover:underline hover:text-blue-spindle relative h-full"
        >
          {getText}
        </a>
      </h1>
      <div className={`clipboard ${tool ? "block" : "hidden"}`}>
        {isCopied ? "copied" : "click to copy"}
      </div>
      <p
        className={`text-white leading-6 md:leading-none text-center font-light text-base lg:text-lg mb-14 ${
          isCopied ? "span-bat-sound-copied" : "span-bat-sound"
        }`}
        dangerouslySetInnerHTML={{
          __html: twemoji.parse(t.description_community),
        }}
        onClick={handelClickedToCopyText}
        onMouseEnter={handleMouseEnter}
      />
      <TwitterProfile profileList={data && data.profiles} />
    </>
  );
};

export default TwitterCommunity;
