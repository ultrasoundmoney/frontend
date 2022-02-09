import * as React from "react";
import { TranslationsContext } from "../../../translations-context";
import { motion } from "framer-motion";
import ContentBlockMedia from "../../ContentBlock/ContentBlockMedia";

const SVGrender: React.FC<{ typ: string }> = ({ typ }) => {
  const t = React.useContext(TranslationsContext);
  const variants = {
    visible: { opacity: 1, display: "block" },
    hidden: { opacity: 0, display: "none" },
  };

  const data = [
    {
      title: t.eusm_row_2_title,
      text: t.eusm_row_2_text,
      type: "eth",
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
      type: "none",
    },
  ];

  return (
    <>
      {data.map((item) => (
        <motion.div
          key={item.type}
          className="graph_text_eth"
          initial="hidden"
          animate={typ === item.type ? "visible" : "hidden"}
          variants={variants}
        >
          <ContentBlockMedia title={item.title} text={item.text} />
        </motion.div>
      ))}
    </>
  );
};

export default SVGrender;
