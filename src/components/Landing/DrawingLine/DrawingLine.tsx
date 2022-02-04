import React, { RefObject, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import styles from "./DrawingLine.module.scss";

interface DrawingLineProps {
  pointRef: RefObject<HTMLDivElement> | null;
}

const DrawingLine: React.FC<DrawingLineProps> = ({ pointRef }) => {
  const [scrollYProgress, setScrollYProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const animationYProgress = useMotionValue<number>(0);
  const y = useTransform(animationYProgress, [0, 1], [0, 400]);
  const height = useSpring(y, {
    stiffness: 600,
    damping: 90,
  });

  const getScrollProgress = (el: HTMLDivElement) => {
    const rect = el.getBoundingClientRect();

    const distance = window.innerHeight / 2;
    const progress = 1 - (rect.top - distance) / distance;
    const roundDecimal = Math.round(progress * 100) / 100;
    if (roundDecimal < 0) {
      return 0;
    }
    return roundDecimal > 1 ? 1 : roundDecimal;
  };

  const handleScroll = () => {
    setScrollYProgress(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (pointRef?.current) {
      // get event scroll progress
      const progress = getScrollProgress(pointRef.current);

      // set progress value
      animationYProgress.set(progress);

      // forced animated
      progress > 0.95 ? setIsDone(true) : setIsDone(false);
      progress < 0.3 && animationYProgress.set(0);
    }
  }, [scrollYProgress, pointRef]);

  return (
    <div
      className={`${styles.drawing_line} ${
        isDone && styles.drawing_line_active
      }`}
    >
      <motion.div className={styles.drawing_line_container} style={{ height }}>
        <div className={styles.drawing_line_path} />
      </motion.div>
      <motion.div className={styles.drawing_line_point} ref={pointRef} />
    </div>
  );
};

export default DrawingLine;
