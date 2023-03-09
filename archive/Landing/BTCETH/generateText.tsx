import React, { useContext } from "react";
import TranslationsContext from "../../../contexts/TranslationsContext";
import BlockText from "./BlockText";

const SVGrender = () => {
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
      title: t.eusm_row_4_title,
      text: t.eusm_row_4_text,
      type: "usd",
    },
    {
      title: t.eusm_row_2_title,
      text: t.eusm_row_2_text,
      type: "eth",
    },
  ];

  return (
    <>
      {data.map((item, index) => (
        <BlockText
          key={`${index}_textBlock`}
          title={item.title}
          text={item.text}
        />
      ))}
    </>
  );
};

export default SVGrender;
