import * as React from "react";
import { StepperContext } from "../../contexts/StepperContext";
import TranslationsContext from "../../contexts/TranslationsContext";
import DrawingLine from "./DrawingLine";

const EIPByzantium: React.FC = () => {
  const t = React.useContext(TranslationsContext);
  const stepperContext = React.useContext(StepperContext);
  const byzantiumRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (stepperContext && byzantiumRef.current) {
      stepperContext.addStepperELement(byzantiumRef, "Byzantium");
    }
  }, []);

  return (
    <>
      <DrawingLine pointRef={byzantiumRef} indexTopSection={1} />
      <section
        data-aos="fade-up"
        data-aos-anchor-placement="top-bottom"
        data-aos-offset="400"
        data-aos-delay="100"
        data-aos-duration="1000"
        data-aos-easing="ease-in-out"
        id="eip-byzantium"
      >
        <div className="flex w-full flex-col justify-center px-4 pt-16 md:mx-auto md:w-w-34 md:px-0">
          <p className="mb-6 text-center font-inter text-sm font-light text-slateus-400">
            {t.landing_byzantium_date}
          </p>
          <h1 className="mb-6 text-center font-inter text-base font-light leading-5 text-white md:text-28xl">
            {t.landing_byzantium_title}
          </h1>
          <p
            className="mb-24 text-center font-inter text-sm font-light text-slateus-400"
            dangerouslySetInnerHTML={{
              __html: t.landing_byzantium_text,
            }}
          />
        </div>
      </section>
    </>
  );
};

export default EIPByzantium;
