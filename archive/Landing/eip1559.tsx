import * as React from "react";
import { StepperContext } from "../../contexts/StepperContext";
import TranslationsContext from "../../contexts/TranslationsContext";
import DrawingLine from "./DrawingLine";
import styles from "./Landing.module.scss";

const EIP1559: React.FC = () => {
  const t = React.useContext(TranslationsContext);
  function imageErrorHandler(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    const el = e.target as HTMLImageElement;
    el.onerror = null;
    el.src = `/avatar.webp`;
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
      <DrawingLine pointRef={EIPRef} indexTopSection={3} />
      <section
        data-aos="fade-up"
        data-aos-anchor-placement="top-center"
        data-aos-offset="50"
        data-aos-delay="50"
        data-aos-duration="1000"
        data-aos-easing="ease-in-out"
        id="eip-1559"
      >
        <div
          className={`${styles.blockFeeBurn} flex w-full flex-col items-center justify-center px-4 pt-20 md:mx-auto md:w-6/12 md:px-0`}
        >
          <video
            className={`${styles.eipBg}`}
            playsInline
            autoPlay
            muted
            loop
            poster={`/bat-bg/Blurredbg.png`}
          >
            <source src="/eip_compressed.mp4" type="video/mp4" />
          </video>
          <picture>
            <img
              className="relative mx-auto mb-8 text-center"
              width="111"
              height="90"
              src={`/eth-burn.svg`}
              alt="eth-brn"
              onError={imageErrorHandler}
            />
          </picture>
          <h1 className="mb-6 text-center font-inter text-base font-light leading-5 text-white md:text-28xl">
            {t.landing_eip1559_title}
          </h1>
          <p
            className="mb-8 text-center font-inter text-sm font-light text-slateus-400 lg:w-w-55"
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
