import * as React from "react";
import { TranslationsContext } from "../../translations-context";

const GenesisBlock: React.FC<{}> = () => {
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
        id="genesis"
      >
        <div className="flex flex-col justify-center w-full md:w-6/12 md:mx-auto pt-56 px-4 md:px-0">
          <p className="text-blue-shipcove font-light text-sm text-center mb-6 font-inter">
            {t.landing_genesis_date}
          </p>
          <h1 className="text-white font-light text-base md:text-3xl leading-normal text-center mb-6 leading-title font-inter">
            {t.landing_genesis_title}
          </h1>
          <p
            className="text-blue-shipcove font-light text-sm text-center mb-24 font-inter"
            dangerouslySetInnerHTML={{
              __html: t.landing_genesis_text,
            }}
          />
        </div>
        <div className="flex flex-wrap justify-center">
          <div id="line__genesis" className="eclips-hr" />
        </div>
      </section>
    </>
  );
};

export default GenesisBlock;
