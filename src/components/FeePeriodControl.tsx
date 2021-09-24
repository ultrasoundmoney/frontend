import { FC } from "react";

export type Timeframe = "5m" | "1h" | "24h" | "7d" | "30d" | "all";

type FeePeriodControlProps = {
  timeframes: string[];
  selectedTimeframe: string;
  onSetFeePeriod: (timeframe: string) => void;
};

const FeePeriodControl: FC<FeePeriodControlProps> = ({
  timeframes,
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
          className={`font-inter text-sm px-3 py-1 border border-transparent ${
            selectedTimeframe === timeframe
              ? activePeriodClasses
              : "text-blue-manatee"
          }`}
          onClick={() => onSetFeePeriod(timeframe)}
        >
          {timeframe}
        </button>
      ))}
    </div>
  );
};

export default FeePeriodControl;
