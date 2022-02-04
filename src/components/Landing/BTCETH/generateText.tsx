import * as React from "react";
import { TranslationsContext } from "../../../translations-context";
import ContentBlockMedia from "../../ContentBlock/ContentBlockMedia";

const SVGrender: React.FC<{ typ: string }> = ({ typ }) => {
  const t = React.useContext(TranslationsContext);
  if (typ === "eth") {
    return (
      <>
        <div className="graph_text_eth">
          <ContentBlockMedia
            title={t.eusm_row_2_title}
            text={t.eusm_row_2_text}
          />
        </div>
      </>
    );
  } else if (typ === "btc") {
    return (
      <>
        <div className="graph_text_btc">
          <ContentBlockMedia
            title={t.eusm_row_3_title}
            text={t.eusm_row_3_text}
          />
        </div>
      </>
    );
  } else if (typ === "usd") {
    return (
      <>
        <div className="graph_text_usd">
          <ContentBlockMedia
            title={t.eusm_row_4_title}
            text={t.eusm_row_4_text}
          />
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="graph_text_usd">
          <ContentBlockMedia
            title={t.eusm_row_2_title}
            text={t.eusm_row_2_text}
          />
        </div>
      </>
    );
  }
};

export default SVGrender;
