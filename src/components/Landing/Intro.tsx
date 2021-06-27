import * as React from "react";
import Twemoji from "../Twemoji";

const Intro: React.FC<{ Data?: Data }> = () => {
  return (
    <>
      <div className="flex flex-wrap justify-center content-center h-screen-90">
        <div className="flex flex-wrap flex-col">
          <h1 className="text-white font-extralight text-center leading-none text-2xl md:text-6xl">
            Ethereum is becoming an
          </h1>
          <div className="flex flex-wrap justify-center mb-8">
            <div className="ultra-sound-text text-2xl md:text-6xl">
              Ultra Sound Money
            </div>
            <div className="flex self-center">
              <Twemoji emoji="🦇🔊" />
              <span className="text-red-600 text-2xl">*</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Intro;
