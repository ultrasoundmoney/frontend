import { FC } from "react";

export type Timeframe = "t1h" | "t24h" | "t7d" | "t30d" | "tAll";

type FeePeriodControlProps = {
  timeframe: Timeframe;
  onSetFeePeriod: (timeframe: Timeframe) => void;
};

const FeePeriodControl: FC<FeePeriodControlProps> = ({
  timeframe,
  onSetFeePeriod,
}) => {
  const activePeriodClasses =
    "text-white border-blue-highlightborder rounded-sm bg-blue-highlightbg";

  return (
    <div className="flex flex-row items-center mx-auto mb-4 md:m-0">
      <button
        className={`font-inter text-sm px-4 py-1 border border-transparent ${
          timeframe === "t1h" ? activePeriodClasses : "text-blue-manatee"
        }`}
        onClick={() => onSetFeePeriod("t1h")}
      >
        1h
      </button>
      <button
        className={`font-inter text-sm px-4 py-1 border border-transparent ${
          timeframe === "t24h" ? activePeriodClasses : "text-blue-manatee"
        }`}
        onClick={() => onSetFeePeriod("t24h")}
      >
        24h
      </button>
      <button
        className={`font-inter text-sm px-4 py-1 border border-transparent ${
          timeframe === "t7d" ? activePeriodClasses : "text-blue-manatee"
        }`}
        onClick={() => onSetFeePeriod("t7d")}
      >
        7d
      </button>
      <button
        className={`font-inter text-sm px-4 py-1 border border-transparent ${
          timeframe === "t30d" ? activePeriodClasses : "text-blue-manatee"
        }`}
        onClick={() => onSetFeePeriod("t30d")}
      >
        30d
      </button>
      <button
        className={`font-inter text-sm px-4 py-1 border border-transparent ${
          timeframe === "tAll" ? activePeriodClasses : "text-blue-manatee"
        }`}
        onClick={() => onSetFeePeriod("tAll")}
      >
        all
      </button>
    </div>
  );
};

export default FeePeriodControl;
