import type { FC, ReactNode } from "react";
import type { TimeFrameNext } from "../time-frames";
import { displayTimeFrameNextMap, timeFramesNext } from "../time-frames";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import fireSlateusSvg from "../assets/fire-slateus.svg";
import fireOwnSvg from "../assets/fire-own.svg";

export const Button: FC<{
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ children, isActive, onClick }) => (
  <button
    className={`
      select-none border
      px-[10px] py-2
      font-roboto text-xs font-light
      md:tracking-widest
      [@media(min-width:354px)]:px-3
      ${
        isActive
          ? "rounded-sm border-blue-highlightborder bg-blue-highlightbg text-white"
          : "border-transparent text-blue-spindle"
      }
    `}
    onClick={onClick}
  >
    {children}
  </button>
);

type Props = {
  onSetTimeFrame: (timeframe: TimeFrameNext) => void;
  selectedTimeframe: TimeFrameNext;
  topCornersRounded?: boolean;
};

const TimeFrameControl: FC<Props> = ({ selectedTimeframe, onSetTimeFrame }) => (
  <div className="flex flex-row items-baseline lg:gap-x-1">
    {timeFramesNext.map((timeFrame) => (
      <Button
        key={timeFrame}
        isActive={selectedTimeframe === timeFrame}
        onClick={() => onSetTimeFrame(timeFrame)}
      >
        {timeFrame === "all" && selectedTimeframe !== "all" ? (
          <Image
            alt="flame emoji symbolizing time span since london hark fork when EIP-1559 was activated"
            src={fireSlateusSvg as StaticImageData}
            width={12}
            height={12}
          />
        ) : timeFrame === "all" && selectedTimeframe === "all" ? (
          <Image
            alt="flame emoji symbolizing time span since london hark fork when EIP-1559 was activated"
            src={fireOwnSvg as StaticImageData}
            width={12}
            height={12}
          />
        ) : (
          displayTimeFrameNextMap[timeFrame]
        )}
      </Button>
    ))}
  </div>
);

export default TimeFrameControl;
