import { FC } from "react";

export type Timeframe = "1h" | "24h" | "7d" | "30d" | "all";

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
          className={`font-inter text-sm px-4 py-1 border border-transparent ${
            selectedTimeframe === timeframe
              ? activePeriodClasses
              : "text-blue-manatee"
          }`}
          onClick={() => onSetFeePeriod(timeframe)}
        >
          {timeframe}
        </button>
      ))}
      {/* <button */}
      {/*   className={`font-inter text-sm px-4 py-1 border border-transparent ${ */}
      {/*     timeframe === "t24h" ? activePeriodClasses : "text-blue-manatee" */}
      {/*   }`} */}
      {/*   onClick={() => onSetFeePeriod("t24h")} */}
      {/* > */}
      {/*   24h */}
      {/* </button> */}
      {/* <button */}
      {/*   className={`font-inter text-sm px-4 py-1 border border-transparent ${ */}
      {/*     timeframe === "t7d" ? activePeriodClasses : "text-blue-manatee" */}
      {/*   }`} */}
      {/*   onClick={() => onSetFeePeriod("t7d")} */}
      {/* > */}
      {/*   7d */}
      {/* </button> */}
      {/* <button */}
      {/*   className={`font-inter text-sm px-4 py-1 border border-transparent ${ */}
      {/*     timeframe === "t30d" ? activePeriodClasses : "text-blue-manatee" */}
      {/*   }`} */}
      {/*   onClick={() => onSetFeePeriod("t30d")} */}
      {/* > */}
      {/*   30d */}
      {/* </button> */}
      {/* <button */}
      {/*   className={`font-inter text-sm px-4 py-1 border border-transparent ${ */}
      {/*     timeframe === "tAll" ? activePeriodClasses : "text-blue-manatee" */}
      {/*   }`} */}
      {/*   onClick={() => onSetFeePeriod("tAll")} */}
      {/* > */}
      {/*   all */}
      {/* </button> */}
    </div>
  );
};

export default FeePeriodControl;
