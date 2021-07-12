import poapLogo from "../../assets/poap-logo.svg";
import React from "react";

const NftDrop: React.FC = () => {
  const refVideo = React.useRef(null);

  React.useEffect(() => {
    if (!refVideo.current) {
      return;
    }

    //open bug since 2017 that you cannot set muted in video element https://github.com/facebook/react/issues/10389
    refVideo.current.defaultMuted = true;
    refVideo.current.muted = true;

    refVideo.current.srcObject = "/nft-drop.mp4";
  });

  return (
    <div className="flex px-4 md:px-0 pt-8 pt-32 pb-40">
      <div className="w-full md:w-5/6 lg:w-2/3 md:m-auto relative">
        <div className="flex flex-row bg-blue-tangaroa px-24 py-16 rounded-xl">
          <div className="flex flex-col">
            <img className="w-16" src={poapLogo} />
            <h2 className="text-white text-2xl md:text-3xl font-light my-8">
              nft drop
            </h2>
            <p className="text-blue-linkwater">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod tempor incididunt.
            </p>
          </div>
          <div className="w-full ml-12 -mr-12 -mt-28">
            <video
              className="w-64 rounded-xl shadow-2xl"
              src="/nft-drop.mp4"
              playsInline
              autoPlay
              muted
              loop
            ></video>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftDrop;
