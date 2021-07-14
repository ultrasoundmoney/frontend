import * as React from "react";
import useSWR from "swr";
import Clipboard from "react-clipboard.js";
import TwitterProfile from "./TwitterProfile";
import SpanMoji from "../SpanMoji";
import copySrc from "../../assets/copy.svg";
import { TranslationsContext } from "../../translations-context";

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
  const t = React.useContext(TranslationsContext);
  const [isCopiedFeedbackVisible, setIsCopiedFeedbackVisible] = React.useState<
    boolean
  >(false);
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

  const onBatSoundCopied = () => {
    setIsCopiedFeedbackVisible(true);
    setTimeout(() => setIsCopiedFeedbackVisible(false), 400);
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
      <p className="text-white text-center mb-8 md:text-lg">
        <span className="mr-2">wear the bat signal</span>
        <Clipboard data-clipboard-text={"🦇🔊"} onSuccess={onBatSoundCopied}>
          <span
            className={`border border-gray-700 rounded-full leading-10 p-2 pr-10 transition duration-500 ease-in-out ${
              isCopiedFeedbackVisible && "bg-gray-800"
            }`}
          >
            <SpanMoji emoji="🦇🔊" />
          </span>
          <span className="copy-container border-gray-700 py-2 -ml-9 mr-4 rounded-r-full">
            <img className="copy-icon" src={copySrc} />
          </span>
        </Clipboard>
      </p>
      <TwitterProfile profileList={data && data.profiles} />
    </>
  );
};

export default TwitterCommunity;
