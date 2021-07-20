import poapLogoGray from "../../assets/poap-logo-gray.svg";
import poapDropPoster from "../../assets/poap-drop.jpg";
import React from "react";
import { TranslationsContext } from "../../translations-context";
import SpanMoji from "../SpanMoji";
import bgMountains from "../../assets/bg-mountains.jpg";
import styles from "./PoapDrop.module.scss";
import { useMediaQuery } from "../../use-media-query";

const PoapDrop: React.FC = () => {
  const t = React.useContext(TranslationsContext);
  const refVideo = React.useRef(null);
  const [muted, setMuted] = React.useState(true);
  const isMd = useMediaQuery(768);

  const handleOnToggleMute = React.useCallback(() => {
    if (!refVideo.current) {
      return;
    }

    const nextMuted = !muted;

    refVideo.current.muted = nextMuted;
    setMuted(nextMuted);
  }, [muted, refVideo]);

  return (
    <>
      <h1 className="text-white font-light text-center text-2xl md:text-4xl xl:text-5xl mb-8">
        <SpanMoji emoji="🤝🏅🤝" />
      </h1>
      <p className="text-white leading-6 md:leading-none text-center font-light text-base lg:text-lg mb-16 md:mb-24">
        {t.poap_drop_subtitle}
      </p>
      <div
        style={{
          backgroundImage: isMd ? `url(${bgMountains})` : "none",
        }}
        className="rounded-xl relative bg-blue-tangaroa md:bg-cover md:border md:border-gray-500 md:px-8 md:py-12 lg:px-16 lg:py-20 xl:px-24 xl:py-24 2xl:text-xl 2xl:px-32"
      >
        <div className="flex items-center">
          <SpanMoji
            className={`absolute left-4 top-4 md:static md:inline ${styles["emoji-bat"]}`}
            emoji="🦇"
          />
          <SpanMoji
            className={`absolute left-8 top-4 md:static md:inline ${styles["emoji-speaker"]}`}
            emoji="🔊"
          />
          <img
            className="w-16 md:w-12 absolute left-4 top-4 md:static md:inline lg:w-16"
            src={poapLogoGray}
          />
        </div>
        <div className="flex flex-col md:absolute md:right-10 md:-top-8 lg:right-24 xl:right-20 xl:-top-16">
          <video
            className="w-full rounded-xl md:w-64 lg:w-72 xl:w-96"
            src="/poap-drop.mp4"
            playsInline
            autoPlay
            muted
            loop
            poster={poapDropPoster}
            ref={refVideo}
          >
            <source src="/public/poap-drop.mp4" type="video/mp4" />
            <source src="/public/poap-drop.webm" type="video/webm" />
            <source src="/public/poap-drop.ogv" type="video/ogg" />
          </video>
          <button
            className="bg-blue-tangaroa text-xl rounded-full text-white py-2 px-2 bottom-8 mr-4 ml-auto -mt-14 z-10 hover:opacity-90 opacity-70"
            onClick={handleOnToggleMute}
          >
            {muted ? <SpanMoji emoji="🔇" /> : <SpanMoji emoji="🔊" />}
          </button>
        </div>
        <div className="px-8 py-8 md:p-0">
          <h2 className="text-white text-2xl md:text-3xl font-light my-8">
            {t.title_poap_drop}
          </h2>
          <ul className="list-disc list-inside leading-8">
            <li className="text-white">
              <span className="font-bold">
                {t.description_poap_drop_1_left}
              </span>
              {t.description_poap_drop_1_right}
            </li>
            <li className="text-white">
              <span className="font-bold">
                {t.description_poap_drop_2_left}
              </span>
              {t.description_poap_drop_2_right}
            </li>
            <li className="text-white">
              <span className="font-bold">
                {t.description_poap_drop_3_left}
              </span>
              {t.description_poap_drop_3_right}
            </li>
            <li className="text-white">
              <span className="font-bold">
                {t.description_poap_drop_4_left}
              </span>
              {t.description_poap_drop_4_right}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default React.memo(PoapDrop);
