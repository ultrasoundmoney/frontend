import React from "react";
import staticPath from "../../assets/lines-bg.svg";
import blurredBg from "../../assets/blurred-bg1.svg";

const AnimatedPath: React.FC<{}> = () => {
  return (
    <div className="merge-path">
      <div className="merge-path_static">
        <img className="bg" src={blurredBg} alt="img" />
        <img className="path" src={staticPath} alt="img" />
      </div>
    </div>
  );
};

export default AnimatedPath;
