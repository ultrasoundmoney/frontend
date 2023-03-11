import type { StaticImageData } from "next/legacy/image";
import Image from "next/legacy/image";
import type { FC, ReactNode } from "react";
import fireOwnSvg from "../assets/fire-own.svg";
import fireSlateusSvg from "../assets/fire-slateus.svg";
import pandaOwnSvg from "../assets/panda-own.svg";
import pandaSlateusSvg from "../assets/panda-slateus.svg";
import type { TimeFrame } from "../mainsite/time-frames";
import {
  displayLimitedTimeFrameMap,
  timeFrames,
  timeFramesNoMerge,
} from "../mainsite/time-frames";
import HoverTooltip from "../mainsite/components/HoverTooltip";

const Button: FC<{
  children: ReactNode;
  disabled?: boolean;
  isActive: boolean;
  onClick: () => void;
  title?: string;
}> = ({ children, isActive, onClick, title, disabled }) => (
  <button
    className={`
      select-none rounded-sm
      border px-[10px] py-2
      font-roboto 
      text-xs
      font-normal
      tracking-widest
      ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
      ${
        isActive && !disabled
          ? "border-slateus-400 bg-slateus-600 text-white"
          : "border-transparent text-slateus-200"
      }
    `}
    onClick={disabled ? undefined : onClick}
    title={disabled ? "not yet available" : undefined}
  >
    {children}
  </button>
);

export const LondonHardForkTooltip: FC<{
  children: ReactNode;
  zLevel?: string;
  timeFrame: TimeFrame;
}> = ({ children, timeFrame, zLevel }) => (
  <HoverTooltip
    customAlign="-left-32"
    text={
      timeFrame === "since_burn"
        ? "Since-burn time frame. Starting from the london hard fork where EIP-1559 was activated."
        : undefined
    }
    zLevel={zLevel}
  >
    {children}
  </HoverTooltip>
);

const FireImage: FC<{ selectedTimeframe: TimeFrame }> = ({
  selectedTimeframe,
}) => (
  <>
    <div
      className={`
        h-4 w-4
        ${selectedTimeframe === "since_burn" ? "hidden" : "block"}
      `}
    >
      <Image
        className={selectedTimeframe === "since_burn" ? "hidden" : "block"}
        alt="flame emoji symbolizing time span since london hard fork when EIP-1559 was activated"
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
        alt="flame emoji symbolizing time span since london hard fork when EIP-1559 was activated"
        src={fireOwnSvg as StaticImageData}
        width={16}
        height={16}
      />
    </div>
  </>
);

const PandaImage: FC<{ selectedTimeframe: TimeFrame }> = ({
  selectedTimeframe,
}) => (
  <>
    <div
      className={`
        h-4 w-4
        ${selectedTimeframe === "since_merge" ? "hidden" : "block"}
      `}
    >
      <Image
        className={selectedTimeframe === "since_merge" ? "hidden" : "block"}
        alt="panda emoji symbolizing the time span since the merge happened"
        src={pandaSlateusSvg as StaticImageData}
        width={16}
        height={16}
      />
    </div>
    <div
      className={`
        h-4 w-4
        ${selectedTimeframe === "since_merge" ? "block" : "hidden"}
      `}
    >
      <Image
        alt="panda emoji symbolizing the time span since the merge happened"
        src={pandaOwnSvg as StaticImageData}
        width={16}
        height={16}
      />
    </div>
  </>
);

const TimeFrameControlCensorship: FC<{
  selectedTimeFrame: TimeFrame;
  onSetTimeFrame: (timeFrame: TimeFrame) => void;
}> = ({ selectedTimeFrame, onSetTimeFrame }) => (
  <div className="flex flex-row items-center lg:gap-x-1">
    {(["d1", "d7", "d30", "since_merge"] as const).map((timeFrame) => (
      <LondonHardForkTooltip key={timeFrame} timeFrame={timeFrame}>
        <Button
          isActive={selectedTimeFrame === timeFrame}
          onClick={() => onSetTimeFrame(timeFrame)}
          disabled={timeFrame === "since_merge" || timeFrame === "d1"}
        >
          {timeFrame === "since_merge" ? (
            <PandaImage selectedTimeframe={selectedTimeFrame} />
          ) : (
            displayLimitedTimeFrameMap[timeFrame]
          )}
        </Button>
      </LondonHardForkTooltip>
    ))}
  </div>
);

type Props = {
  mergeEnabled?: boolean;
  onSetTimeFrame: (timeframe: TimeFrame) => void;
  selectedTimeFrame: TimeFrame;
  topCornersRounded?: boolean;
  version?: "all" | "censorship" | "no_merge";
};

const TimeFrameControl: FC<Props> = ({
  selectedTimeFrame: selectedTimeframe,
  onSetTimeFrame,
  version = "all",
}) =>
  version === "censorship" ? (
    <TimeFrameControlCensorship
      selectedTimeFrame={selectedTimeframe}
      onSetTimeFrame={onSetTimeFrame}
    />
  ) : (
    <div className="flex flex-row items-center lg:gap-x-1">
      {(version === "all"
        ? timeFrames
        : version === "no_merge"
        ? timeFramesNoMerge
        : (undefined as never)
      ).map((timeFrame) => (
        <LondonHardForkTooltip key={timeFrame} timeFrame={timeFrame}>
          <Button
            isActive={selectedTimeframe === timeFrame}
            onClick={() => onSetTimeFrame(timeFrame)}
          >
            {timeFrame === "since_merge" ? (
              <PandaImage selectedTimeframe={selectedTimeframe} />
            ) : timeFrame === "since_burn" ? (
              <FireImage selectedTimeframe={selectedTimeframe} />
            ) : (
              displayLimitedTimeFrameMap[timeFrame]
            )}
          </Button>
        </LondonHardForkTooltip>
      ))}
    </div>
  );

export default TimeFrameControl;
