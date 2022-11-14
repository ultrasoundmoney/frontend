import type { FC } from "react";
import { useCallback, useState } from "react";
import type { Unit } from "../denomination";
import type { TimeFrameNext } from "../time-frames";
import CurrencyControl from "./CurrencyControl";
import BurnGauge from "./Gauges/BurnGauge";
import IssuanceGauge from "./Gauges/IssuanceGauge";
import SupplyGrowthGauge from "./Gauges/SupplyGrowthGauge";
import { BaseText } from "./Texts";
import TimeFrameControl from "./TimeFrameControl";
import ToggleSwitch from "./ToggleSwitch";
import { WidgetTitle } from "./WidgetSubcomponents";

type Props = {
  timeFrame: TimeFrameNext;
  onSetTimeFrame: (timeFrame: TimeFrameNext) => void;
  simulateProofOfWork: boolean;
  onSimulateProofOfWork: () => void;
  unit: Unit;
  onSetUnit: (unit: Unit) => void;
};

const Controls: FC<Props> = ({
  onSetTimeFrame,
  onSetUnit,
  onSimulateProofOfWork: onToggleSimulateProofOfWork,
  simulateProofOfWork,
  timeFrame,
  unit,
}) => (
  <div className={`rounded-bl-lg rounded-br-lg bg-slateus-700 px-8 pb-8`}>
    <div className="grid grid-cols-2 flex-col gap-y-8 md:flex md:flex-row md:justify-between lg:gap-y-0 ">
      <div className="row-start-1 flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-x-4">
        <WidgetTitle>time frame</WidgetTitle>
        <TimeFrameControl
          selectedTimeframe={timeFrame}
          onSetTimeFrame={onSetTimeFrame}
        />
      </div>
      <div className="row-start-2 hidden flex-col gap-y-4 md:row-start-1 md:flex lg:flex-row lg:items-center lg:gap-x-4">
        <WidgetTitle>currency</WidgetTitle>
        <CurrencyControl selectedUnit={unit} onSetUnit={onSetUnit} />
      </div>
      <div className="col-span-2 row-start-2 flex items-center gap-4 text-left md:row-start-1 md:flex-col md:text-right lg:flex-row">
        <BaseText
          font="font-inter"
          color="text-slateus-200"
          className="text-xs tracking-widest"
        >
          SIMULATE PoW
        </BaseText>
        {/* On tablet the vertical alignment looks off without aligning the toggle with the neighboring controls */}
        <div className="flex h-[34px] items-center self-start md:self-end">
          <ToggleSwitch
            checked={simulateProofOfWork}
            onToggle={onToggleSimulateProofOfWork}
          />
        </div>
      </div>
    </div>
  </div>
);

const GaugeWidget: FC<{
  onClickTimeFrame: () => void;
  onSetTimeFrame: (timeFrame: TimeFrameNext) => void;
  onSimulateProofOfWork: () => void;
  simulateProofOfWork: boolean;
  timeFrame: TimeFrameNext;
}> = ({
  onClickTimeFrame,
  onSetTimeFrame,
  onSimulateProofOfWork,
  simulateProofOfWork,
  timeFrame,
}) => {
  const [unit, setUnit] = useState<Unit>("eth");

  const handleSetUnit = useCallback(setUnit, [setUnit]);

  return (
    <div>
      <div className="isolate flex w-full flex-col md:flex-row">
        <div className="hidden w-1/3 md:block">
          <BurnGauge timeFrame={timeFrame} unit={unit} />
        </div>
        <div className="md:w-1/3">
          <SupplyGrowthGauge
            onClickTimeFrame={onClickTimeFrame}
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
        onSetTimeFrame={onSetTimeFrame}
        onSetUnit={handleSetUnit}
        onSimulateProofOfWork={onSimulateProofOfWork}
        simulateProofOfWork={simulateProofOfWork}
        timeFrame={timeFrame}
        unit={unit}
      />
    </div>
  );
};

export default GaugeWidget;
