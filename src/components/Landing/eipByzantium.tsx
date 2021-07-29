import * as React from "react";
import TimeLineContentBlock from "../ContentBlock/TimeLineContent";
import { TranslationsContext } from "../../translations-context";

const EIPByzantium: React.FC<{}> = () => {
  const t = React.useContext(TranslationsContext);
  return (
    <>
      <TimeLineContentBlock
        blockNrAndTime={t.landing_byzantium_date}
        title={t.landing_byzantium_title}
        text={t.landing_byzantium_text}
        id="eip-byzantium"
      />
    </>
  );
};

export default EIPByzantium;
