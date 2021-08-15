import CountUp from "react-countup";
import { FC, memo } from "react";
import GaugeSvg from "./GaugeSvg";
import colors from "../../colors";

type BaseGuageProps = {
  title: string;
  value: number;
  valueFillColor?: string;
};

const BaseGuage: FC<BaseGuageProps> = ({
  title,
  value,
  valueFillColor = colors.spindle,
}) => {
  const min = 0;
  const max = 12;

  return (
    <>
      <div className="md:w-9 md:h-9" />
      <div className="relative transform md:scale-gauge-md md:-mt-12 lg:-mt-0 lg:scale-100">
        <span className="absolute left-8 top-44 font-roboto font-light text-blue-spindle">
          {min}
        </span>
        <GaugeSvg
          progress={value / (max - min)}
          progressFillColor={valueFillColor}
        />
        <span className="absolute right-6 top-44 font-roboto font-light text-blue-spindle">
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
      </p>
      <span className="relative font-extralight text-blue-spindle">
        ETH/min
      </span>
      <p className="relative font-inter font-light uppercase text-blue-spindle text-md text-center mt-4">
        {title}
      </p>
    </>
  );
};

export default memo(BaseGuage);
