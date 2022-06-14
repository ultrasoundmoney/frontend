import React, { useEffect } from "react";
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
    if (currentIndexElement - 2 === indexElement) {
      setActivePosition(variants.up);
      return;
    } else if (currentIndexElement + 2 === indexElement) {
      setActivePosition(variants.down);
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

export default BlockText;
