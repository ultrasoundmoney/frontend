import nftDropPoster from "../../assets/nft-drop.jpg";
import React from "react";
import TranslationsContext from "../../contexts/TranslationsContext";

const NftDrop: React.FC = () => {
  const t = React.useContext(TranslationsContext);

  return (
    <div
      id="nft-drop"
      className="relative w-full px-4 pt-32 pb-40 md:flex md:w-auto md:px-0"
    >
      <div className="absolute -top-32 left-0">
        <img src={`/glow.svg`} alt="glow" />
      </div>
      <div className="relative w-full md:m-auto md:w-5/6 lg:w-2/3">
        <div className="flex flex-col rounded-xl bg-slateus-700 px-4 py-8 md:flex-row md:px-24 md:py-16">
          <div className="order-2 flex flex-col md:order-1">
            <img
              alt="logo of a poap token"
              className="w-16"
              src={`/poap-logo.svg`}
            />
            <h2 className="my-8 text-2xl font-light text-white md:text-3xl">
              {t.title_nft_drop}
            </h2>
            <p className="text-slateus-100">{t.description_nft_drop}</p>
          </div>
          <div className="order-1 mb-8 w-full md:order-2 md:ml-12 md:-mr-12 md:-mt-28">
            <video
              className="w-full rounded-xl shadow-2xl md:w-64"
              src="/nft-drop.mp4"
              playsInline
              autoPlay
              muted
              loop
              poster={nftDropPoster.src as unknown as string}
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
