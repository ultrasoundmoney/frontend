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
        <div className="flex flex-wrap justify-center w-full md:w-10/12 mx-auto">
          <div
            data-aos="fade-up"
            data-aos-anchor-placement="top-center"
            data-aos-delay="50"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
            className="w-full md:w-5/12 md:mr-auto self-center"
          >
            <ContentBlockMedia
              title={t.eusm_row_1_left_col_title}
              text={t.eusm_row_1_left_col_text}
            />
          </div>
          <div
            data-aos="fade-up"
            data-aos-anchor-placement="top-center"
            data-aos-delay="50"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
            className="w-full md:w-5/12 md:ml-auto"
          >
            <ContentBlockMedia
              img={UsdImg}
              title={t.eusm_row_1_right_col_title}
              text={t.eusm_row_1_right_col_text}
            />
          </div>
        </div>
        <div
          data-aos="fade-up"
          data-aos-anchor-placement="top-center"
          data-aos-delay="50"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
          className="block my-20 w-full md:w-5/12 md:mx-auto"
        >
          <ContentBlockMedia
            img={UsdImg}
            title={t.eusm_row_2_title}
            text={t.eusm_row_2_text}
          />
        </div>
        <div
          data-aos="fade-up"
          data-aos-anchor-placement="top-center"
          data-aos-delay="50"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
          className="block my-20 w-full md:w-5/12 md:mx-auto"
        >
          <ContentBlockMedia
            img={BtcImg}
            title={t.eusm_row_3_title}
            text={t.eusm_row_3_text}
          />
        </div>
        <div
          data-aos="fade-up"
          data-aos-anchor-placement="top-center"
          data-aos-delay="50"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
          className="block my-20 w-full md:w-5/12 md:mx-auto"
        >
          <ContentBlockMedia
            img={EthImg}
            title={t.eusm_row_4_title}
            text={t.eusm_row_4_text}
          />
        </div>
      </section>
    </>
  );
};

export default TheUltraSound;
