import Image from "next/image";
import * as React from "react";
import BatImg from "../../assets/bat.png";
import BtcImg from "../../assets/ulr.jpeg";
import { TranslationsContext } from "../../translations-context";
import ContentBlockMedia from "../ContentBlock/ContentBlockMedia";

const TheUltraSound: React.FC = () => {
  const t = React.useContext(TranslationsContext);

  return (
    <>
      <section
        id="enter-ultra-sound"
        className="enther-ultr-sound py-8 px-4 md:px-8 lg:px-0 relative"
      >
        <div
          data-aos="fade-up"
          data-aos-anchor-placement="top-bottom"
          data-aos-offset="100"
          data-aos-delay="50"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
          className="block pt-16 relative"
        >
          <Image
            title={t.eusm_section_title}
            alt={t.eusm_section_title}
            src={BatImg}
            className="mx-auto text-center mb-8"
          />
          <div className="ultra-sound-text text-2xl md:text-6xl mb-24">
            {t.eusm_section_title}
          </div>
        </div>
        <div className="w-full flex flex-wrap justify-center m-auto">
          <div className="w-full md:w-7/12 self-center">
            {/* <div className="container1 y-scroll y-proximity"> */}
            <div className="container1 y-scroll y-proximity overflow_scroll">
              <div className="wrapper">
                <div className="element">
                  <ContentBlockMedia
                    title={t.eusm_row_2_title}
                    text={t.eusm_row_2_title}
                  />
                </div>
                <div className="element">
                  <ContentBlockMedia
                    title={t.eusm_row_3_title}
                    text={t.eusm_row_3_text}
                  />
                </div>
                <div className="element">
                  <ContentBlockMedia
                    title={t.eusm_row_4_title}
                    text={t.eusm_row_4_text}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-5/12">
            <Image src={BtcImg} alt="btc" />
          </div>
        </div>
      </section>
    </>
  );
};

export default TheUltraSound;
