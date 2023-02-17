import type { FC } from "react";
import { useCallback, useState } from "react";
import type { Unit } from "../denomination";
import type { TimeFrame } from "../time-frames";
import CurrencyControl from "./CurrencyControl";
import BurnGauge from "./Gauges/BurnGauge";
import IssuanceGauge from "./Gauges/IssuanceGauge";
import SupplyGrowthGauge from "./Gauges/SupplyGrowthGauge";
import { BaseText } from "./Texts";
import TimeFrameControl from "./TimeFrameControl";
import ToggleSwitch from "./ToggleSwitch";
import { WidgetTitle } from "./WidgetSubcomponents";

type Props = {
  onSetTimeFrame: (timeFrame: TimeFrame) => void;
  onSetUnit: (unit: Unit) => void;
  onSimulateProofOfWork: () => void;
  simulateProofOfWork: boolean;
  timeFrame: TimeFrame;
  unit: Unit;
};

const Controls: FC<Props> = ({
  onSetTimeFrame,
  onSetUnit,
  onSimulateProofOfWork,
  simulateProofOfWork,
  timeFrame,
  unit,
}) => (
  <div className={`rounded-bl-lg rounded-br-lg bg-slateus-700 px-8 pb-8`}>
    <div className="flex flex-col gap-y-8 md:flex-row md:justify-between lg:gap-y-0 ">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-x-4">
        <WidgetTitle>time frame</WidgetTitle>
        <TimeFrameControl
          selectedTimeframe={timeFrame}
          onSetTimeFrame={onSetTimeFrame}
          mergeEnabled
        />
      </div>
      <div className="hidden flex-col gap-y-4 md:flex lg:flex-row lg:items-center lg:gap-x-4">
        <WidgetTitle>currency</WidgetTitle>
        <CurrencyControl selectedUnit={unit} onSetUnit={onSetUnit} />
      </div>
      <div className="flex items-center gap-4 text-left md:flex-col md:text-right lg:flex-row">
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
            onToggle={onSimulateProofOfWork}
          />
        </div>
      </div>
    </div>
  </div>
);

const GaugeWidget: FC<{
  onClickTimeFrame: () => void;
  onSetTimeFrame: (timeFrame: TimeFrame) => void;
  onSimulateProofOfWork: () => void;
  simulateProofOfWork: boolean;
  timeFrame: TimeFrame;
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
