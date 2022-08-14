import * as React from "react";
import { TranslationsContext } from "../../translations-context";
import Twemoji from "../Twemoji";

type GoalBlcokProps = {
  styles?: string;
};
const GoalBlcok: React.FC<GoalBlcokProps> = ({ styles }) => {
  const t = React.useContext(TranslationsContext);
  const getClassName =
    styles != undefined || styles != null
      ? `block w-full lg:w-8/12 lg:m-auto px-4 md:px-8 md:pb-8 rounded-xl ${styles}`
      : `block w-full lg:w-8/12 lg:m-auto px-4 md:px-8 md:pb-8 rounded-xl`;
  return (
    <>
      <section
        data-aos="fade-up"
        data-aos-anchor-placement="top-bottom"
        data-aos-offset="100"
        data-aos-delay="50"
        data-aos-duration="1000"
        data-aos-easing="ease-in-out"
        className={getClassName}
        id="goal"
      >
        <h1
          className="text-white font-light text-base md:text-32xl leading-normal text-center mb-6"
          dangerouslySetInnerHTML={{
            __html: t.landing_goal_title,
          }}
        />
        <div className="w-full md:flex md:flex-wrap justify-between py-8">
          <div className="flex-none md:flex-1 text-start md:text-left px-3 mb-16">
            <Twemoji imageClassName="h-6 lg:h-8 select-none" wrapper>
              🔭
            </Twemoji>
            <h3 className="text-white font-light text-base text-start mb-4 mt-4">
              {t.landing_goal_block1_title}
            </h3>
            <p className="text-blue-shipcove font-light text-start text-sm break-words mt-4 whitespace-pre-line leading-relaxed">
              {t.landing_goal_block1_text}
            </p>
          </div>
          <div className="flex-none md:flex-1 text-start md:text-left px-3 mb-16">
            <Twemoji imageClassName="h-6 lg:h-8 select-none" wrapper>
              🚀
            </Twemoji>
            <h3 className="text-white font-light text-base text-start mb-4 mt-4">
              {t.landing_goal_block2_title}
            </h3>
            <p className="text-blue-shipcove font-light text-start text-sm break-words mt-4 whitespace-pre-line leading-relaxed">
              {t.landing_goal_block2_text}
            </p>
          </div>
          <div className="flex-none md:flex-1 text-start md:text-left px-3 mb-16">
            <Twemoji imageClassName="h-6 lg:h-8 select-none" wrapper>
              😃
            </Twemoji>
            <h3 className="text-white font-light text-base text-start mb-4 mt-4">
              {t.landing_goal_block3_title}
            </h3>
            <p className="text-blue-shipcove font-light text-start text-sm break-words mt-4 whitespace-pre-line leading-relaxed">
              {t.landing_goal_block3_text}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default GoalBlcok;
