import * as React from "react";
import ContentBlock from "../ContentBlock/ContentBlcok";
import IconBlock from "../ContentBlock/IconBlock";
import { TranslationsContext } from "../../translations-context";

const TheMergeBlock: React.FC<{}> = () => {
  const t = React.useContext(TranslationsContext);
  return (
    <>
      <section id="next-merge">
        <ContentBlock
          title={t.landing_themerge_title}
          text={t.landing_themerge_text}
          styles="block-fee-burn"
          id="what-next"
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
          id="the-merge"
        />
        <div className="flex flex-wrap justify-center w-full md:w-7/12 md:mx-auto mb-20">
          <div className="eclips-bottom-line eclips-bottom-line__only " />
        </div>
      </section>
    </>
  );
};

export default TheMergeBlock;
