import * as React from "react";
import Twemoji from "../Twemoji";
import Timeline from "./timeline";

const Intro: React.FC<{}> = () => {
  return (
    <>
      <div className="flex flex-wrap justify-center content-center h-screen-90">
        <div className="flex flex-wrap flex-col">
          <h1 className="text-white font-extralight text-center leading-none text-6xl">
            Ethereum is becoming an
          </h1>
          <div className="flex flex-wrap justify-center mb-8">
            <div className="ultra-sound-text">Ultra Sound Money</div>
            <div className="flex self-center">
              <Twemoji emoji="🦇🔊" />
              <span className="text-red-600 text-2xl">*</span>
            </div>
          </div>
        </div>
        <Timeline />
      </div>
    </>
  );
};

export default Intro;
