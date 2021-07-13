import * as React from "react";
import BatImg from ".././../assets/UltrasoundBat/Ultrasound_Bat.png";
import BatImg2x from ".././../assets/UltrasoundBat/Ultrasound_Bat@2x.png";
import BatImg3x from ".././../assets/UltrasoundBat/Ultrasound_Bat@3x.png";
import ContentBlockMedia from "../ContentBlock/ContentBlockMedia";
import UsdImg from "../../assets/USD.png";
import EthImg from "../../assets/ETH.png";
import BtcImg from "../../assets/BTC.png";

const TheUltraSound: React.FC<{}> = () => {
  return (
    <>
      <div
        id="enter-ultra-sound"
        className="enther-ultr-sound py-8 px-4 md:px-8 lg:px-0"
      >
        <div className="block pt-16">
          <img
            title="Enter The Ultra Sound Money"
            src={BatImg}
            srcSet={`${BatImg2x} 2x, ${BatImg3x} 3x`}
            className="mx-auto text-center mb-8"
          />
          <div className="ultra-sound-text text-2xl md:text-6xl mb-24">
            Enter The Ultra Sound Money
          </div>
        </div>
        <div className="flex flex-wrap justify-center w-full md:w-10/12 mx-auto">
          <div className="w-full md:w-5/12 md:mr-auto self-center">
            <ContentBlockMedia
              title="WTF is an Ultra Sound Money and why should I even care"
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate "
            />
          </div>
          <div className="w-full md:w-5/12 md:ml-auto">
            <ContentBlockMedia
              img={UsdImg}
              title="ETH - Deflationary"
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            />
          </div>
        </div>
        <div className="block my-20 w-full md:w-5/12 md:mx-auto">
          <ContentBlockMedia
            img={UsdImg}
            title="ETH - Deflationary"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate "
          />
        </div>
        <div className="block my-20 w-full md:w-5/12 md:mx-auto">
          <ContentBlockMedia
            img={BtcImg}
            title="ETH - Deflationary"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate "
          />
        </div>
        <div className="block my-20 w-full md:w-5/12 md:mx-auto">
          <ContentBlockMedia
            img={EthImg}
            title="ETH - Deflationary"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate "
          />
        </div>
      </div>
    </>
  );
};

export default TheUltraSound;
