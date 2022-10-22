import type { FC, ReactNode } from "react";
import type { TimeFrameNext } from "../time-frames";
import { displayTimeFrameNextMap, timeFramesNext } from "../time-frames";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import flameSvg from "../assets/flame-slateus.svg";

export const Button: FC<{
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ children, isActive, onClick }) => (
  <button
    className={`
      font-roboto font-light
      text-xs md:tracking-widest
      px-[10px] [@media(min-width:354px)]:px-3 py-2
      select-none
      border
      ${
        isActive
          ? "text-white bg-blue-highlightbg border-blue-highlightborder rounded-sm"
          : "text-blue-spindle border-transparent"
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
        {timeFrame === "all" ? (
          <Image
            alt="flame emoji symbolizing time span since london hark fork when EIP-1559 was activated"
            src={flameSvg as StaticImageData}
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
