import * as React from "react";
import TranslationsContext from "../../contexts/TranslationsContext";
import { StepperContext } from "../../contexts/StepperContext";
import AnimatedPath from "./AnimatedPath";
import DrawingLine from "./DrawingLine";
import styles from "./Landing.module.scss";
import Twemoji from "../Twemoji";
import { NavigationContext } from "../../contexts/NavigationContext";
import { calcCenterElement } from "../../utils/calcCenterElement";

const TheMergeBlock: React.FC = () => {
  const t = React.useContext(TranslationsContext);
  const stepperContext = React.useContext(StepperContext);
  const MergeRef = React.useRef<HTMLDivElement | null>(null);

  const { changeHidingNavigationPosition } =
    React.useContext(NavigationContext);

  React.useEffect(() => {
    if (stepperContext && MergeRef.current) {
      stepperContext.addStepperELement(MergeRef, "Merge");
    }
  }, []);

  const bottomTextMergeSection = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const resizeFun = () => {
      if (bottomTextMergeSection.current) {
        const centerBlock: number = calcCenterElement(
          bottomTextMergeSection.current,
        );
        changeHidingNavigationPosition(centerBlock);
      }
    };

    resizeFun();
    window.addEventListener("resize", resizeFun);

    return () => window.removeEventListener("resize", resizeFun);
  }, [bottomTextMergeSection.current]);

  return (
    <>
      <DrawingLine pointRef={MergeRef} indexTopSection={4} />
      <section id="next-merge" ref={MergeRef}>
        <section
          data-aos="fade-up"
          data-aos-anchor-placement="top-bottom"
          data-aos-offset="100"
          data-aos-delay="50"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
          id="what-next"
        >
          <div
            className={`${styles.blockFeeBurn} flex w-full flex-col justify-center px-4 pt-16 md:m-auto md:px-8 lg:w-6/12 lg:px-0`}
          >
            <h3 className="mb-6 text-center text-base font-light leading-normal text-white md:text-3xl">
              {t.landing_themerge_title}
            </h3>
            <p className="mb-10 text-center text-sm font-light text-slateus-400">
              {t.landing_themerge_text}
            </p>
          </div>
        </section>
        <div
          id="the-merge"
          className={`${styles.theMergePath} mx-auto flex w-full max-w-4xl flex-col sm:w-9/12`}
        >
          <div
            data-aos="fade-up"
            data-aos-anchor-placement="top-center"
            data-aos-delay="50"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
            className={`w-6/12 py-16 md:absolute md:mr-auto md:w-4/12 ${styles.mergeIconBlock}`}
          >
            <div
              className={`${styles.firstTextBlock} flex-none px-3 text-center md:flex-1 md:text-left`}
            >
              <div className="flex">
                <Twemoji imageClassName="h-6 lg:h-8 select-none mr-2" wrapper>
                  🏭
                </Twemoji>
                <Twemoji imageClassName="h-6 lg:h-8 select-none" wrapper>
                  ⚡
                </Twemoji>
              </div>
              <h3 className="mb-4 mt-4 text-center text-base font-light text-white">
                {t.landing_themerge_pow_title}
              </h3>
              <p className="mt-4 whitespace-pre-line break-words text-center text-sm font-light leading-relaxed text-slateus-400">
                {t.landing_themerge_pow_text}
              </p>
            </div>
          </div>
          <div
            data-aos="fade-up"
            data-aos-anchor-placement="top-center"
            data-aos-delay="50"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
            className={`w-6/12 md:absolute md:ml-auto md:w-4/12 ${styles.mergeIconBlock}`}
          >
            <div
              className={`${styles.secondTextBlock} flex-none px-3 text-center md:flex-1 md:text-left`}
            >
              <div className="flex">
                <Twemoji imageClassName="h-6 lg:h-8 select-none" wrapper>
                  🌿
                </Twemoji>
              </div>
              <h3 className="mb-4 mt-4 text-center text-base font-light text-white">
                {t.landing_themerge_pos_title}
              </h3>
              <p className="mt-4 whitespace-pre-line break-words text-center text-sm font-light leading-relaxed text-slateus-400">
                {t.landing_themerge_pos_text}
              </p>
            </div>
          </div>
          <AnimatedPath />
        </div>
        <section
          ref={bottomTextMergeSection}
          data-aos="fade-up"
          data-aos-anchor-placement="top-bottom"
          data-aos-offset="100"
          data-aos-delay="50"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
          id="the-merge-bottom-text"
        >
          <div className="flex w-full flex-col justify-center px-4 pt-10 md:m-auto md:px-8 lg:w-6/12 lg:px-0">
            <h3 className="mb-6 text-center text-base font-light leading-normal text-white md:text-3xl">
              {t.landing_themerge_title2}
            </h3>
            <p className="mb-10 text-center text-sm font-light text-slateus-400">
              {t.landing_themerge_text2}
            </p>
          </div>
        </section>
        <div
          id="the-merge-line"
          className="mb-20 flex w-full flex-wrap justify-center md:mx-auto md:w-7/12"
        />
      </section>
    </>
  );
};

export default TheMergeBlock;
