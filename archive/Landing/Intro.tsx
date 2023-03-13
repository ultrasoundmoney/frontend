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
      <div className=" relative flex flex-col flex-wrap pt-32">
        <h1 className="mx-4 text-center font-inter text-4xl font-extralight leading-loose text-white md:text-6xl">
          {t.landing_hero_title}
        </h1>
        <div className="mx-4 mb-8 flex flex-wrap justify-center gap-4">
          <div
            className={`${styles.ultraSoundText} font-inter text-4xl font-extralight leading-loose md:text-6xl`}
          >
            {t.landing_hero_title_1}
          </div>
          <div className="flex self-center">
            <SpanMoji emoji="🦇" className="mr-1" />
            <SpanMoji emoji="🔊" />
            <span className="text-2xl text-red-600">*</span>
          </div>
        </div>
        <video
          className="relative right-4 mx-auto w-full mix-blend-lighten md:-mt-6 md:w-3/6 lg:-mt-28 lg:w-2/6 xl:-mt-24 2xl:-mt-20"
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
