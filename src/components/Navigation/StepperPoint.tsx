import React from "react";

type StepperPointProps = {
  active: boolean;
  name: string;
};

const StepperPoint: React.FC<StepperPointProps> = ({ active, name }) => {
  return (
    <div className="relative h-full justify-center w-24 text-xs text-center text-blue-shipcove">
      <div
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

export default StepperPoint;
