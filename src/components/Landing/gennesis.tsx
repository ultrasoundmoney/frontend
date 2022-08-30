import * as React from "react";
import { StepperContext } from "../../contexts/StepperContext";
import TranslationsContext from "../../contexts/TranslationsContext";
import DrawingLine from "./DrawingLine";

const GenesisBlock: React.FC = () => {
  const t = React.useContext(TranslationsContext);
  const stepperContext = React.useContext(StepperContext);
  const genesisRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (stepperContext && genesisRef.current) {
      stepperContext.addStepperELement(genesisRef, "Genesis");
    }
  }, []);

  return (
    <>
      <DrawingLine
        pointRef={genesisRef}
        indexTopSection={0}
        withoutBottomMargin={true}
      />
      <section
        data-aos="fade-up"
        data-aos-anchor-placement="top-bottom"
        data-aos-offset="400"
        data-aos-delay="100"
        data-aos-duration="1000"
        data-aos-easing="ease-in-out"
        id="genesis"
      >
        <div className="flex flex-col justify-center w-full md:w-4/12 md:mx-auto pt-16 px-4 md:px-0">
          <p className="text-blue-shipcove font-light text-sm text-center mb-7 font-inter">
            {t.landing_genesis_date}
          </p>
          <h1 className="text-white font-light text-base md:text-28xl leading-5 text-center mb-7 font-inter">
            {t.landing_genesis_title}
          </h1>
          <p
            className="text-blue-shipcove font-light text-sm text-center mb-24 font-inter"
            dangerouslySetInnerHTML={{
              __html: t.landing_genesis_text,
            }}
          />
        </div>
      </section>
    </>
  );
};

export default GenesisBlock;
