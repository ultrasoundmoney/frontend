import * as React from "react";
import AvatarImg from "../../assets/avatar.webp";
import EthBurn from "../../assets/eth-burn.svg";
import { StepperContext } from "../../context/StepperContext";
import { TranslationsContext } from "../../translations-context";
import DrawingLine from "./DrawingLine";

const EIP1559: React.FC<{}> = () => {
  const t = React.useContext(TranslationsContext);
  function imageErrorHandler(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    const el = e.target as HTMLImageElement;
    el.onerror = null;
    el.src = AvatarImg;
  }
  const stepperContext = React.useContext(StepperContext);
  const EIPRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (stepperContext && EIPRef.current) {
      stepperContext.addStepperELement(EIPRef, "EIP 1559");
    }
  }, []);

  return (
    <>
      <DrawingLine pointRef={EIPRef} />
      <section
        data-aos="fade-up"
        data-aos-anchor-placement="top-bottom"
        data-aos-offset="100"
        data-aos-delay="50"
        data-aos-duration="1000"
        data-aos-easing="ease-in-out"
        id="eip-1559"
        ref={EIPRef}
      >
        <div className="block-fee-burn flex flex-col justify-center items-center w-full md:w-6/12 md:mx-auto pt-20 px-4 md:px-0 ">
          <picture>
            <img
              className="relative text-center mx-auto mb-8"
              width="111"
              height="90"
              src={EthBurn}
              alt="eth-brn"
              onError={imageErrorHandler}
            />
          </picture>
          <h1 className="text-white font-light text-base md:text-28xl leading-5 text-center mb-6 font-inter">
            {t.landing_eip1559_title}
          </h1>
          <p
            className="text-blue-shipcove font-light lg:w-w-55 text-sm text-center mb-8 font-inter"
            dangerouslySetInnerHTML={{
              __html: t.landing_eip1559_text,
            }}
          />
        </div>
      </section>
    </>
  );
};

export default EIP1559;
