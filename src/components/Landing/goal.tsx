import * as React from "react";
import TranslationsContext from "../../contexts/TranslationsContext";
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
          className="mb-6 text-center text-base font-light leading-normal text-white md:text-32xl"
          dangerouslySetInnerHTML={{
            __html: t.landing_goal_title,
          }}
        />
        <div className="w-full justify-between py-8 md:flex md:flex-wrap">
          <div className="mb-16 flex-none px-3 text-start md:flex-1 md:text-left">
            <Twemoji imageClassName="h-6 lg:h-8 select-none" wrapper>
              🔭
            </Twemoji>
            <h3 className="mb-4 mt-4 text-start text-base font-light text-white">
              {t.landing_goal_block1_title}
            </h3>
            <p className="mt-4 whitespace-pre-line break-words text-start text-sm font-light leading-relaxed text-slateus-400">
              {t.landing_goal_block1_text}
            </p>
          </div>
          <div className="mb-16 flex-none px-3 text-start md:flex-1 md:text-left">
            <Twemoji imageClassName="h-6 lg:h-8 select-none" wrapper>
              🚀
            </Twemoji>
            <h3 className="mb-4 mt-4 text-start text-base font-light text-white">
              {t.landing_goal_block2_title}
            </h3>
            <p className="mt-4 whitespace-pre-line break-words text-start text-sm font-light leading-relaxed text-slateus-400">
              {t.landing_goal_block2_text}
            </p>
          </div>
          <div className="mb-16 flex-none px-3 text-start md:flex-1 md:text-left">
            <Twemoji imageClassName="h-6 lg:h-8 select-none" wrapper>
              😃
            </Twemoji>
            <h3 className="mb-4 mt-4 text-start text-base font-light text-white">
              {t.landing_goal_block3_title}
            </h3>
            <p className="mt-4 whitespace-pre-line break-words text-start text-sm font-light leading-relaxed text-slateus-400">
              {t.landing_goal_block3_text}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default GoalBlcok;
