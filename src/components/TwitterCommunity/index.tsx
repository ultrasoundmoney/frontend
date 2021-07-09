import * as React from "react";
import useSWR from "swr";
import twemoji from "twemoji";
import Clipboard from "react-clipboard.js";
import { useTranslations } from "../../utils/use-translation";
import TwitterProfile from "./TwitterProfile";
import { default as clipboardImage } from "../../assets/clipboard.png";

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
    setTimeout(() => setIsCopiedFeedbackVisible(false), 800);
  };

  return (
    <div className="flex flex-col align-center">
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
      {/* Getting these elements to line up was extremely fiddely, beware of changing any padding. Would be great to improve this with absolute asset sizes and padding sizes */}
      <div className="flex justify-center flex-col md:flex-row text-center mb-14">
        <p className="my-2 text-white leading-6 md:leading-none font-light text-base lg:text-lg">
          {t.description_community_1}
        </p>
        <Clipboard
          className="md:mx-4 flex justify-center"
          data-clipboard-text={"🦇🔊"}
          onSuccess={onBatSoundCopied}
        >
          <span
            className={`absolute px-5 pt-1 pb-2 rounded-full border border-gray-700 transition duration-500 ease-in-out ${
              isCopiedFeedbackVisible
                ? "bg-gray-700 text-white"
                : "bg-transparent text-transparent"
            }`}
          >
            copied!
          </span>
          <span
            className="border border-gray-700 pl-3 pt-1 pb-2 px-12 pr-9 rounded-full batsound-emoji"
            dangerouslySetInnerHTML={{ __html: twemoji.parse("🦇🔊") }}
          />
          <div className="border border-gray-700 -ml-8 pl-1 pt-2 pb-2 rounded-r-full">
            <img className="clipboard-image" src={clipboardImage} />
          </div>
        </Clipboard>
        <p className="my-2 text-white leading-6 md:leading-none font-light text-base lg:text-lg">
          {t.description_community_2}
        </p>
      </div>
      <TwitterProfile profileList={data && data.profiles} />
    </div>
  );
};

export default TwitterCommunity;
