import React from "react";
import Card from "./card";
import type { ThirdVidgetProps } from "./helpers";

const ThirdVidget: React.FC<ThirdVidgetProps> = ({ name, numberETHBlock }) => {
  return (
    <Card name={name}>
      <div className="text-left font-roboto text-sm font-light text-white sm:text-base md:text-lg lg:text-base xl:text-21xl xl:leading-18">
        {numberETHBlock} ETH/Block
      </div>
    </Card>
  );
};

export default ThirdVidget;
