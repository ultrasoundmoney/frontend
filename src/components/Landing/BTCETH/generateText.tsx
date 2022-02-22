import React, { useState, useContext, useEffect } from "react";
import { TranslationsContext } from "../../../translations-context";
import BlockText from "./BlockText";

const SVGrender: React.FC<{ typ: string }> = ({ typ }) => {
  const t = useContext(TranslationsContext);
  const [currentIndex, setCurentIndex] = useState(0);
  const variants = {
    down: { y: 500, opacity: 0 },
    center: { y: 0, opacity: 1 },
    up: { y: -500, opacity: 0 },
  };

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

  useEffect(() => {
    switch (typ) {
      case "btc":
        setCurentIndex(1);
        break;
      case "eth":
        setCurentIndex(2);
        break;
      case "usd":
        setCurentIndex(3);
        break;
      default:
        setCurentIndex(0);
        break;
    }
  }, [typ]);

  return (
    <>
      {data.map((item, index) => (
        <BlockText
          key={item.type}
          currentIndexElement={currentIndex}
          indexElement={index}
          title={item.title}
          text={item.text}
          variants={variants}
        />
      ))}
    </>
  );
};

export default SVGrender;
