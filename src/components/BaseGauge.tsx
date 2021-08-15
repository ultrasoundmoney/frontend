import CountUp from "react-countup";
import { FC, memo } from "react";
import Speedometer from "./Speedometer";
import colors from "../colors";

type BaseGuageProps = {
  title: string;
  value: number;
  valueFillColor?: string;
};

const normalize = (min: number, max: number, value: number): number => {
  return value / (max - min);
};

const BaseGuage: FC<BaseGuageProps> = ({
  title,
  value,
  valueFillColor = colors.spindle,
}) => {
  const min = 0;
  const max = 12;

  return (
    <div className="flex flex-col justify-start items-center bg-blue-tangaroa px-4 md:px-0 py-4 rounded-lg">
      <div className="md:w-9 md:h-9" />
      {/* <div className="transform md:scale-75 md:-mt-16 lg:scale-90 lg:-mt-4"> */}
      <div className="relative transform md:scale-gauge-md md:-mt-16 md:-mx-8 lg:scale-90 lg:-mt-4 xl:scale-100">
        <span className="absolute left-8 top-48 font-roboto font-light text-blue-spindle">
          {min}
        </span>
        <Speedometer
          innerRadius={100}
          progress={normalize(min, max, value)}
          progressFillColor={valueFillColor}
        ></Speedometer>
        <span className="absolute right-6 top-48 font-roboto font-light text-blue-spindle">
          {max}
        </span>
      </div>
      <p className="relative font-roboto font-light text-white text-center text-lg -mt-24">
        <CountUp
          decimals={2}
          duration={1}
          separator=","
          end={value}
          preserveValue={true}
        />
        <span className="font-extralight text-blue-spindle pl-2">ETH/min</span>
      </p>
      <p className="relative font-inter font-light uppercase text-blue-spindle text-md text-center mt-8 md:mt-4 z-10">
        {title}
      </p>
    </div>
  );
};

export default memo(BaseGuage);
