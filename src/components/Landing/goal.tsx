import * as React from "react";
import { useTranslations } from "../../utils/use-translation";
import IconBlock from "../ContentBlock/IconBlock";

type GoalBlcokProps = {
  styles?: string;
};
const GoalBlcok: React.FC<GoalBlcokProps> = ({ styles }) => {
  const { translations: t } = useTranslations();
  const getClassName =
    styles != undefined || styles != null
      ? `block w-full md:w-7/12 md:m-auto ${styles}`
      : `block w-full md:w-7/12 md:m-auto`;
  return (
    <>
      <div className={getClassName}>
        <h1
          className="text-white font-light text-base md:text-3xl leading-normal text-center mb-6 leading-title"
          dangerouslySetInnerHTML={{
            __html: t.landing_goal_title,
          }}
        />
        <div className="w-full flex flex-wrap justify-between py-8">
          <IconBlock
            icon={t.landing_goal_block1_icon}
            title={t.landing_goal_block1_title}
            text={t.landing_goal_block1_text}
          />
          <IconBlock
            icon={t.landing_goal_block2_icon}
            title={t.landing_goal_block2_title}
            text={t.landing_goal_block2_text}
          />
          <IconBlock
            icon={t.landing_goal_block3_icon}
            title={t.landing_goal_block3_title}
            text={t.landing_goal_block3_text}
          />
        </div>
      </div>
    </>
  );
};

export default GoalBlcok;
