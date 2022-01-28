import React, { useCallback, useEffect, useState } from "react";
import staticPath from "../../assets/lines-bg.svg";
import blurredBg from "../../assets/blurred-bg1.svg";
import { throttle } from "lodash";

function getPrecent(ref: HTMLInputElement, topOffset = 400) {
  const rect = ref.getBoundingClientRect();
  let percent = 0;
  percent = 100 - ((rect.bottom - topOffset) / rect.height) * 100;
  return percent > 100 ? 100 : percent;
}

// function isElementInViewport(ref: HTMLInputElement, topOffset = 400) {
//   const rect = ref.getBoundingClientRect();
//   return rect.bottom - rect.height - topOffset < 0 && rect.bottom > 0;
// }

const AnimatedPath: React.FC<{}> = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [pathState, setPathState] = useState({
    left: "20 20 20 800",
    right: "200 300 200 800 20 836 20 920",
  });
  const [ref, setRef] = useState<HTMLInputElement | null>(null);
  const pointsArr = [
    [20, 20],
    // [20, 260],
    // [20, 520],
    // [20, 800],
    [200, 300],
    // [200, 568],
    // [20, 836],
  ];

  const handlePath = () => {
    const offset = 20;
    const lh = 800;
    const calcLh = (scrollProgress * lh) / 100 - offset;
    setPathState((prevState) => ({
      ...prevState,
      left: `20 20 20 ${calcLh > offset ? calcLh : 21}`,
    }));
    console.log(scrollProgress);
    console.log(calcLh);
    console.log(pathState);
  };

  const onRefSet = useCallback((ref) => {
    setRef(ref);
  }, []);

  const handleScroll = () => {
    setScrollPosition(window.scrollY);
  };

  const throttledHandleScroll = useCallback(
    throttle(() => handleScroll(), 10),
    []
  );

  useEffect(() => {
    window.addEventListener("scroll", throttledHandleScroll);

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, []);

  useEffect(() => {
    if (ref) {
      const topOffset = window.innerHeight / 2;
      // if (isElementInViewport(ref, topOffset)) {
      const precent = getPrecent(ref, topOffset);
      // precent > scrollProgress &&
      setScrollProgress(precent);
      handlePath();
      // }
    }
  }, [scrollPosition, ref]);

  return (
    <div className="merge-path">
      <div className="merge-path_static">
        <img className="bg" src={blurredBg} alt="img" />
        <img className="path" src={staticPath} alt="img" />
      </div>
      <svg
        ref={onRefSet}
        viewBox="0 0 210 938"
        width="220"
        height="938"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline
          points={pathState.left}
          stroke="#191F32"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={24}
          style={{ transition: "1s" }}
        />
        <polyline
          points={pathState.left}
          stroke="#ffffff"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4 8"
          strokeWidth=".4"
          style={{ transition: "1s" }}
        />
        <polyline
          points={pathState.right}
          stroke="#191F32"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={24}
        />
        <polyline
          points={pathState.right}
          stroke="#ffffff"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4 8"
          strokeWidth=".4"
        />
        {pointsArr.map((point, index) => (
          <circle
            key={index}
            fill="#00FFA3"
            cx={point[0]}
            cy={point[1]}
            r="4"
          />
        ))}
      </svg>
    </div>
  );
};

export default AnimatedPath;
