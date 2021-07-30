import * as React from "react";
import TimeLineContentBlock from "../ContentBlock/TimeLineContent";
import { TranslationsContext } from "../../translations-context";

const GenesisBlock: React.FC<{}> = () => {
  const t = React.useContext(TranslationsContext);
  return (
    <>
      <TimeLineContentBlock
        blockNrAndTime={t.landing_genesis_date}
        title={t.landing_genesis_title}
        text={t.landing_genesis_text}
        id="genesis"
      />
    </>
  );
};

export default GenesisBlock;
