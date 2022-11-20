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
        <div className="flex w-full flex-col justify-center px-4 pt-16 md:mx-auto md:w-4/12 md:px-0">
          <p className="mb-7 text-center font-inter text-sm font-light text-slateus-400">
            {t.landing_genesis_date}
          </p>
          <h1 className="mb-7 text-center font-inter text-base font-light leading-5 text-white md:text-28xl">
            {t.landing_genesis_title}
          </h1>
          <p
            className="mb-24 text-center font-inter text-sm font-light text-slateus-400"
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
