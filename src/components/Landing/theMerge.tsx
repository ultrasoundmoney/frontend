import * as React from "react";
import { useTranslations } from "../../utils/use-translation";
import ContentBlock from "../ContentBlock/ContentBlcok";
import IconBlock from "../ContentBlock/IconBlock";

const TheMergeBlock: React.FC<{}> = () => {
  const { translations: t } = useTranslations();
  return (
    <>
      <ContentBlock
        title={t.landing_themerge_title}
        text={t.landing_themerge_text}
        styles="block-fee-burn"
      />
      <div className="the-merge flex flex-col w-full sm:w-9/12 mx-auto">
        <div className="w-full sm:w-4/12 md:mr-auto md:py-16">
          <IconBlock
            icon={`${t.landing_goal_block1_icon} ${t.landing_goal_block1_icon}`}
            title={t.landing_themerge_pow_title}
            text={t.landing_themerge_pow_text}
          />
        </div>
        <div className="w-full sm:w-4/12 md:ml-auto">
          <IconBlock
            icon={t.landing_goal_block1_icon}
            title={t.landing_themerge_pos_title}
            text={t.landing_themerge_pos_text}
          />
        </div>
      </div>
      <ContentBlock
        title={t.landing_themerge_title2}
        text={t.landing_themerge_text2}
        styles="pt-10"
      />
      <div className="flex flex-wrap justify-center w-full md:w-7/12 md:mx-auto mb-20">
        <div className="eclips-bottom-line eclips-bottom-line__only " />
      </div>
    </>
  );
};

export default TheMergeBlock;
