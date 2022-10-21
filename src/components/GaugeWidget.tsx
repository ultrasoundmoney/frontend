import type { FC } from "react";
import { useCallback, useState } from "react";
import type { Unit } from "../denomination";
import type { TimeFrameNext } from "../time-frames";
import { getNextTimeFrame } from "../time-frames";
import CurrencyControl from "./CurrencyControl";
import BurnGauge from "./Gauges/BurnGauge";
import IssuanceGauge from "./Gauges/IssuanceGauge";
import SupplyGrowthGauge from "./Gauges/SupplyGrowthGauge";
import { BaseText } from "./Texts";
import TimeFrameControl from "./TimeFrameControl";
import ToggleSwitch from "./ToggleSwitch";
import { WidgetTitle } from "./WidgetSubcomponents";

const Controls: FC<{
  timeFrame: TimeFrameNext;
  onSetTimeFrame: (timeFrame: TimeFrameNext) => void;
  simulateProofOfWork: boolean;
  onToggleSimulateProofOfWork: (simulateProofOfWork: boolean) => void;
  unit: Unit;
  onSetUnit: (unit: Unit) => void;
}> = ({
  onSetTimeFrame,
  onSetUnit,
  onToggleSimulateProofOfWork,
  simulateProofOfWork,
  timeFrame,
  unit,
}) => (
  <div className={`rounded-bl-lg rounded-br-lg bg-blue-tangaroa p-8`}>
    <div className="grid grid-cols-2 flex-col gap-y-8 md:flex md:flex-row md:justify-between lg:gap-y-0 ">
      <div className="row-start-1 flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-x-4">
        <WidgetTitle>time frame</WidgetTitle>
        <TimeFrameControl
          selectedTimeframe={timeFrame}
          onSetTimeFrame={onSetTimeFrame}
        />
      </div>
      <div className="row-start-2 flex flex-col gap-y-4 md:row-start-1 lg:flex-row lg:items-center lg:gap-x-4">
        <WidgetTitle>currency</WidgetTitle>
        <CurrencyControl selectedUnit={unit} onSetUnit={onSetUnit} />
      </div>
      <div className="row-start-2 flex flex-col gap-4 text-right md:row-start-1 lg:flex-row lg:items-center">
        <BaseText
          font="font-inter"
          color="text-slateus-200"
          className="text-xs tracking-widest"
        >
          SIMULATE PoW
        </BaseText>
        {/* On tablet the vertical alignment looks off without aligning the toggle with the neighboring controls */}
        <div className="flex h-[34px] items-center self-end">
          <ToggleSwitch
            checked={simulateProofOfWork}
            onToggle={onToggleSimulateProofOfWork}
          />
        </div>
      </div>
    </div>
  </div>
);

const GaugeWidget: FC = () => {
  const [simulateProofOfWork, setSimulateProofOfWork] = useState(false);
  const [unit, setUnit] = useState<Unit>("eth");
  const [timeFrame, setTimeFrame] = useState<TimeFrameNext>("d1");

  const handleSetTimeFrame = useCallback(setTimeFrame, [setTimeFrame]);

  const handleSetUnit = useCallback(setUnit, [setUnit]);

  const handleToggleSimulateProofOfWork = useCallback(() => {
    setSimulateProofOfWork((simulateProofOfWork) => !simulateProofOfWork);
  }, []);

  const handleClickTimeFrame = useCallback(() => {
    setTimeFrame((timeFrame) => getNextTimeFrame(timeFrame));
  }, []);

  return (
    <div>
      <div className="isolate flex w-full flex-col md:flex-row">
        <div className="hidden w-1/3 md:block">
          <BurnGauge timeFrame={timeFrame} unit={unit} />
        </div>
        <div className="md:w-1/3">
          <SupplyGrowthGauge
            onClickTimeFrame={handleClickTimeFrame}
            simulateProofOfWork={simulateProofOfWork}
            timeFrame={timeFrame}
          />
        </div>
        <div className="hidden w-1/3 md:block">
          <IssuanceGauge
            simulateProofOfWork={simulateProofOfWork}
            timeFrame={timeFrame}
            unit={unit}
          />
        </div>
      </div>
      <Controls
        onSetTimeFrame={handleSetTimeFrame}
        onSetUnit={handleSetUnit}
        onToggleSimulateProofOfWork={handleToggleSimulateProofOfWork}
        simulateProofOfWork={simulateProofOfWork}
        timeFrame={timeFrame}
        unit={unit}
      />
    </div>
  );
};

export default GaugeWidget;
