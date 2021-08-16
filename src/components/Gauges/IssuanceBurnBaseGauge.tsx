import CountUp from "react-countup";
import { FC, memo } from "react";
import GaugeSvg from "./GaugeSvg";
import SpanMoji from "../SpanMoji";
import colors from "../../colors";

type BaseGuageProps = {
  title: string;
  value: number;
  valueFillColor?: string;
  needleColor?: string;
  emoji: string;
};

const BaseGuage: FC<BaseGuageProps> = ({
  title,
  value,
  valueFillColor = colors.spindle,
  needleColor,
  emoji,
}) => {
  const min = 0;
  const max = 6;

  return (
    <>
      <SpanMoji className="leading-10 text-4xl" emoji={emoji} />
      <div className="mt-6 md:mt-2 mt-6 transform scale-100 md:scale-75 lg:scale-100 xl:scale-110">
        <GaugeSvg
          progress={value / (max - min)}
          progressFillColor={valueFillColor}
          needleColor={needleColor}
        />
        <div className="font-roboto text-white text-center font-light 2xl:text-lg -mt-20 pt-1">
          <p className="-mb-2">
            <CountUp
              decimals={1}
              duration={0.8}
              separator=","
              end={value}
              preserveValue={true}
              suffix="M"
            />
          </p>
          <p className="font-extralight text-blue-spindle">ETH/year</p>
          <div className="-mt-2">
            <span className="float-left">{min}M</span>
            <span className="float-right">{max}M</span>
          </div>
        </div>
      </div>
      <p className="font-inter font-light uppercase text-blue-spindle text-md text-center mt-6 md:mt-2 mt-6">
        {title}
      </p>
    </>
  );
};

export default memo(BaseGuage);
