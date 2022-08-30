import * as React from "react";
import TranslationsContext from "../../contexts/TranslationsContext";
import SpanMoji from "../SpanMoji";
import styles from "./Landing.module.scss";

const Intro: React.FC = () => {
  const t = React.useContext(TranslationsContext);

  return (
    <section id="hero" className={`${styles.hero} container m-auto`}>
      <video
        className={`${styles.hero_bg} mix-blend-lighten`}
        playsInline
        autoPlay
        muted
        loop
      >
        <source src="/hero_compressed.mp4" type="video/mp4" />
      </video>
      <div className=" flex flex-wrap flex-col pt-32 relative">
        <h1 className="text-white font-extralight mx-4 text-center leading-loose text-4xl md:text-6xl font-inter">
          {t.landing_hero_title}
        </h1>
        <div className="mx-4 flex flex-wrap justify-center mb-8 gap-4">
          <div
            className={`${styles.ultraSoundText} text-4xl md:text-6xl font-inter font-extralight leading-loose`}
          >
            {t.landing_hero_title_1}
          </div>
          <div className="flex self-center">
            <SpanMoji emoji="🦇" className="mr-1" />
            <SpanMoji emoji="🔊" />
            <span className="text-red-600 text-2xl">*</span>
          </div>
        </div>
        <video
          className="w-full md:w-3/6 lg:w-2/6 mx-auto mix-blend-lighten md:-mt-6 lg:-mt-28 xl:-mt-24 2xl:-mt-20 relative right-4"
          playsInline
          autoPlay
          muted
          loop
          poster="/bat-no-wings.png"
        >
          <source src="/bat-no-wings.webm" type="video/webm; codecs='vp9'" />
          <source src="/bat-no-wings.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
};

export default Intro;
