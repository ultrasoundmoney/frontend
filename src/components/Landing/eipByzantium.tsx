import * as React from "react";
import { TranslationsContext } from "../../translations-context";

const EIPByzantium: React.FC<{}> = () => {
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
        id="eip-byzantium"
      >
        <div className="flex flex-col justify-center w-full md:w-w-34 md:mx-auto pt-56 px-4 md:px-0">
          <p className="text-blue-shipcove font-light text-sm text-center mb-6 font-inter">
            {t.landing_byzantium_date}
          </p>
          <h1 className="text-white font-light text-base md:text-28xl leading-5 text-center mb-6 font-inter">
            {t.landing_byzantium_title}
          </h1>
          <p
            className="text-blue-shipcove font-light text-sm text-center mb-24 font-inter"
            dangerouslySetInnerHTML={{
              __html: t.landing_byzantium_text,
            }}
          />
        </div>
        <div className="flex flex-wrap justify-center">
          <div id="line__byzantium" className="eclips-hr" />
        </div>
      </section>
    </>
  );
};

export default EIPByzantium;
