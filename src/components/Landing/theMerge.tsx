import * as React from "react";
import { useTranslations } from "../../utils/use-translation";
import ContentBlock from "../ContentBlock/ContentBlcok";

const TheMergeBlock: React.FC<{}> = () => {
  const { translations: t } = useTranslations();
  return (
    <>
      <ContentBlock
        title={t.landing_themerge_title}
        text={t.landing_themerge_text}
        styles="block-fee-burn"
      />
    </>
  );
};

export default TheMergeBlock;
