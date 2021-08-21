import { FC } from "react";

export type Timeframe = "t1h" | "t24h" | "t7d" | "t30d" | "tAll";

const defaultTimeframes: Timeframe[] = ["t1h", "t24h", "t7d", "t30d", "tAll"];

const timeframeOptionLabels: Record<Timeframe, string> = {
  t1h: "1h",
  t24h: "24h",
  t7d: "7d",
  t30d: "30d",
  tAll: "all",
};

type FeePeriodControlProps = {
  timeframe: Timeframe;
  timeframeOptions?: Timeframe[];
  onSetFeePeriod: (timeframe: Timeframe) => void;
};

const FeePeriodControl: FC<FeePeriodControlProps> = ({
  timeframe,
  timeframeOptions = defaultTimeframes,
  onSetFeePeriod,
}) => {
  const activePeriodClasses =
    "text-white border-blue-highlightborder rounded-sm bg-blue-highlightbg";

  return (
    <div className="flex flex-row items-center">
      {timeframeOptions.map((t) => (
        <button
          key={t}
          className={`font-inter text-sm px-4 py-1 border border-transparent ${
            timeframe === t ? activePeriodClasses : "text-blue-manatee"
          }`}
          onClick={() => onSetFeePeriod(t)}
        >
          {timeframeOptionLabels[t]}
        </button>
      ))}
    </div>
  );
};

export default FeePeriodControl;
