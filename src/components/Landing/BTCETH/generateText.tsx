import * as React from "react";
import { TranslationsContext } from "../../../translations-context";
import ContentBlockMedia from "../../ContentBlock/ContentBlockMedia";

const SVGrender: React.FC<{ typ: string }> = ({ typ }) => {
  const t = React.useContext(TranslationsContext);
  if (typ === "eth") {
    return (
      <>
        <div className="tt">
          <ContentBlockMedia
            title={t.eusm_row_2_title}
            text={t.eusm_row_2_title}
          />
        </div>
      </>
    );
  } else if (typ === "btc") {
    return (
      <>
        <div className="tt">
          <ContentBlockMedia
            title={t.eusm_row_3_title}
            text={t.eusm_row_3_title}
          />
        </div>
      </>
    );
  } else if (typ === "usd") {
    return (
      <>
        <div className="tt">
          <ContentBlockMedia
            title={t.eusm_row_4_title}
            text={t.eusm_row_4_title}
          />
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="tt">
          <ContentBlockMedia
            title={t.eusm_row_2_title}
            text={t.eusm_row_2_title}
          />
        </div>
      </>
    );
  }
};

export default SVGrender;
