import React, { FC, useCallback, useState } from "react";
import { useGroupedData1 } from "../../api/grouped_stats_1";
import { Unit } from "../../denomination";
import { FeatureFlags } from "../../feature-flags";
import * as Format from "../../format";
import { TimeFrameNext, timeFramesNext } from "../../time_frames";
import BurnCategories from "../BurnCategories";
import BurnRecords from "../BurnRecords";
import FeeBurn from "../FeeBurn";
import BurnGauge from "../Gauges/BurnGauge";
import IssuanceGauge from "../Gauges/IssuanceGauge";
import SupplyGrowthGauge from "../Gauges/SupplyGrowthGauge";
import LatestBlocks from "../LatestBlocks";
import Background from "../widget-subcomponents/WidgetBackground";
import BurnLeaderboard from "./BurnLeaderboard";
import CurrencyControl from "./controls/CurrencyControl";
import TimeFrameControl from "./controls/TimeFrameControl";

const WidgetGroup1: FC<{ featureFlags: FeatureFlags }> = ({ featureFlags }) => {
  const [simulateMerge, setSimulateMerge] = useState(false);
  const baseFeePerGas = useGroupedData1()?.baseFeePerGas;
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
    // without this the time frame selector on the burn records widget causes big scroll jumps
    <div style={{ overflowAnchor: "none" }}>
      <div className="w-full flex flex-col md:flex-row md:gap-0 lg:gap-4 px-4 md:px-16 isolate">
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
      <div className="w-4 h-4" />
      <div className="px-4 md:px-16">
        <Background>
          <div className="flex flex-col gap-y-8 md:flex-row lg:gap-y-0 justify-between">
            <div className="flex flex-col gap-y-4 lg:gap-x-4 lg:flex-row lg:items-center">
              <p className="font-inter font-light text-blue-spindle text-md uppercase">
                time frame
              </p>
              <TimeFrameControl
                selectedTimeframe={timeFrame}
                onSetTimeFrame={handleSetTimeFrame}
              />
            </div>
            <div className="flex flex-col gap-y-4 lg:gap-x-4 lg:flex-row lg:items-center">
              <p className="font-inter font-light text-blue-spindle text-md uppercase md:text-right lg:text-left">
                currency
              </p>
              <CurrencyControl selectedUnit={unit} onSetUnit={onSetUnit} />
            </div>
          </div>
        </Background>
      </div>
      <div className="w-4 h-4" />
      <div
        className={`
          grid grid-cols-1 lg:grid-cols-2
          gap-y-4 md:gap-x-4 px-4 md:px-16
        `}
      >
        <FeeBurn
          onClickTimeFrame={handleClickTimeFrame}
          simulateMerge={simulateMerge}
          timeFrame={timeFrame}
          unit={unit}
        />
        <div
          className={`md:col-start-2 ${
            featureFlags.enableCategories ? "md:row-span-2" : "md:row-span-3"
          }`}
        >
          <BurnLeaderboard
            onClickTimeFrame={handleClickTimeFrame}
            timeFrame={timeFrame}
            unit={unit}
          />
        </div>
        <div
          className={`md:col-start-2 ${
            featureFlags.enableCategories ? "block" : "hidden"
          }`}
        >
          <BurnCategories />
        </div>
        <div className="col-start-1 md:row-start-2">
          <LatestBlocks unit={unit} />
        </div>
        <div className="col-start-1 md:row-start-3">
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
