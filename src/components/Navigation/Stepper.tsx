import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import arrowRight from "../../assets/arrowRight.svg";
import Steps from "./Steps";
import { StepperContext, StepperPoint } from "../../context/StepperContext";
import { throttle } from "lodash";

export type ActionLogo = "none" | "down" | "move" | "up";

const getIconOffset = (
  pointsHeights: (StepperPoint | undefined)[],
  pageLoad: boolean
) => {
  if (!pageLoad) return 0;
  const trackPosition = window.scrollY + window.innerHeight / 2;
  if (pointsHeights) {
    const pointsQuantity = pointsHeights.length;
    const lastPoint = pointsHeights[pointsQuantity - 1];
    const distanceBetweenPoints = 100 / (pointsHeights.length - 1);
    let globalPercent = 0;

    if (lastPoint && trackPosition > lastPoint?.offsetY) return 100;
    for (let index = 0; index < pointsHeights.length; index++) {
      const nextPoint = pointsHeights[index + 1]?.offsetY;
      const currentPoint = pointsHeights[index]?.offsetY;
      if (
        currentPoint &&
        nextPoint &&
        trackPosition > currentPoint &&
        trackPosition < nextPoint
      ) {
        const from = trackPosition - currentPoint;
        const to = nextPoint - currentPoint;
        const percent = (from / to) * 100;
        globalPercent =
          distanceBetweenPoints * index +
          (percent * distanceBetweenPoints) / 100;
      }
    }
    return globalPercent;
  }
  return 0;
};

const Stepper: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollYProgress, setScrollYProgress] = useState(0);
  const stepsRef = useRef<HTMLElement | null>(null);
  const steperIconRef = useRef<HTMLDivElement | null>(null);
  const stepperPoints = useContext(StepperContext);
  const [currentActionLogo, setCurrentActionLogo] = useState<ActionLogo>(
    "none"
  );
  const handlerActionLogo = (value: ActionLogo) => setCurrentActionLogo(value);
  const controlPoints = Object.keys(stepperPoints?.stepperElements as {}).map(
    (element) => {
      return stepperPoints?.stepperElements[element];
    }
  );

  const onScroll = () => {
    setScrollYProgress(window.scrollY + window.innerHeight / 2);
  };

  const throttledScroll = throttle(onScroll, 300);

  const [pageLoad, setPageLoad] = useState(false);
  const memoizedValue = useMemo(() => getIconOffset(controlPoints, pageLoad), [
    controlPoints,
    pageLoad,
  ]);

  useEffect(() => {
    let offsetYFirstPoint = 2;
    controlPoints.forEach((el, index) => {
      if (index === 0 && typeof el?.offsetY === "number") {
        offsetYFirstPoint = el?.offsetY;
      }
    });

    const showStickyHeader: boolean =
      window.scrollY > offsetYFirstPoint - window.innerHeight / 2;
    showStickyHeader
      ? stepsRef.current?.classList.add("active")
      : stepsRef.current?.classList.remove("active");
    if (currentActionLogo !== "up" && steperIconRef && steperIconRef.current) {
      steperIconRef.current.style.left = `${memoizedValue}%`;
    }
  }, [controlPoints, scrollYProgress]);

  useEffect(() => {
    setPageLoad(true);
    window.addEventListener("scroll", throttledScroll);
    return () => {
      window.removeEventListener("scroll", throttledScroll);
    };
  }, []);

  return (
    <nav
      ref={stepsRef}
      className="stepper_nav sticky top-0 left-0 w-full flex justify-between md:justify-start p-3 bg-blue-tangaroa z-50"
    >
      <div className="w-full px-1 md:px-4 mx-auto flex flex-wrap items-center justify-between">
        <Steps
          onActionLogo={handlerActionLogo}
          activeLogo={currentActionLogo}
          currentPositionLogo={memoizedValue}
          ref={steperIconRef}
          controlPoints={controlPoints}
        />
        <div className="w-full md:w-3/12 hidden md:block py-1" id="menu">
          <ul className="flex flex-col md:flex-row justify-end list-none mt-4 md:mt-0 relative">
            <li className="nav-item lg:px-4 xl:px-8 justify-center">
              <a
                className="px-5 py-2 flex items-center font-medium text-sm  text-white hover:text-blue-shipcove border-white border-solid border-2 rounded-3xl hover:border-blue-shipcove"
                href="#join-the-fam"
              >
                Join The Community
                <img className="ml-6" src={arrowRight} alt="arrow-right" />
              </a>
            </li>
          </ul>
        </div>
        <div className="-mr-2 flex md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="hamburger-menu text-white cursor-pointer text-xl leading-none rounded bg-transparent block md:hidden outline-none focus:outline-none"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span className="sr-only" />
            {!isOpen ? (
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div
        className={
          "sidebar" + (isOpen ? " block sidebar-open" : " sidebar-close")
        }
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <ul className="inline-block list-none mt-4">
            <li className="my-4">
              <Link href="#faq">
                <a
                  className="text-center text-xs leading-snug text-blue-shipcove hover:opacity-75 hover:text-white"
                  href="#faq"
                >
                  FAQ
                </a>
              </Link>
            </li>
            <li className="my-4">
              <a
                className="px-3 py-2 flex justify-center font-medium text-sm  text-white hover:text-blue-shipcove border-white border-solid border-2 rounded-3xl hover:border-blue-shipcove"
                href="#join-the-fam"
              >
                Join The Community
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Stepper;
