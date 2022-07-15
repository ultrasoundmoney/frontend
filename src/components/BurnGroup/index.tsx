import { FC, useCallback, useState } from "react";
import { useGroupedAnalysis1 } from "../../api/grouped-analysis-1";
import { Unit } from "../../denomination";
import * as Format from "../../format";
import { TimeFrameNext, timeFramesNext } from "../../time-frames";
import BurnCategories from "../BurnCategories";
import BurnRecords from "../BurnRecords";
import BurnTotal from "../BurnTotal";
import DeflationaryStreak from "../DeflationaryStreak";
import BurnGauge from "../Gauges/BurnGauge";
import IssuanceGauge from "../Gauges/IssuanceGauge";
import SupplyGrowthGauge from "../Gauges/SupplyGrowthGauge";
import LatestBlocks from "../LatestBlocks";
import ToggleSwitch from "../ToggleSwitch";
import { WidgetTitle } from "../WidgetSubcomponents";
import BurnLeaderboard from "./BurnLeaderboard";
import CurrencyControl from "./controls/CurrencyControl";
import TimeFrameControl from "./controls/TimeFrameControl";

const WidgetGroup1: FC = () => {
  const [simulateMerge, setSimulateMerge] = useState(false);
  const baseFeePerGas = useGroupedAnalysis1()?.baseFeePerGas;
  const [timeFrame, setTimeFrame] = useState<TimeFrameNext>("d1");
  const [unit, setUnit] = useState<Unit>("eth");

  const handleSetTimeFrame = useCallback(setTimeFrame, [setTimeFrame]);

  const onSetUnit = useCallback(setUnit, [setUnit]);

  const toggleSimulateMerge = useCallback(() => {
    setSimulateMerge(!simulateMerge);
  }, [simulateMerge]);

  if (typeof window !== "undefined" && baseFeePerGas !== undefined) {
    document.title =
      Format.gweiFromWei(baseFeePerGas).toFixed(0) + " Gwei | ultrasound.money";
  }

  const handleClickTimeFrame = useCallback(() => {
    const currentTimeFrameIndex = timeFramesNext.indexOf(timeFrame);
    const nextIndex =
      currentTimeFrameIndex === timeFramesNext.length - 1
        ? 0
        : currentTimeFrameIndex + 1;

    setTimeFrame(timeFramesNext[nextIndex]);
  }, [timeFrame]);

  return (
    <div className="flex flex-col gap-4 px-4 md:px-16 ">
      <div>
        <div className="w-full flex flex-col md:flex-row md:gap-0 lg:gap-4 isolate">
          <div className="hidden md:block w-1/3">
            <BurnGauge timeFrame={timeFrame} unit={unit} />
          </div>
          <div className="md:w-1/3 scale-80">
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
        <div className="">
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
      </div>
      <div
        className={`
          grid grid-cols-1 lg:grid-cols-2
          gap-y-4 md:gap-x-4
        `}
      >
        <BurnTotal
          onClickTimeFrame={handleClickTimeFrame}
          simulateMerge={simulateMerge}
          timeFrame={timeFrame}
          unit={unit}
        />
        <div className="lg:col-start-2 lg:row-start-1 lg:row-end-5 lg:h-[684px] xl:h-[702px] flex flex-col gap-y-4">
          <BurnLeaderboard
            onClickTimeFrame={handleClickTimeFrame}
            timeFrame={timeFrame}
            unit={unit}
          />
          <BurnCategories
            onClickTimeFrame={handleClickTimeFrame}
            timeFrame={timeFrame}
          />
        </div>
        <div className="lg:row-start-2">
          <LatestBlocks unit={unit} />
        </div>
        <div className="lg:row-start-3">
          <DeflationaryStreak simulateMerge={simulateMerge} />
        </div>
        <div className="lg:row-end-5">
          <BurnRecords
            onClickTimeFrame={handleClickTimeFrame}
            timeFrame={timeFrame}
          />
        </div>
      </div>
    </div>
  );
};

export default WidgetGroup1;
