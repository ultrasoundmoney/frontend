import * as React from "react";
import { StepperContext } from "../../context/StepperContext";
import { TranslationsContext } from "../../translations-context";

const BeforeGenesis: React.FC = () => {
  const t = React.useContext(TranslationsContext);
  const context = React.useContext(StepperContext);
  const elementRef = React.useRef<HTMLDivElement | null>(null);

  React.useLayoutEffect(() => {
    if (context && elementRef.current) {
      context.addStepperELement(elementRef, "Before Genesis");
    }
  }, []);

  return (
    <>
      <section
        data-aos="fade-up"
        data-aos-anchor-placement="top-bottom"
        data-aos-offset="300"
        data-aos-delay="100"
        data-aos-duration="1000"
        data-aos-easing="ease-in-out"
        id="before-genesis"
        ref={elementRef}
      >
        <div className="flex flex-col justify-center w-full lg:w-w-38 md:m-auto px-16  pt-56  md:px-8 lg:px-0">
          <h1 className="text-white font-light text-base md:text-32xl leading-normal text-center mb-6 leading-title font-inter">
            {t.landing_before_genesis_title}
          </h1>
          <p className="text-blue-shipcove font-light text-sm text-center mb-10 font-inter">
            {t.landing_before_genesis_text}
          </p>
        </div>
        <div className="flex flex-wrap justify-center">
          <div id="line__before__genesis" className="eclips-hr" />
        </div>
      </section>
    </>
  );
};

export default BeforeGenesis;
