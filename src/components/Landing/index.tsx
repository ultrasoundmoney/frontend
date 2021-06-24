import * as React from "react";
import Navigation from "../Navigation";
import Intro from "./Intro";

const LandingPage: React.FC<{ Data?: Data }> = ({ Data }) => {
  return (
    <>
      <div className="wrapper bg-blue-midnightexpress">
        <div className="container m-auto">
          <Navigation Data={Data} />
          <Intro Data={Data} />
        </div>
      </div>
    </>
  );
};

export default LandingPage;
