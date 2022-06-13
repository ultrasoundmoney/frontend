import * as React from "react";
import telescope from "../../assets/telescope.svg";
import smile from "../../assets/smile.svg";
import roket from "../../assets/roket.svg";
import { TranslationsContext } from "../../translations-context";
import ImageBlock from "../ContentBlock/ImageBlock";

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
          className="text-white font-light text-base md:text-32xl leading-normal text-center mb-6 leading-title"
          dangerouslySetInnerHTML={{
            __html: t.landing_goal_title,
          }}
        />
        <div className="w-full md:flex md:flex-wrap justify-between py-8">
          <ImageBlock
            image={telescope.src}
            title={t.landing_goal_block1_title}
            text={t.landing_goal_block1_text}
            textAlign="start"
          />
          <ImageBlock
            image={roket.src}
            title={t.landing_goal_block2_title}
            text={t.landing_goal_block2_text}
            textAlign="start"
          />
          <ImageBlock
            image={smile.src}
            title={t.landing_goal_block3_title}
            text={t.landing_goal_block3_text}
            textAlign="start"
          />
        </div>
      </section>
    </>
  );
};

export default GoalBlcok;
