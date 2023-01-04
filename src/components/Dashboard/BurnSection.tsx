import type { FC } from "react";
import { useCallback, useState } from "react";
import type { Unit } from "../../denomination";
import type { TimeFrameNext } from "../../time-frames";
import { getNextTimeFrameNext } from "../../time-frames";
import BasicErrorBoundary from "../BasicErrorBoundary";
import BurnCategoryWidget from "../BurnCategoryWidget";
import BurnLeaderboard from "../BurnLeaderboard";
import BurnRecords from "../BurnRecords";
import BurnTotal from "../BurnTotal";
import CurrencyControl from "../CurrencyControl";
import LatestBlocks from "../LatestBlocks";
import SectionDivider from "../SectionDivider";
import TimeFrameControl from "../TimeFrameControl";
import { WidgetTitle } from "../WidgetSubcomponents";

const BurnSection: FC = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrameNext>("d1");
  const [unit, setUnit] = useState<Unit>("eth");

  const handleSetTimeFrame = useCallback(setTimeFrame, [setTimeFrame]);

  const onSetUnit = useCallback(setUnit, [setUnit]);

  const handleClickTimeFrame = useCallback(() => {
    setTimeFrame((timeFrame) => getNextTimeFrameNext(timeFrame));
  }, []);

  return (
    <div id="burn">
      <SectionDivider
        link="burn"
        subtitle="it's getting hot in here"
        title="burn"
      />
      <BasicErrorBoundary>
        <div className="flex flex-col gap-4 xs:px-4 md:px-16 ">
          <div className={`rounded-lg bg-slateus-700 p-8`}>
            <div className="grid grid-cols-2 flex-col gap-y-8 md:flex md:flex-row md:justify-between lg:gap-y-0 ">
              <div className="row-start-1 flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-x-4">
                <WidgetTitle>time frame</WidgetTitle>
                <TimeFrameControl
                  selectedTimeframe={timeFrame}
                  onSetTimeFrame={handleSetTimeFrame}
                />
              </div>
              <div className="row-start-2 flex flex-col gap-y-4 md:row-start-1 lg:flex-row lg:items-center lg:gap-x-4">
                <WidgetTitle>currency</WidgetTitle>
                <CurrencyControl selectedUnit={unit} onSetUnit={onSetUnit} />
              </div>
            </div>
          </div>
          <div
            className={`
                grid grid-cols-1 gap-y-4
                md:gap-x-4 lg:grid-cols-2
              `}
          >
            <BurnTotal
              onClickTimeFrame={handleClickTimeFrame}
              timeFrame={timeFrame}
              unit={unit}
            />
            <div className="flex flex-col gap-y-4 lg:col-start-2 lg:row-start-1 lg:row-end-4 lg:h-[520px] xl:h-[532px]">
              <BurnLeaderboard
                onClickTimeFrame={handleClickTimeFrame}
                timeFrame={timeFrame}
                unit={unit}
              />
              <BurnCategoryWidget
                onClickTimeFrame={handleClickTimeFrame}
                timeFrame={timeFrame}
              />
            </div>
            <div className="lg:row-start-2">
              <LatestBlocks unit={unit} />
            </div>
            <div className="lg:row-end-4">
              <BurnRecords
                onClickTimeFrame={handleClickTimeFrame}
                timeFrame={timeFrame}
              />
            </div>
          </div>
        </div>
      </BasicErrorBoundary>
    </div>
  );
};

export default BurnSection;
