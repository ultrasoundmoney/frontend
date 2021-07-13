import * as React from "react";
import { useTranslations } from "../../utils/use-translation";
import Twemoji from "../Twemoji";

const Intro: React.FC<{}> = () => {
  const { translations: t } = useTranslations();
  return (
    <>
      <section
        id="hero"
        className="flex flex-wrap justify-center content-center h-screen-90"
      >
        <div className="flex flex-wrap flex-col">
          <h1 className="text-white font-extralight text-center leading-none text-2xl md:text-6xl">
            {t.landing_hero_title}
          </h1>
          <div className="flex flex-wrap justify-center mb-8">
            <div className="ultra-sound-text text-2xl md:text-6xl">
              {t.landing_hero_title_1}
            </div>
            <div className="flex self-center">
              <Twemoji emoji="🦇🔊" />
              <span className="text-red-600 text-2xl">*</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Intro;
