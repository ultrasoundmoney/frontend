import * as React from "react";
import { StepperContext } from "../../context/StepperContext";
import { TranslationsContext } from "../../translations-context";

const EIPConstantinopole: React.FC = () => {
  const t = React.useContext(TranslationsContext);
  const stepperContext = React.useContext(StepperContext);
  const constantinopoleRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (stepperContext && constantinopoleRef.current) {
      stepperContext.addStepperELement(constantinopoleRef, "Constantinopole");
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
        id="eip-constantinople"
        ref={constantinopoleRef}
      >
        <div className="flex flex-col justify-center w-full md:w-w-34 md:mx-auto pt-56 px-4 md:px-0">
          <p className="text-blue-shipcove font-light text-sm text-center mb-6 font-inter">
            {t.landing_constantinopole_date}
          </p>
          <h1 className="text-white font-light text-base md:text-28xl leading-5 text-center mb-6 font-inter">
            {t.landing_constantinopole_title}
          </h1>
          <p
            className="text-blue-shipcove font-light text-sm text-center mb-24 font-inter"
            dangerouslySetInnerHTML={{
              __html: t.landing_constantinopole_text,
            }}
          />
        </div>
        <div className="flex flex-wrap justify-center">
          <div id="line__constantinople" className="eclips-hr" />
        </div>
      </section>
    </>
  );
};

export default EIPConstantinopole;
