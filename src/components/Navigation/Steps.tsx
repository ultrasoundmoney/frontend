import React, { useEffect, useRef } from "react";
import EthLogo from "../../assets/ethereum-logo-2014-5.svg";
import { TranslationsContext } from "../../translations-context";
import StepperPoint from "./StepperPoint";
import StepperTrack from "./StepperTrack";
import { motion } from "framer-motion";

type ControlPoint = {
  offsetY: number;
  name: string;
};

type ControlPointMutated = {
  offsetY: number;
  name: string;
  active: boolean;
};

type StepsProps = {
  controlPoints: (ControlPoint | undefined)[];
  currentPositionLogo: number;
};

const Steps = React.forwardRef<HTMLDivElement | null, StepsProps>(
  ({ controlPoints, currentPositionLogo }, ref) => {
    const [activeBalls, setActiveBalls] = React.useState<
      (ControlPointMutated | undefined)[] | undefined
    >();

    const getActiveBalls = React.useCallback(() => {
      return controlPoints.map((item) => {
        if (item) {
          return {
            ...item,
            active: window.scrollY > item.offsetY - window.innerHeight / 2,
          };
        }
      });
    }, [controlPoints]);

    const t = React.useContext(TranslationsContext);
    React.useEffect(() => {
      const onScroll = () => {
        setActiveBalls(getActiveBalls());
      };
      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll);
    }, [getActiveBalls]);

    const trackWrapper = useRef<HTMLDivElement | null>(null);
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
        }
      };
      const handleUpLogo = () => {
        if (ref.current?.style) {
          ref.current.style.transition = ".4s";
          setTimeout(() => {
            if (!ref.current?.style) return;
            ref.current.style.left = `${currentPositionLogo}%`;
          }, 200);
          setTimeout(() => {
            if (!ref.current?.style) return;
            ref.current.style.transition = "0s";
          }, 800);
        }
        window.removeEventListener("pointermove", handleMoveLogo);
        window.removeEventListener("pointerup", handleUpLogo);
      };
      const handleDownLogo = (e: MouseEvent) => {
        e.preventDefault();
        window.addEventListener("pointermove", handleMoveLogo);
        window.addEventListener("pointerup", handleUpLogo);
      };
      ref.current.addEventListener("pointerdown", handleDownLogo);
      return () => {
        if (typeof ref === "object" && ref?.current) {
          ref.current.removeEventListener("pointerdown", handleDownLogo);
        }
      };
    }, [ref, trackWrapper, currentPositionLogo]);

    return (
      <div className="w-full h-full md:w-9/12 relative flex justify-around lg:justify-around items-center">
        <div className="track_wrapper" ref={trackWrapper}>
          <motion.div
            ref={ref}
            style={{
              minWidth: "32px",
              willChange: "left",
              transform: "translateX(-50%)",
            }}
            transition={{ duration: 0 }}
            className={`absolute top-0 flex justify-center`}
          >
            <img
              style={{ height: "32px", cursor: "ew-resize" }}
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
