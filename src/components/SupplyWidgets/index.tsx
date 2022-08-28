import { useCallback, useState } from "react";
import type { Unit } from "../../denomination";
import type { TimeFrameNext } from "../../time-frames";
import { timeFramesNext } from "../../time-frames";
import CurrencyControl from "../CurrencyControl";
import BurnGauge from "../Gauges/BurnGauge";
import IssuanceGauge from "../Gauges/IssuanceGauge";
import SupplyGrowthGauge from "../Gauges/SupplyGrowthGauge";
import SupplyView from "../SupplyView";
import TimeFrameControl from "../TimeFrameControl";
import ToggleSwitch from "../ToggleSwitch";
import { WidgetTitle } from "../WidgetSubcomponents";
import EquilibriumWidget from "./EquilibriumWidget";

const SupplyWidgets = () => {
  const [simulateMerge, setSimulateMerge] = useState(false);
  const [timeFrame, setTimeFrame] = useState<TimeFrameNext>("d1");
  const [unit, setUnit] = useState<Unit>("eth");

  const handleSetTimeFrame = useCallback(setTimeFrame, [setTimeFrame]);

  const onSetUnit = useCallback(setUnit, [setUnit]);

  const toggleSimulateMerge = useCallback(() => {
    setSimulateMerge(!simulateMerge);
  }, [simulateMerge]);

  const handleClickTimeFrame = useCallback(() => {
    const currentTimeFrameIndex = timeFramesNext.indexOf(timeFrame);
    const nextIndex =
      currentTimeFrameIndex === timeFramesNext.length - 1
        ? 0
        : currentTimeFrameIndex + 1;

    setTimeFrame(timeFramesNext[nextIndex]);
  }, [timeFrame]);

  return (
    <div className="flex flex-col gap-4 xs:px-4 md:px-16">
      <div>
        <div className="w-full flex flex-col md:flex-row isolate">
          <div className="hidden md:block w-1/3">
            <BurnGauge timeFrame={timeFrame} unit={unit} />
          </div>
          <div className="md:w-1/3">
            <SupplyGrowthGauge
              onClickTimeFrame={handleClickTimeFrame}
              simulateMerge={simulateMerge}
              timeFrame={timeFrame}
              toggleSimulateMerge={toggleSimulateMerge}
            />
          </div>
          <div className="hidden md:block w-1/3">
            <IssuanceGauge
              simulateMerge={simulateMerge}
              timeFrame={timeFrame}
              unit={unit}
            />
          </div>
        </div>
        <div className={`bg-blue-tangaroa rounded-bl-lg rounded-br-lg p-8`}>
          <div className="grid grid-cols-2 md:flex md:justify-between flex-col gap-y-8 md:flex-row lg:gap-y-0 ">
            <div className="row-start-1 flex flex-col gap-4 lg:gap-x-4 lg:flex-row lg:items-center">
              <WidgetTitle>time frame</WidgetTitle>
              <TimeFrameControl
                selectedTimeframe={timeFrame}
                onSetTimeFrame={handleSetTimeFrame}
              />
            </div>
            <div className="row-start-2 md:row-start-1 flex flex-col gap-y-4 lg:gap-x-4 lg:flex-row lg:items-center">
              <WidgetTitle>currency</WidgetTitle>
              <CurrencyControl selectedUnit={unit} onSetUnit={onSetUnit} />
            </div>
            <div className="row-start-2 md:row-start-1 flex flex-col gap-4 lg:flex-row lg:items-center text-right">
              <WidgetTitle>simulate merge</WidgetTitle>
              {/* On tablet the vertical alignment looks off without aligning the toggle with the neighboring controls */}
              <div className="flex items-center h-[34px] self-end">
                <ToggleSwitch
                  checked={simulateMerge}
                  onToggle={toggleSimulateMerge}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <EquilibriumWidget />
      <div className="w-full md:m-auto relative bg-blue-tangaroa px-2 md:px-4 xl:px-12 py-4 md:py-8 xl:py-12 rounded-xl">
        <SupplyView />
      </div>
    </div>
  );
};

export default SupplyWidgets;
