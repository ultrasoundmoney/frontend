import poapLogo from "../../assets/poap-logo.svg";
import nftDropPoster from "../../assets/nft-drop.jpg";
import React from "react";
import { TranslationsContext } from "../../translations-context";
import SpanMoji from "../SpanMoji";

const NftDrop: React.FC = () => {
  const t = React.useContext(TranslationsContext);
  const refVideo = React.useRef(null);
  const [muted, setMuted] = React.useState(true);

  const handleOnToggleMute = React.useCallback(() => {
    if (!refVideo.current) {
      return;
    }

    const nextMuted = !muted;

    refVideo.current.muted = nextMuted;
    console.log("set ", nextMuted);
    setMuted(nextMuted);
  }, [muted, refVideo]);

  return (
    <div className="bg-blue-tangaroa md:px-8 md:py-8 rounded-xl md:px-16 md:py-16">
      <img className="w-16 absolute left-4 top-4 md:static" src={poapLogo} />
      <div className="flex flex-col md:absolute md:right-10 md:-top-8">
        <video
          className="w-full md:w-64 rounded-xl shadow-2xl"
          src="/nft-drop.mp4"
          playsInline
          autoPlay
          muted
          loop
          poster={nftDropPoster}
          ref={refVideo}
        >
          <source src="/public/nft-drop.mp4" type="video/mp4" />
          <source src="/public/nft-drop.webm" type="video/webm" />
          <source src="/public/nft-drop.ogv" type="video/ogg" />
        </video>
        <button
          className="bg-blue-tangaroa text-xl rounded-full text-white py-2 px-2 bottom-8 ml-2 mr-auto -mt-14 z-10 hover:opacity-90 opacity-70"
          onClick={handleOnToggleMute}
        >
          {muted ? <SpanMoji emoji="🔇" /> : <SpanMoji emoji="🔊" />}
        </button>
      </div>
      <div className="px-8 py-8">
        <h2 className="text-white text-2xl md:text-3xl font-light my-8">
          {t.title_nft_drop}
        </h2>
        <ul className="list-disc list-inside">
          <li className="text-white">
            <span className="font-bold">{t.description_nft_drop_1_left}</span>
            {t.description_nft_drop_1_right}
          </li>
          <li className="text-white">
            <span className="font-bold">{t.description_nft_drop_2_left}</span>
            {t.description_nft_drop_2_right}
          </li>
          <li className="text-white">
            <span className="font-bold">{t.description_nft_drop_3_left}</span>
            {t.description_nft_drop_3_right}
          </li>
          <li className="text-white">
            <span className="font-bold">{t.description_nft_drop_4_left}</span>
            {t.description_nft_drop_4_right}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NftDrop;
