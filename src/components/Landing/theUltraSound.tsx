import * as React from "react";
import BatImg from ".././../assets/bat/Ethereum_UltraSoundBat.png";
import BatImg2x from ".././../assets/bat/Ethereum_UltraSoundBat@2x.png";
import BatImg3x from ".././../assets/bat/Ethereum_UltraSoundBat@3x.png";
const TheUltraSound: React.FC<{}> = () => {
  return (
    <>
      <div className="flex flex-wrap justify-center content-center enther-ultr-sound h-screen">
        <div className="flex flex-wrap justify-center mb-8">
          <div className="flex self-center mb-16">
            <img
              src={BatImg}
              srcSet={`${BatImg2x} 2x,
                    ${BatImg3x} 3x`}
            />
          </div>
          <div className="ultra-sound-text text-2xl md:text-6xl mb-24">
            Enter The Ultra Sound Money
          </div>
        </div>
      </div>
    </>
  );
};

export default TheUltraSound;
