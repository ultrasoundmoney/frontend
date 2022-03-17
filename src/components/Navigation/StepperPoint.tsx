import React, { useContext } from "react";
import { StepperContext } from "../../context/StepperContext";

type StepperPointProps = {
  active: boolean;
  name: string;
  indexItem: number;
};

const StepperDots: React.FC<StepperPointProps> = ({
  active,
  name,
  indexItem,
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

      const windowHeight = window.innerHeight / 5;
      window.scrollTo(0, top - windowHeight);
    }
  };
  return (
    <div
      onClick={moveToPoint(indexItem)}
      style={{
        width: "16px",
      }}
      className="stepper_point relative flex flex-col items-center transition-opacity cursor-pointer h-full justify-center whitespace-nowrap text-xs text-center text-blue-shipcove hover:opacity-60"
    >
      <div
        className="stepper_circle"
        style={{
          display: "flex",
          justifyContent: "center",
          width: "16px",
          height: "16px",
          margin: "auto",
          borderRadius: "50%",
          position: "relative",
          border: `1px solid ${active ? "#00FFA3" : "#8991AD"}`,
        }}
      >
        <div
          style={{
            width: "6px",
            height: "6px",
            backgroundColor: active ? "#00FFA3" : "#8991AD",
            borderRadius: "50%",
            margin: "4px",
          }}
        ></div>
      </div>
      <div className="mt-1">{name}</div>
    </div>
  );
};

export default StepperDots;
