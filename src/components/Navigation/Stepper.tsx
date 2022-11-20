import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import Link from "next/link";
import Steps from "./Steps";
import type { StepperPoint } from "../../contexts/StepperContext";
import { StepperContext } from "../../contexts/StepperContext";
import TranslationsContext from "../../contexts/TranslationsContext";
import type { ActionLogo } from "./types";
import {
  getIconOffset,
  showHideNavBar,
  setScrollPosition,
  setNavBarPosition,
  MOBILE_VERTICAL_SCROLL_BREAK_POINT,
} from "./helpers";
import classes from "./Navigation.module.scss";
import { NavigationContext } from "../../contexts/NavigationContext";

const Stepper: React.FC = () => {
  const t = React.useContext(TranslationsContext);
  const stepsRef = useRef<HTMLElement | null>(null);
  const steperIconRef = useRef<HTMLDivElement | null>(null);
  const stepperPoints = useContext(StepperContext);
  const { hidingNavigationPosition } = useContext(NavigationContext);

  const [currentActionLogo, setCurrentActionLogo] =
    useState<ActionLogo>("none");
  const [pageLoad, setPageLoad] = useState(false);
  const handlerActionLogo = (value: ActionLogo) => setCurrentActionLogo(value);
  const controlPoints: StepperPoint[] = stepperPoints?.stepperElements
    ? // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      (Object.keys(stepperPoints.stepperElements).map((element) => {
        return stepperPoints?.stepperElements[element];
      }) as StepperPoint[])
    : [];

  const onScroll = useCallback(() => {
    const horizontalNavBar = stepsRef.current!;
    const stepperIconElem = steperIconRef.current!;
    showHideNavBar(controlPoints, horizontalNavBar, hidingNavigationPosition);
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
      className={`${classes.mobileNavBarNav} ${classes.stepperNav} sticky top-0 left-0 z-50 flex w-full justify-between bg-slateus-700 p-3 md:justify-start`}
    >
      <div className="mx-auto flex w-full flex-wrap items-center justify-between px-1 md:px-4">
        <Steps
          onActionLogo={handlerActionLogo}
          activeLogo={currentActionLogo}
          ref={steperIconRef}
          controlPoints={controlPoints}
          setScroll={setScrollPosOnLogoMove}
          isLastTrackingElem={isLastTrackingElem}
        />
        <div
          className={`${classes.linkWrap} hidden w-full py-1 md:block md:w-3/12`}
        >
          <Link href="/dashboard" legacyBehavior>
            <a className="flex items-center rounded-3xl border-2 border-solid border-white  px-5 py-2 text-sm font-medium text-white hover:border-slateus-400 hover:text-blue-shipcove">
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
