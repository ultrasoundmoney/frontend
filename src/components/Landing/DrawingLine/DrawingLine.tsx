import type { RefObject } from "react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import styles from "./DrawingLine.module.scss";
import type { StepperPoint } from "../../../contexts/StepperContext";
import { StepperContext } from "../../../contexts/StepperContext";

interface DrawingLineProps {
  pointRef: RefObject<HTMLDivElement> | null;
  indexTopSection?: number;
  withoutBottomMargin?: boolean;
}
interface Obj {
  [key: string]: any;
}
const DrawingLine: React.FC<DrawingLineProps> = ({
  pointRef,
  indexTopSection,
  withoutBottomMargin,
}) => {
  const [scrollYProgress, setScrollYProgress] = useState(0);
  const [isDone, setIsDone] = useState(true);
  const animationYProgress = useMotionValue<number>(0);
  const y = useTransform(animationYProgress, [0, 1], [0, 600]);
  const height = useSpring(y, {
    stiffness: 600,
    damping: 90,
  });

  const getScrollProgress = (el: HTMLDivElement) => {
    const rect = el.getBoundingClientRect();
    let marginBottom = window.innerHeight / 12;
    if (!withoutBottomMargin) marginBottom = window.innerHeight / 5;
    const distance = window.innerHeight - marginBottom;
    const progress = 1 - (rect.top - distance + marginBottom) / distance;
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

  const stepperPoints = useContext(StepperContext);
  const controlPoints: StepperPoint[] = stepperPoints?.stepperElements
    ? // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      (Object.keys(stepperPoints.stepperElements).map((element) => {
        return stepperPoints?.stepperElements[element];
      }) as StepperPoint[])
    : [];

  const triggerActivePointScroll: Obj = useRef(0);
  useEffect(() => {
    if (
      typeof indexTopSection === "number" &&
      indexTopSection >= 0 &&
      Array.isArray(controlPoints) &&
      typeof controlPoints[indexTopSection]?.offsetY === "number"
    ) {
      triggerActivePointScroll.current =
        controlPoints[indexTopSection]?.offsetY;
    }
  }, [controlPoints]);

  useEffect(() => {
    if (pointRef?.current) {
      // get event scroll progress
      const progress = getScrollProgress(pointRef.current);

      // set progress value
      animationYProgress.set(progress);
      if (typeof indexTopSection === "number" && indexTopSection >= 0) {
        window.scrollY >
        triggerActivePointScroll.current - window.innerHeight / 2.4
          ? setIsDone(true)
          : setIsDone(false);
      } else {
        // forced animated
        progress > 0.95 ? setIsDone(true) : setIsDone(false);
        progress < 0 && animationYProgress.set(0);
      }
    }
  }, [scrollYProgress, pointRef, triggerActivePointScroll.current]);

  return (
    <div
      className={`${styles.drawing_line} ${
        isDone ? styles.drawing_line_active : ""
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
