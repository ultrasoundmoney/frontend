import * as React from "react";
import TranslationsContext from "../../contexts/TranslationsContext";

const BeforeGenesis: React.FC = () => {
  const t = React.useContext(TranslationsContext);

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
      >
        <div className="flex w-full max-w-2xl flex-col justify-center px-16 pt-16 md:m-auto  md:px-8  lg:w-1/2 lg:px-0">
          <h1 className="mb-6 text-center font-inter text-base font-light leading-normal text-white md:text-32xl">
            {t.landing_before_genesis_title}
          </h1>
          <p className="mb-10 text-center font-inter text-sm font-light text-slateus-400">
            {t.landing_before_genesis_text}
          </p>
        </div>
      </section>
    </>
  );
};

export default BeforeGenesis;
