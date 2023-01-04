import type { StaticImageData } from "next/legacy/image";
import Image from "next/legacy/image";
import type { FC, ReactNode } from "react";
import fireOwnSvg from "../assets/fire-own.svg";
import fireSlateusSvg from "../assets/fire-slateus.svg";
import type { TimeFrameNext } from "../time-frames";
import { displayLimitedTimeFrameMap, timeFramesNext } from "../time-frames";
import HoverTooltip from "./HoverTooltip";

export const Button: FC<{
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
  title?: string;
}> = ({ children, isActive, onClick, title }) => (
  <button
    className={`
      select-none
      rounded-sm border
      px-[10px] py-2
      font-roboto text-xs font-normal
      tracking-widest 
      ${
        isActive
          ? "border-slateus-400 bg-slateus-600 text-white"
          : "border-transparent text-slateus-200"
      }
    `}
    onClick={onClick}
    title={title}
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
  <div className="flex flex-row items-center lg:gap-x-1">
    {timeFramesNext.map((timeFrame) => (
      <HoverTooltip
        key={timeFrame}
        customAlign="-left-16"
        text={
          timeFrame === "since_burn"
            ? "since the London hard fork where EIP-1559 was activated"
            : undefined
        }
      >
        <Button
          isActive={selectedTimeframe === timeFrame}
          onClick={() => onSetTimeFrame(timeFrame)}
        >
          {timeFrame === "since_burn" ? (
            <>
              <div
                className={`
                  h-4 w-4
                  ${selectedTimeframe === "since_burn" ? "hidden" : "block"}
                `}
              >
                <Image
                  className={
                    selectedTimeframe === "since_burn" ? "hidden" : "block"
                  }
                  alt="flame emoji symbolizing time span since london hark fork when EIP-1559 was activated"
                  src={fireSlateusSvg as StaticImageData}
                  width={16}
                  height={16}
                />
              </div>
              <div
                className={`
                  h-4 w-4
                  ${selectedTimeframe === "since_burn" ? "block" : "hidden"}
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
      </HoverTooltip>
    ))}
  </div>
);

export default TimeFrameControl;
