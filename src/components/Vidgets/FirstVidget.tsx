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
      <div className="text-left font-roboto text-xs font-light text-white sm:text-base md:text-lg lg:text-base xl:text-lg xl:leading-10">
        Money ({currentMoneyType})
      </div>
    </Card>
  );
};

export default FirstVidget;
