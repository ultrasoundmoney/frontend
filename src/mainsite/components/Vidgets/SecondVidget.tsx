import React from "react";
import { followerCountConvert } from "../Helpers/helper";
import Card from "./card";
import type { SecondVidgetProps } from "./helpers";

const SecondVidget: React.FC<SecondVidgetProps> = ({ name, cost, number }) => {
  return (
    <Card name={name}>
      <div className="flex flex-wrap items-center justify-between">
        <div className="text-left font-roboto text-sm font-light text-white sm:text-base md:text-lg lg:text-base xl:text-21xl xl:leading-18">
          {followerCountConvert(cost)}
        </div>
        <div className="text-left font-roboto text-sm font-light text-mediumspring sm:text-base md:pl-8">
          +{Number(number).toFixed(2)}%
        </div>
      </div>
    </Card>
  );
};

export default SecondVidget;
