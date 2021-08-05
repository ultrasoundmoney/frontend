import * as React from "react";
import TimeLineContentBlock from "../ContentBlock/TimeLineContent";
import { TranslationsContext } from "../../translations-context";

const EIPConstantinopole: React.FC<{}> = () => {
  const t = React.useContext(TranslationsContext);
  return (
    <>
      <TimeLineContentBlock
        blockNrAndTime={t.landing_constantinopole_date}
        title={t.landing_constantinopole_title}
        text={t.landing_constantinopole_text}
        id="eip-constantinople"
      />
    </>
  );
};

export default EIPConstantinopole;
