import React from "react";
import Card from "./card";
import type { FirstVidgetProps } from "./helpers";
import { convertDateStringReadable } from "./helpers";

const FirstVidget: React.FC<FirstVidgetProps> = ({
  date,
  currentMoneyType,
}) => {
  return (
    <Card name={`Status ${convertDateStringReadable(date)}`}>
      <div className="text-xs sm:text-base md:text-lg lg:text-base xl:text-lg font-light text-white text-left xl:leading-10 font-roboto">
        Money ({currentMoneyType})
      </div>
    </Card>
  );
};

export default FirstVidget;
