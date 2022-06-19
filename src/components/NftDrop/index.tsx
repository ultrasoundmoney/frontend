import nftDropPoster from "../../assets/nft-drop.jpg";
import GlowBackground from "../../assets/Glow.svg";
import React from "react";
import poapLogo from "../../assets/poap-logo.svg";
import { TranslationsContext } from "../../translations-context";

const NftDrop: React.FC = () => {
  const t = React.useContext(TranslationsContext);

  return (
    <div
      id="nft-drop"
      className="relative w-full md:w-auto md:flex px-4 md:px-0 pt-32 pb-40"
    >
      <div className="absolute -top-32 left-0">
        <img src={GlowBackground.src} alt="glow" />
      </div>
      <div className="w-full md:w-5/6 lg:w-2/3 md:m-auto relative">
        <div className="flex flex-col md:flex-row bg-blue-tangaroa px-4 py-8 md:px-24 md:py-16 rounded-xl">
          <div className="flex flex-col order-2 md:order-1">
            <img className="w-16" src={poapLogo.src as unknown as string} />
            <h2 className="text-white text-2xl md:text-3xl font-light my-8">
              {t.title_nft_drop}
            </h2>
            <p className="text-blue-linkwater">{t.description_nft_drop}</p>
          </div>
          <div className="w-full order-1 mb-8 md:order-2 md:ml-12 md:-mr-12 md:-mt-28">
            <video
              className="w-full md:w-64 rounded-xl shadow-2xl"
              src="/nft-drop.mp4"
              playsInline
              autoPlay
              muted
              loop
              poster={nftDropPoster as unknown as string}
            >
              <source src="/nft-drop.mp4" type="video/mp4" />
              <source src="/nft-drop.webm" type="video/webm" />
              <source src="/nft-drop.ogv" type="video/ogg" />
            </video>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftDrop;
