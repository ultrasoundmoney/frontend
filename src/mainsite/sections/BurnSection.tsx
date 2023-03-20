import type { FC } from "react";
import { useCallback, useState } from "react";
import Section from "../../components/Section";
import TimeFrameControl from "../../components/TimeFrameControl";
import { WidgetTitle } from "../../components/WidgetSubcomponents";
import type { Unit } from "../../denomination";
import BurnCategoryWidget from "../components/BurnCategoryWidget";
import BurnLeaderboard from "../components/BurnLeaderboard";
import BurnRecords from "../components/BurnRecords";
import BurnTotal from "../components/BurnTotal";
import CurrencyControl from "../components/CurrencyControl";
import LatestBlocks from "../components/LatestBlocks";
import type { TimeFrame} from "../time-frames";
import { getNextTimeFrame } from "../time-frames";

const BurnSection: FC = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("d1");
  const [unit, setUnit] = useState<Unit>("eth");

  const handleSetTimeFrame = useCallback(
    setTimeFrame,
    [setTimeFrame],
  );

  const onSetUnit = useCallback(setUnit, [setUnit]);

  const handleClickTimeFrame = useCallback(() => {
    setTimeFrame((timeFrame) => getNextTimeFrame(timeFrame));
  }, []);

  return (
    <Section link="burn" subtitle="it's getting hot in here" title="burn">
      <div className="w-full rounded-lg bg-slateus-700 p-8">
        <div className="grid grid-cols-2 flex-col gap-y-8 md:flex md:flex-row md:justify-between lg:gap-y-0 ">
          <div className="row-start-1 flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-x-4">
            <WidgetTitle>time frame</WidgetTitle>
            <TimeFrameControl
              selectedTimeFrame={timeFrame}
              onSetTimeFrame={handleSetTimeFrame}
            />
          </div>
          <div className="row-start-2 flex flex-col gap-y-4 md:row-start-1 lg:flex-row lg:items-center lg:gap-x-4">
            <WidgetTitle>currency</WidgetTitle>
            <CurrencyControl selectedUnit={unit} onSetUnit={onSetUnit} />
          </div>
        </div>
      </div>
      <div className="grid w-full grid-cols-1 gap-y-4 md:gap-x-4 lg:grid-cols-2">
        <BurnTotal
          onClickTimeFrame={handleClickTimeFrame}
          timeFrame={timeFrame}
          unit={unit}
        />
        <div className="flex flex-col gap-y-4 lg:col-start-2 lg:row-start-1 lg:row-end-4 lg:max-h-[509px] xl:max-h-[521px] 2xl:h-[532px]">
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
    </Section>
  );
};

export default BurnSection;
