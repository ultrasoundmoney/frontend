// Rendering the D3 arc paths on the server vs the safari client results in a different path. We ignore the hydration warning.

import type { FC } from "react";
import type { Unit } from "../../denomination";
import type { TimeFrame } from "../time-frames";
import CurrencyControl from "./CurrencyControl";
import BurnGauge from "./Gauges/BurnGauge";
import IssuanceGauge from "./Gauges/IssuanceGauge";
import SupplyGrowthGauge from "./Gauges/SupplyGrowthGauge";
import { BaseText } from "../../components/Texts";
import TimeFrameControl from "../../components/TimeFrameControl";
import ToggleSwitch from "../../components/ToggleSwitch";
import { WidgetTitle } from "../../components/WidgetSubcomponents";
import { OnClick, OnSetTimeFrame } from "../../components/TimeFrameControl";

type Props = {
  onSetTimeFrame: OnSetTimeFrame;
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
    <div className="flex flex-col gap-y-8 md:flex-row md:justify-between lg:gap-y-0">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-x-4 lg:items-center">
        <WidgetTitle>time frame</WidgetTitle>
        <TimeFrameControl
          selectedTimeFrame={timeFrame}
          onSetTimeFrame={onSetTimeFrame}
        />
      </div>
      <div className="flex flex-col gap-y-4 lg:flex-row lg:gap-x-4 lg:items-center">
        <WidgetTitle>currency</WidgetTitle>
        <CurrencyControl selectedUnit={unit} onSetUnit={onSetUnit} />
      </div>
      <div className="flex gap-4 items-center text-left md:flex-col md:text-right lg:flex-row">
        <BaseText
          font="font-inter"
          color="text-slateus-200"
          className="text-xs tracking-widest"
        >
          SIMULATE PoW
        </BaseText>
        {/* On tablet the vertical alignment looks off without aligning the toggle with the neighboring controls */}
        <div className="flex items-center self-start md:self-end h-[34px]">
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
  onClickTimeFrame: OnClick;
  onSetTimeFrame: OnSetTimeFrame;
  onSetUnit: (unit: Unit) => void;
  onSimulateProofOfWork: () => void;
  simulateProofOfWork: boolean;
  timeFrame: TimeFrame;
  unit: Unit;
}> = ({
  onClickTimeFrame,
  onSetTimeFrame,
  onSetUnit,
  onSimulateProofOfWork,
  simulateProofOfWork,
  timeFrame,
  unit,
}) => (
  <div>
    <div className="flex flex-col w-full md:flex-row isolate">
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
      onSetUnit={onSetUnit}
      onSimulateProofOfWork={onSimulateProofOfWork}
      simulateProofOfWork={simulateProofOfWork}
      timeFrame={timeFrame}
      unit={unit}
    />
  </div>
);

export default GaugeWidget;
