import { FC } from "react";

export const timeframes = ["5m", "1h", "24h", "7d", "30d", "all"] as const;
export type Timeframe = typeof timeframes[number];

export const displayTimeframeMap: Record<Timeframe, string> = {
  "5m": "5m",
  "1h": "1h",
  "24h": "1d",
  "7d": "7d",
  "30d": "30d",
  all: "all",
};

type FeePeriodControlProps = {
  selectedTimeframe: Timeframe;
  onSetFeePeriod: (timeframe: Timeframe) => void;
};

const FeePeriodControl: FC<FeePeriodControlProps> = ({
  selectedTimeframe,
  onSetFeePeriod,
}) => {
  const activePeriodClasses =
    "text-white border-blue-highlightborder rounded-sm bg-blue-highlightbg";

  return (
    <div className="flex flex-row items-center">
      {timeframes.map((timeframe) => (
        <button
          key={timeframe}
          className={`font-roboto text-sm lg:text-lg px-3 py-1 border border-transparent ${
            selectedTimeframe === timeframe
              ? activePeriodClasses
              : "text-blue-manatee"
          }`}
          onClick={() => onSetFeePeriod(timeframe)}
        >
          {displayTimeframeMap[timeframe]}
        </button>
      ))}
    </div>
  );
};

export default FeePeriodControl;
