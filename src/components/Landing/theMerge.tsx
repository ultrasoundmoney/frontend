import * as React from "react";
import ContentBlock from "../ContentBlock/ContentBlcok";
import IconBlock from "../ContentBlock/IconBlock";
import { TranslationsContext } from "../../translations-context";
import { StepperContext } from "../../context/StepperContext";
import AnimatedPath from "./AnimatedPath";
import DrawingLine from "./DrawingLine";
import styles from "./Landing.module.scss";

const TheMergeBlock: React.FC = () => {
  const t = React.useContext(TranslationsContext);
  const stepperContext = React.useContext(StepperContext);
  const MergeRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (stepperContext && MergeRef.current) {
      stepperContext.addStepperELement(MergeRef, "Merge");
    }
  }, []);
  return (
    <>
      <DrawingLine pointRef={MergeRef} indexTopSection={4} />
      <section id="next-merge" ref={MergeRef}>
        <ContentBlock
          title={t.landing_themerge_title}
          text={t.landing_themerge_text}
          styles={`${styles.blockFeeBurn}`}
          id="what-next"
        />
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
            <IconBlock
              icon={`${t.landing_themerge_pow_icon}`}
              title={t.landing_themerge_pow_title}
              text={t.landing_themerge_pow_text}
            />
          </div>
          <div
            data-aos="fade-up"
            data-aos-anchor-placement="top-center"
            data-aos-delay="50"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
            className={`w-6/12 md:w-4/12 md:absolute md:ml-auto ${styles.mergeIconBlock}`}
          >
            <IconBlock
              icon={t.landing_themerge_pos_icon}
              title={t.landing_themerge_pos_title}
              text={t.landing_themerge_pos_text}
            />
          </div>
          <AnimatedPath />
        </div>
        <ContentBlock
          title={t.landing_themerge_title2}
          text={t.landing_themerge_text2}
          styles="pt-10"
          id="the-merge"
        />
        <div
          id="the-merge-line"
          className="flex flex-wrap justify-center w-full md:w-7/12 md:mx-auto mb-20"
        />
      </section>
    </>
  );
};

export default TheMergeBlock;
