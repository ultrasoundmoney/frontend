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
            className={`${styles.blockFeeBurn} flex flex-col justify-center w-full lg:w-6/12 md:m-auto px-4 md:px-8 lg:px-0 pt-16`}
          >
            <h3 className="text-white font-light text-base md:text-3xl leading-normal text-center mb-6">
              {t.landing_themerge_title}
            </h3>
            <p className="text-blue-shipcove font-light text-sm text-center mb-10">
              {t.landing_themerge_text}
            </p>
          </div>
        </section>
        <div
          id="the-merge"
          className={`${styles.theMergePath} flex flex-col w-full sm:w-9/12 mx-auto max-w-4xl`}
        >
          <div
            data-aos="fade-up"
            data-aos-anchor-placement="top-center"
            data-aos-delay="50"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
            className={`w-6/12 md:w-4/12 md:absolute md:mr-auto py-16 ${styles.mergeIconBlock}`}
          >
            <div
              className={`${styles.firstTextBlock} flex-none md:flex-1 text-center md:text-left px-3`}
            >
              <div className="flex">
                <Twemoji imageClassName="h-6 lg:h-8 select-none mr-2" wrapper>
                  🏭
                </Twemoji>
                <Twemoji imageClassName="h-6 lg:h-8 select-none" wrapper>
                  ⚡
                </Twemoji>
              </div>
              <h3 className="text-white font-light text-base text-center mb-4 mt-4">
                {t.landing_themerge_pow_title}
              </h3>
              <p className="text-blue-shipcove font-light text-center text-sm break-words mt-4 whitespace-pre-line leading-relaxed">
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
            className={`w-6/12 md:w-4/12 md:absolute md:ml-auto ${styles.mergeIconBlock}`}
          >
            <div
              className={`${styles.secondTextBlock} flex-none md:flex-1 text-center md:text-left px-3`}
            >
              <div className="flex">
                <Twemoji imageClassName="h-6 lg:h-8 select-none" wrapper>
                  🌿
                </Twemoji>
              </div>
              <h3 className="text-white font-light text-base text-center mb-4 mt-4">
                {t.landing_themerge_pos_title}
              </h3>
              <p className="text-blue-shipcove font-light text-center text-sm break-words mt-4 whitespace-pre-line leading-relaxed">
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
          <div className="flex flex-col justify-center w-full lg:w-6/12 md:m-auto px-4 md:px-8 lg:px-0 pt-10">
            <h3 className="text-white font-light text-base md:text-3xl leading-normal text-center mb-6">
              {t.landing_themerge_title2}
            </h3>
            <p className="text-blue-shipcove font-light text-sm text-center mb-10">
              {t.landing_themerge_text2}
            </p>
          </div>
        </section>
        <div
          id="the-merge-line"
          className="flex flex-wrap justify-center w-full md:w-7/12 md:mx-auto mb-20"
        />
      </section>
    </>
  );
};

export default TheMergeBlock;
