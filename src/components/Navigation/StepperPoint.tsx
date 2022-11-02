import React, { useContext, useRef, useEffect, useState } from "react";
import { StepperContext } from "../../contexts/StepperContext";
import type { StepperPointProps } from "./types";
import classes from "./StepperDots.module.scss";

const StepperDots: React.FC<StepperPointProps> = ({
  active,
  name,
  indexItem,
  actionLogo,
  positinLogo,
  onLogoOnDots,
}) => {
  const stepperPoints = useContext(StepperContext);
  const moveToPoint = (indexPoint: number) => () => {
    const objStepperElements = stepperPoints?.stepperElements;
    if (objStepperElements) {
      let top = 0;
      const currentKey = Object.keys(stepperPoints.stepperElements)[indexPoint];
      top = objStepperElements[currentKey]
        ? objStepperElements[currentKey].offsetY
        : 0;

      const windowHeight = window.innerHeight / 2.6;
      window.scrollTo(0, top - windowHeight);
    }
  };

  const textPoint = useRef<HTMLDivElement | null>(null);
  const [onElement, setOnElement] = useState(false);
  useEffect(() => {
    if (textPoint.current) {
      const cord = textPoint.current?.getBoundingClientRect();
      const isElement =
        cord && cord.left < positinLogo && cord.right > positinLogo;

      if (isElement && actionLogo === "up") {
        moveToPoint(indexItem)();
        setOnElement(false);
      }

      if (isElement && actionLogo === "move") {
        setOnElement(true);
      } else if (onElement && !isElement && actionLogo === "move") {
        setOnElement(false);
      }
    }
  }, [actionLogo, textPoint.current, positinLogo]);

  useEffect(() => onLogoOnDots(onElement), [onElement]);

  return (
    <div
      onClick={moveToPoint(indexItem)}
      className={`${classes.StepperDots} ${classes.stepperPoint} text-xs text-blue-shipcove transition-opacity`}
    >
      <div
        className={`${classes.StepperDots__stepperCircle} ${
          active ? classes.highlightedBorder : ""
        } ${classes.stepperCircle}`}
      >
        <div
          className={`${classes.StepperDots__stepperCircle_internal} ${
            active ? classes.highlightedBackground : ""
          }`}
        ></div>
      </div>
      <div
        className={`mt-1 ${indexItem % 2 && classes.StepperDots__labelUp}`}
        ref={textPoint}
      >
        {name}
      </div>
    </div>
  );
};

export default StepperDots;
