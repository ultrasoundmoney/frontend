import React, { useState, useContext, useEffect } from "react";
import { TranslationsContext } from "../../../translations-context";
import { motion } from "framer-motion";
import ContentBlockMedia from "../../ContentBlock/ContentBlockMedia";

const BlockText: React.FC<{
  title: string;
  text: string;
  variants: any;
  indexElement: number;
  currentIndexElement: number;
}> = ({ title, text, variants, indexElement, currentIndexElement }) => {
  const [activePosition, setActivePosition] = React.useState(variants.down);
  useEffect(() => {
    if (
      currentIndexElement + 2 === indexElement ||
      currentIndexElement - 2 === indexElement
    ) {
      return;
    }

    if (indexElement === currentIndexElement) {
      setActivePosition(variants.center);
    } else {
      if (currentIndexElement > indexElement) {
        setActivePosition(variants.up);
      } else {
        setActivePosition(variants.down);
      }
    }
  }, [currentIndexElement]);

  return (
    <motion.div
      className="graph_text_eth"
      animate={activePosition}
      transition={{ duration: 1 }}
      variants={variants}
    >
      <ContentBlockMedia title={title} text={text} />
    </motion.div>
  );
};
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
      title: t.eusm_row_2_title,
      text: t.eusm_row_2_text,
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
