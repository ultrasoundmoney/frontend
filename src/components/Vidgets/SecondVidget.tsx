import React from "react";
import { followerCountConvert } from "../Helpers/helper";
import Card from "./card";
import type { SecondVidgetProps } from "./helpers";

const SecondVidget: React.FC<SecondVidgetProps> = ({ name, cost, number }) => {
  return (
    <Card name={name}>
      <div className="flex flex-wrap justify-between items-center">
        <div className="text-sm sm:text-base md:text-lg lg:text-base xl:text-21xl font-light text-white text-left xl:leading-18 font-roboto">
          {followerCountConvert(cost)}
        </div>
        <div className="md:pl-8 text-sm sm:text-base font-light text-mediumspring text-left font-roboto">
          +{Number(number).toFixed(2)}%
        </div>
      </div>
    </Card>
  );
};

export default SecondVidget;
