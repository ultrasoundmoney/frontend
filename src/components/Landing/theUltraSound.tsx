import * as React from "react";
import BatImg from ".././../assets/UltrasoundBat/Ultrasound_Bat.png";
import BatImg2x from ".././../assets/UltrasoundBat/Ultrasound_Bat@2x.png";
import BatImg3x from ".././../assets/UltrasoundBat/Ultrasound_Bat@3x.png";
import ContentBlockMedia from "../ContentBlock/ContentBlockMedia";
import UsdImg from "../../assets/USD.png";
import EthImg from "../../assets/ETH.png";
import BtcImg from "../../assets/BTC.png";
import { TranslationsContext } from "../../translations-context";

const TheUltraSound: React.FC<{}> = () => {
  const t = React.useContext(TranslationsContext);
  return (
    <>
      <section
        id="enter-ultra-sound"
        className="enther-ultr-sound py-8 px-4 md:px-8 lg:px-0"
      >
        <div
          data-aos="fade-up"
          data-aos-anchor-placement="top-bottom"
          data-aos-offset="100"
          data-aos-delay="50"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
          className="block pt-16"
        >
          <img
            title={t.eusm_section_title}
            alt={t.eusm_section_title}
            src={BatImg}
            srcSet={`${BatImg2x} 2x, ${BatImg3x} 3x`}
            className="mx-auto text-center mb-8"
          />
          <div className="ultra-sound-text text-2xl md:text-6xl mb-24">
            {t.eusm_section_title}
          </div>
        </div>
        <div
          id="cc"
          className="flex flex-wrap justify-center w-full md:w-10/12 mx-auto"
        >
          <div className="w-4/12">
            <div className="ultrasound__content">
              <h1
                className="text-white font-light text-base md:text-2xl leading-normal text-left mb-6 leading-title"
                dangerouslySetInnerHTML={{
                  __html: t.eusm_row_1_left_col_title,
                }}
              />
              <p
                className="text-blue-shipcove font-light text-sm text-left mb-10"
                dangerouslySetInnerHTML={{
                  __html: t.eusm_row_1_left_col_text,
                }}
              />
            </div>
          </div>
          <div className="w-6/12">
            <div className="ultrasound__img">
              <img
                title={t.eusm_section_title}
                alt={t.eusm_section_title}
                src={BatImg}
                srcSet={`${BatImg2x} 2x, ${BatImg3x} 3x`}
                className="mx-auto text-center mb-8"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TheUltraSound;
