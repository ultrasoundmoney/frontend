import React, { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import glowBg from "../../assets/blurred-bg1.png";

const isElementInViewport = (el: SVGSVGElement) => {
  const rect = el.getBoundingClientRect();
  const offset = window.innerHeight / 2;
  const start = rect.top - offset;
  const end = rect.bottom;

  return start < 0 && end > 0;
};

const points = {
  left: "20 20 20 800",
  right: "120 300 120 800 20 840 20 920",
};
const dots = [
  {
    x: 20,
    y: 20,
    animatedOn: 0,
    isAnimated: false,
  },
  {
    x: 20,
    y: 215,
    animatedOn: 0.27,
    isAnimated: false,
  },
  {
    x: 20,
    y: 410,
    animatedOn: 0.51,
    isAnimated: false,
  },
  {
    x: 20,
    y: 605,
    animatedOn: 0.78,
    isAnimated: false,
  },
  {
    x: 20,
    y: 800,
    animatedOn: 0.98,
    isAnimated: false,
  },
  {
    x: 120,
    y: 300,
    animatedOn: 0,
    isAnimated: false,
  },
  {
    x: 120,
    y: 600,
    animatedOn: 0.45,
    isAnimated: false,
  },
  {
    x: 20,
    y: 840,
    animatedOn: 0.92,
    isAnimated: false,
  },
];
const dashed = [
  {
    points: "20 20 20 215",
    animatedOn: 0.27,
    isAnimated: false,
  },
  {
    points: "20 215 20 410",
    animatedOn: 0.51,
    isAnimated: false,
  },
  {
    points: "20 410 20 605",
    animatedOn: 0.78,
    isAnimated: false,
  },
  {
    points: "20 605 20 800",
    animatedOn: 0.98,
    isAnimated: false,
  },
  {
    points: "120 300 120 600",
    animatedOn: 0.45,
    isAnimated: false,
  },
  {
    points: "120 600 120 800 20 840",
    animatedOn: 0.92,
    isAnimated: false,
  },
];
const dotVariants = {
  visible: {
    opacity: 1,
    scale: 1,
    duration: ".2s",
    transition: { delay: 0.5 },
  },
  hidden: { opacity: 0, scale: 0.1, duration: ".2s" },
};
const dashedVariants = {
  visible: { opacity: 1, duration: ".2s", transition: { delay: 0.5 } },
  hidden: { opacity: 0, duration: ".2s" },
};
const glowVariants = {
  visible: { opacity: 1, duration: ".2s", transition: { delay: 0.5 } },
  hidden: { opacity: 0, duration: ".2s" },
};

const AnimatedPath: React.FC<{}> = () => {
  const pathRef = useRef<null | SVGSVGElement>(null);
  const [dotsState, setDotsState] = useState(dots);
  const [dashedState, setDashedState] = useState(dashed);
  const [glowIsShow, setGlowIsShow] = useState(false);
  const [scrollYProgress, setScrollYProgress] = useState(0);
  const animationYProgress = useMotionValue(0);
  const pathLength = useSpring(animationYProgress, {
    stiffness: 400,
    damping: 90,
  });

  const getScrollProgress = (el: SVGSVGElement) => {
    const rect = el.getBoundingClientRect();
    const offset = window.innerHeight / 2;
    if (rect.y - offset < 0) {
      let progress = ((rect.y - offset) * -1) / rect.height;
      const lastProgress = animationYProgress.get();
      if (progress < lastProgress) {
        progress = lastProgress;
      }
      return progress > 1 ? 1 : progress;
    }
    return 0;
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
    if (pathRef.current)
      if (isElementInViewport(pathRef.current)) {
        const pathLengthProgress = pathLength.get();
        // if animated done
        if (pathLengthProgress === 1) return;

        // get event scroll progress
        const progress = getScrollProgress(pathRef.current);

        // set progress value
        animationYProgress.set(progress);

        // show green points
        setDotsState((prevState) => {
          return prevState.map((dot) =>
            dot.animatedOn < pathLengthProgress
              ? { ...dot, isAnimated: true }
              : dot
          );
        });

        // show dashed path
        setDashedState((prevState) => {
          return prevState.map((dashedItem) =>
            dashedItem.animatedOn < pathLengthProgress
              ? { ...dashedItem, isAnimated: true }
              : dashedItem
          );
        });

        // forced animated
        if (pathLengthProgress > 0.7) {
          animationYProgress.set(1);
          setDotsState((prevState) =>
            prevState.map((dot) => ({ ...dot, isAnimated: true }))
          );
          setDashedState((prevState) =>
            prevState.map((dashedItem) => ({ ...dashedItem, isAnimated: true }))
          );
          // show glow
          setGlowIsShow(true);
        }
      }
  }, [scrollYProgress, pathRef]);

  return (
    <div className="merge-path">
      <div className="merge-path_animated">
        <motion.img
          className="bg"
          src={glowBg.src}
          alt="glow"
          variants={glowVariants}
          animate={glowIsShow ? "visible" : "hidden"}
        />
        <motion.svg
          className="path"
          ref={pathRef}
          xmlns="http://www.w3.org/2000/svg"
          width="210"
          height="938"
          style={{ margin: "auto" }}
        >
          <motion.polyline
            points={points.left}
            fill="transparent"
            strokeWidth="20"
            stroke="#191F32"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              pathLength: pathLength,
            }}
          />
          <motion.polyline
            points={points.right}
            fill="transparent"
            strokeWidth="20"
            stroke="#191F32"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              pathLength: pathLength,
            }}
          />
          {dotsState.map((dot, index) => (
            <motion.circle
              key={index}
              cx={dot.x}
              cy={dot.y}
              r="4"
              fill="#00ffa3"
              variants={dotVariants}
              animate={dot.isAnimated ? "visible" : "hidden"}
            />
          ))}
          {dashedState.map((dashedItem, index) => (
            <motion.polyline
              key={index}
              points={dashedItem.points}
              fill="transparent"
              strokeWidth=".5"
              stroke="#8c8f98"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="4 4"
              variants={dashedVariants}
              animate={dashedItem.isAnimated ? "visible" : "hidden"}
            />
          ))}
        </motion.svg>
      </div>
    </div>
  );
};

export default AnimatedPath;
