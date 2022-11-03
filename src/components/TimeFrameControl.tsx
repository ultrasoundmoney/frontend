import type { FC, ReactNode } from "react";
import type { TimeFrame } from "../time-frames";
import { displayLimitedTimeFrameMap, timeFrames } from "../time-frames";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import fireSlateusSvg from "../assets/fire-slateus.svg";
import fireOwnSvg from "../assets/fire-own.svg";

export const Button: FC<{
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
  title?: string;
}> = ({ children, isActive, onClick, title }) => (
  <button
    className={`
      select-none border
      px-[10px] py-2
      font-roboto text-xs
      font-normal
      tracking-widest
      ${
        isActive
          ? "rounded-sm border-blue-highlightborder bg-blue-highlightbg text-white"
          : "border-transparent text-blue-spindle"
      }
    `}
    onClick={onClick}
    title={title}
  >
    {children}
  </button>
);

type Props = {
  onSetTimeFrame: (timeframe: TimeFrame) => void;
  selectedTimeframe: TimeFrame;
  topCornersRounded?: boolean;
};

const TimeFrameControl: FC<Props> = ({ selectedTimeframe, onSetTimeFrame }) => (
  <div className="flex flex-row items-center lg:gap-x-1">
    {timeFrames.map((timeFrame) => (
      <Button
        key={timeFrame}
        isActive={selectedTimeframe === timeFrame}
        onClick={() => onSetTimeFrame(timeFrame)}
        title={
          timeFrame === "all"
            ? "since London hark fork where EIP-1559 was activated"
            : undefined
        }
      >
        {timeFrame === "all" ? (
          <>
            <div
              className={`
                h-4 w-4
                ${selectedTimeframe === "all" ? "hidden" : "block"}
              `}
            >
              <Image
                className={selectedTimeframe === "all" ? "hidden" : "block"}
                alt="flame emoji symbolizing time span since london hark fork when EIP-1559 was activated"
                src={fireSlateusSvg as StaticImageData}
                width={16}
                height={16}
              />
            </div>
            <div
              className={`
                h-4 w-4
                ${selectedTimeframe === "all" ? "block" : "hidden"}
              `}
            >
              <Image
                alt="flame emoji symbolizing time span since london hark fork when EIP-1559 was activated"
                src={fireOwnSvg as StaticImageData}
                width={16}
                height={16}
              />
            </div>
          </>
        ) : (
          displayLimitedTimeFrameMap[timeFrame]
        )}
      </Button>
    ))}
  </div>
);

export default TimeFrameControl;
