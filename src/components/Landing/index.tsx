import * as React from "react";
import Navigation from "../Navigation";
import Intro from "./Intro";

const LandingPage: React.FC<{}> = () => {
  return (
    <>
      <div className="wrapper bg-blue-midnightexpress">
        <div className="container m-auto">
          <Navigation />
          <Intro />
        </div>
      </div>
    </>
  );
};

export default LandingPage;
