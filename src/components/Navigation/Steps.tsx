import React, { useEffect, useRef, useState } from "react";
import EthLogo from "../../assets/ethereum-logo-2014-5.svg";
import { TranslationsContext } from "../../translations-context";
import StepperPoint from "./StepperPoint";
import StepperTrack from "./StepperTrack";
import { motion } from "framer-motion";
import { StepsProps, ControlPointMutated } from "./types";

const Steps = React.forwardRef<HTMLDivElement | null, StepsProps>(
  (
    {
      controlPoints,
      currentPositionLogo,
      onActionLogo,
      activeLogo,
      setScroll,
      isLastTrackingElem,
    },
    ref
  ) => {
    const [activeBalls, setActiveBalls] = useState<ControlPointMutated[]>();

    const getActiveBalls: any = React.useCallback(() => {
      return controlPoints.map((item) => {
        if (item) {
          return {
            ...item,
            active:
              window.scrollY > item.offsetY - window.innerHeight / 2 ||
              isLastTrackingElem,
          };
        }
      });
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
        const marginLeft = cord ? cord.left : 50;
        if (
          ref.current?.style &&
          typeof cord === "object" &&
          e.pageX > cord.left &&
          e.pageX < cord.right
        ) {
          ref.current.style.left = `${e.pageX - marginLeft}px`;
          setScroll(cord.width, e.pageX - marginLeft);
        }
        onActionLogo("move");
        setPositinLogo(e.pageX);
      };
      const handleUpLogo = () => {
        onActionLogo("up");
        if (!logoOnDots && ref.current?.style) {
          setTimeout(() => onActionLogo("none"), 800);
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
    }, [
      ref,
      trackWrapper,
      currentPositionLogo,
      logoOnDots,
      onActionLogo,
      setScroll,
    ]);

    return (
      <div className="w-full h-full md:w-9/12 relative flex justify-around lg:justify-around items-center">
        <div className="track_wrapper" ref={trackWrapper}>
          <motion.div
            ref={ref}
            style={{
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
              src={EthLogo}
              alt={t.title}
            />
          </motion.div>
        </div>
        <div className="flex w-full justify-around items-start">
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
                  <div className="flex w-full h-full" key={`${index}`}>
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
  }
);

Steps.displayName = "Steps";

export default Steps;
