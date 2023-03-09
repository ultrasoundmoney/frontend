import React from "react";

const StepperTrack = () => (
  <div
    className="h-full w-full"
    style={{
      marginTop: 8,
      height: 1,
      backgroundImage: "linear-gradient(to right, grey 40%, transparent 40%)",
      backgroundSize: "10px 1px",
      backgroundRepeat: "repeat-x",
    }}
  />
);

export default StepperTrack;
