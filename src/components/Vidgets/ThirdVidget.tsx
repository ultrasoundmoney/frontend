import React from "react";
import Card from "./card";
import { ThirdVidgetProps } from "./helpers";

const ThirdVidget: React.FC<ThirdVidgetProps> = ({ name, numberETHBlock }) => {
  return (
    <Card name={name}>
      <div className="text-sm sm:text-base md:text-lg lg:text-base xl:text-21xl xl:leading-18 font-light text-white text-left font-roboto">
        {numberETHBlock} ETH/Block
      </div>
    </Card>
  );
};

export default ThirdVidget;
