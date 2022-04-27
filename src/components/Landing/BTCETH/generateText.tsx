import React, { useContext } from "react";
import { TranslationsContext } from "../../../translations-context";
import ContentBlockMedia from "../../ContentBlock/ContentBlockMedia";

const SVGrender: React.FC = () => {
  const t = useContext(TranslationsContext);

  const data = [
    {
      title: t.eusm_row_1_left_col_title,
      text: t.eusm_row_1_left_col_text,
      type: "none",
    },
    {
      title: t.eusm_row_3_title,
      text: t.eusm_row_3_text,
      type: "btc",
    },
    {
      title: t.eusm_row_2_title,
      text: t.eusm_row_2_text,
      type: "eth",
    },
    {
      title: t.eusm_row_4_title,
      text: t.eusm_row_4_text,
      type: "usd",
    },
  ];

  return (
    <>
      {data.map((item) => (
        <ContentBlockMedia
          key={item.type}
          title={item.title}
          text={item.text}
        />
      ))}
    </>
  );
};

export default SVGrender;
