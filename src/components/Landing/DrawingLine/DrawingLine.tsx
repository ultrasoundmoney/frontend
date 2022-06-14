import React, {
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import styles from "./DrawingLine.module.scss";
import { StepperContext } from "../../../context/StepperContext";

interface DrawingLineProps {
  pointRef: RefObject<HTMLDivElement> | null;
  indexTopSection?: number;
}
interface Obj {
  [key: string]: any;
}
const DrawingLine: React.FC<DrawingLineProps> = ({
  pointRef,
  indexTopSection,
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

  const stepperPoints = useContext(StepperContext);
  const controlPoints = Object.keys(stepperPoints?.stepperElements as {}).map(
    (element) => {
      return stepperPoints?.stepperElements[element];
    }
  );

  const triggerActivePointScroll: Obj = useRef(0);
  useEffect(() => {
    if (
      indexTopSection &&
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
      if (indexTopSection) {
        window.scrollY >
        triggerActivePointScroll.current - window.innerHeight / 2
          ? setIsDone(true)
          : setIsDone(false);
      } else {
        // forced animated
        progress > 0.95 ? setIsDone(true) : setIsDone(false);
        progress < 0.3 && animationYProgress.set(0);
      }
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