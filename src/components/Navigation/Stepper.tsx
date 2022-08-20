import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import Link from "next/link";
import Steps from "./Steps";
import type { StepperPoint } from "../../context/StepperContext";
import { StepperContext } from "../../context/StepperContext";
import { TranslationsContext } from "../../translations-context";
import type { ActionLogo } from "./types";
import {
  getIconOffset,
  showHideNavBar,
  setScrollPosition,
  setNavBarPosition,
  MOBILE_VERTICAL_SCROLL_BREAK_POINT,
} from "./helpers";
import classes from "./Navigation.module.scss";

const Stepper: React.FC = () => {
  const t = React.useContext(TranslationsContext);
  const stepsRef = useRef<HTMLElement | null>(null);
  const steperIconRef = useRef<HTMLDivElement | null>(null);
  const stepperPoints = useContext(StepperContext);
  const [currentActionLogo, setCurrentActionLogo] =
    useState<ActionLogo>("none");
  const [pageLoad, setPageLoad] = useState(false);
  const handlerActionLogo = (value: ActionLogo) => setCurrentActionLogo(value);
  const controlPoints: StepperPoint[] = stepperPoints?.stepperElements
    ? Object.keys(stepperPoints.stepperElements).map((element) => {
        return stepperPoints?.stepperElements[element];
      })
    : [];

  const onScroll = useCallback(() => {
    const horizontalNavBar = stepsRef.current!;
    const stepperIconElem = steperIconRef.current!;
    showHideNavBar(controlPoints, horizontalNavBar);
    if (window.innerWidth <= MOBILE_VERTICAL_SCROLL_BREAK_POINT) {
      setNavBarPosition(
        horizontalNavBar,
        stepperIconElem,
        controlPoints,
        pageLoad,
      );
    } else {
      if (
        currentActionLogo !== "up" &&
        currentActionLogo !== "move" &&
        currentActionLogo !== "down"
      ) {
        const logoOffset = getIconOffset(controlPoints, pageLoad);
        stepperIconElem.style.left = `${logoOffset}%`;
        horizontalNavBar.style.left = "0";
      }
    }
  }, [currentActionLogo, controlPoints, pageLoad]);
  const [isLastTrackingElem, setIsLastTrackingElem] = useState<boolean>(false);
  const isDragging = useRef<boolean>(false);
  const setScrollPosOnLogoMove = (trackWidth: number, logoOffset: number) => {
    if (stepsRef.current && pageLoad && !isDragging.current) {
      isDragging.current = true;
      const isHighlightDot = setScrollPosition(
        controlPoints,
        trackWidth,
        logoOffset,
        stepsRef.current,
      );
      setIsLastTrackingElem(isHighlightDot);
      setTimeout(() => {
        isDragging.current = false;
      }, 200);
    }
  };

  useEffect(() => {
    setPageLoad(true);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);

  return (
    <nav
      ref={stepsRef}
      className={`${classes.mobileNavBarNav} ${classes.stepperNav} sticky top-0 left-0 w-full flex justify-between md:justify-start p-3 bg-blue-tangaroa z-50`}
    >
      <div className="w-full px-1 md:px-4 mx-auto flex flex-wrap items-center justify-between">
        <Steps
          onActionLogo={handlerActionLogo}
          activeLogo={currentActionLogo}
          ref={steperIconRef}
          controlPoints={controlPoints}
          setScroll={setScrollPosOnLogoMove}
          isLastTrackingElem={isLastTrackingElem}
        />
        <div
          className={`${classes.linkWrap} w-full md:w-3/12 hidden md:block py-1`}
        >
          <Link href="/">
            <a className="px-5 py-2 flex items-center font-medium text-sm  text-white hover:text-blue-shipcove border-white border-solid border-2 rounded-3xl hover:border-blue-shipcove">
              {t.landing_dashboard_link}
              <img className="ml-6" src={`/arrowRight.svg`} alt="arrow-right" />
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Stepper;
