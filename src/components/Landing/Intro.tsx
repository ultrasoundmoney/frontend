import * as React from "react";
import { TranslationsContext } from "../../translations-context";
import Twemoji from "../Twemoji";

const Intro: React.FC<{}> = () => {
  const t = React.useContext(TranslationsContext);
  return (
    <>
      <section id="hero" className="hero h-screen relative">
        <div className="flex flex-wrap flex-col md:pt-12">
          <h1 className="text-white font-extralight text-center leading-none text-2xl md:text-6xl font-inter">
            {t.landing_hero_title}
          </h1>
          <div className="flex flex-wrap justify-center mb-8">
            <div className="ultra-sound-text text-2xl md:text-6xl font-inter font-extralight">
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
