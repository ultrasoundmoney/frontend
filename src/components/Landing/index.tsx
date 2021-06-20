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
          <div className="flex">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam,
              ducimus ipsam beatae veniam esse nisi perspiciatis iste accusamus
              aliquid culpa. Voluptatem repellendus ut quibusdam sed pariatur
              esse ipsam voluptates quod.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
