import React, { useEffect, useRef, useState } from "react";
import TranslationsContext from "../../contexts/TranslationsContext";
import StepperPoint from "./StepperPoint";
import StepperTrack from "./StepperTrack";
import { motion } from "framer-motion";
import type { StepsProps, ControlPointMutated } from "./types";
import { MOBILE_VERTICAL_SCROLL_BREAK_POINT } from "./helpers";
import classes from "./Navigation.module.scss";

const Steps = React.forwardRef<HTMLDivElement | null, StepsProps>(
  (
    { controlPoints, onActionLogo, activeLogo, setScroll, isLastTrackingElem },
    ref,
  ) => {
    const [activeBalls, setActiveBalls] = useState<ControlPointMutated[]>();

    const getActiveBalls = React.useCallback(() => {
      const mapControlPoints: ControlPointMutated[] = controlPoints.map(
        (item) => {
          const activeValuePoint: boolean =
            (item?.offsetY &&
              window.scrollY > item.offsetY - window.innerHeight / 2.4) ||
            isLastTrackingElem;

          const namePoint: string = item?.name ? item.name : "";
          const offsetYPoint: number = item?.offsetY ? item.offsetY : 0;
          return {
            offsetY: offsetYPoint,
            name: namePoint,
            active: activeValuePoint,
          };
        },
      );
      return mapControlPoints;
    }, [controlPoints, isLastTrackingElem]);

    const t = React.useContext(TranslationsContext);
    useEffect(() => {
      const onScroll = () => {
        setActiveBalls(getActiveBalls());
      };
      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll);
    }, [getActiveBalls]);

    const trackWrapper = useRef<HTMLDivElement | null>(null);

    const [positinLogo, setPositinLogo] = useState(0);
    const [logoOnDots, setLogoOnDots] = useState(false);
    const handlerLogoOnDots = (value: boolean) => setLogoOnDots(value);
    useEffect(() => {
      if (
        typeof ref !== "object" ||
        !ref?.current ||
        typeof trackWrapper !== "object" ||
        !trackWrapper?.current
      ) {
        return;
      }

      const handleMoveLogo = (e: MouseEvent) => {
        const cord = trackWrapper.current?.getBoundingClientRect();
        const marginLeft = cord ? cord.left : 30;
        if (
          ref.current?.style &&
          typeof cord === "object" &&
          e.pageX > cord.left &&
          e.pageX < cord.right &&
          window.innerWidth > MOBILE_VERTICAL_SCROLL_BREAK_POINT
        ) {
          ref.current.style.left = `${e.pageX - marginLeft}px`;
          setScroll(cord.width, e.pageX + window.innerWidth * 0.022);
        }
        onActionLogo("move");
        setPositinLogo(e.pageX - marginLeft);
      };
      const handleUpLogo = () => {
        if (activeLogo !== "move" && activeLogo !== "none") {
          onActionLogo("up");
        } else {
          setTimeout(() => {
            onActionLogo("none");
          }, 500);
        }
        window.removeEventListener("pointermove", handleMoveLogo);
        window.removeEventListener("pointerup", handleUpLogo);
      };
      const handleDownLogo = (e: MouseEvent) => {
        e.preventDefault();
        onActionLogo("down");
        window.addEventListener("pointermove", handleMoveLogo);
        window.addEventListener("pointerup", handleUpLogo);
      };
      ref.current.addEventListener("pointerdown", handleDownLogo);
      return () => {
        if (typeof ref === "object" && ref?.current) {
          ref.current.removeEventListener("pointerdown", handleDownLogo);
        }
      };
    }, [ref, trackWrapper, logoOnDots, onActionLogo, setScroll, activeLogo]);

    return (
      <div className="relative flex h-full w-full items-center justify-around pt-5 md:w-9/12 lg:justify-around">
        <div className={`${classes.trackWrapper}`} ref={trackWrapper}>
          <motion.div
            ref={ref}
            style={{
              width: "fit-content",
              minWidth: "32px",
              willChange: "left",
              transform: "translateX(-50%)",
              position: "relative",
              zIndex: 1,
            }}
            transition={{ duration: 0 }}
            className={`absolute top-0 flex justify-center`}
          >
            <img
              style={{
                height: "32px",
                cursor: "ew-resize",
              }}
              draggable="true"
              src={`/ethereum-logo-2014-5.svg`}
              alt={t.title}
            />
          </motion.div>
        </div>
        <div className="flex w-full items-start justify-around">
          {activeBalls &&
            activeBalls.map((item, index) => {
              if (item) {
                if (index === controlPoints.length - 1) {
                  return (
                    <div className="flex h-full items-center" key={`${index}`}>
                      <StepperPoint
                        actionLogo={activeLogo}
                        positinLogo={positinLogo}
                        onLogoOnDots={handlerLogoOnDots}
                        name={item.name}
                        indexItem={index}
                        active={item.active}
                      />
                    </div>
                  );
                }
                return (
                  <div className="flex h-full w-full" key={`${index}`}>
                    <StepperPoint
                      actionLogo={activeLogo}
                      positinLogo={positinLogo}
                      onLogoOnDots={handlerLogoOnDots}
                      name={item.name}
                      indexItem={index}
                      active={item.active}
                    />
                    <StepperTrack />
                  </div>
                );
              }
            })}
        </div>
      </div>
    );
  },
);

Steps.displayName = "Steps";

export default Steps;
