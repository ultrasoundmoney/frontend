import _maxBy from "lodash/maxBy";
import type { FC } from "react";
import { useCallback, useMemo, useState } from "react";
import type { BaseFeeAtTime } from "../../api/base-fee-over-time";
import { useBaseFeeOverTime } from "../../api/base-fee-over-time";
import type { Unit } from "../../denomination";
import type { Gwei } from "../../eth-units";
import { WEI_PER_GWEI } from "../../eth-units";
import type { JsTimestamp } from "../../time";
import type { TimeFrameNext } from "../../time-frames";
import { getNextTimeFrame } from "../../time-frames";
import BaseFeesWidget from "../BaseFeesWidget";
import BasicErrorBoundary from "../BasicErrorBoundary";
import CurrencyControl from "../CurrencyControl";
import GasStreakWidget from "../GasStreakWidget";
import GasMarketWidget from "../GasMarketWidget";
import BurnGauge from "../Gauges/BurnGauge";
import IssuanceGauge from "../Gauges/IssuanceGauge";
import SupplyGrowthGauge from "../Gauges/SupplyGrowthGauge";
import SectionDivider from "../SectionDivider";
import { BaseText } from "../Texts";
import TimeFrameControl from "../TimeFrameControl";
import ToggleSwitch from "../ToggleSwitch";
import { WidgetTitle } from "../WidgetSubcomponents";

export type BaseFeePoint = [JsTimestamp, Gwei];

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

const pointsFromBaseFeesOverTime = (
  baseFeesD1: BaseFeeAtTime[],
): BaseFeePoint[] =>
  baseFeesD1.map(
    ({ block_number, wei }) =>
      [block_number, wei / WEI_PER_GWEI] as BaseFeePoint,
  );

const GasSection: FC = () => {
  const baseFeesOverTime = useBaseFeeOverTime();
  const [simulateProofOfWork, setSimulateProofOfWork] = useState(false);
  const [timeFrame, setTimeFrame] = useState<TimeFrameNext>("d1");
  const [unit, setUnit] = useState<Unit>("eth");

  const handleSetTimeFrame = useCallback(setTimeFrame, [setTimeFrame]);

  const handleSetUnit = useCallback(setUnit, [setUnit]);

  const handleToggleSimulateProofOfWork = useCallback(() => {
    setSimulateProofOfWork((simulateProofOfWork) => !simulateProofOfWork);
  }, []);

  const handleClickTimeFrame = useCallback(() => {
    setTimeFrame((timeFrame) => getNextTimeFrame(timeFrame));
  }, []);

  const [baseFeesSeries, max] = useMemo(() => {
    if (baseFeesOverTime === undefined) {
      return [undefined, undefined];
    }

    const baseFeesOverTimeTimeFrame = baseFeesOverTime[timeFrame] ?? undefined;
    const series =
      baseFeesOverTimeTimeFrame === undefined
        ? undefined
        : pointsFromBaseFeesOverTime(baseFeesOverTimeTimeFrame);

    const max = _maxBy(series, (point) => point[1]);

    return [series, max];
  }, [baseFeesOverTime, timeFrame]);

  const baseFeesMap =
    baseFeesSeries === undefined
      ? undefined
      : Object.fromEntries(new Map(baseFeesSeries).entries());

  return (
    <BasicErrorBoundary>
      <div id="gas" className="mt-16">
        <SectionDivider link="gas" subtitle="gas is the new oil" title="gas" />
        <div className="flex flex-col gap-4 xs:px-4 md:px-16">
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
          <div className="flex flex-col gap-y-4 gap-x-4 lg:flex-row">
            <div className="flex h-min w-full flex-col gap-y-4 lg:w-1/2">
              <GasMarketWidget
                timeFrame={timeFrame}
                onClickTimeFrame={handleClickTimeFrame}
              />
              <GasStreakWidget />
            </div>
            <div className="w-full lg:w-1/2">
              <BaseFeesWidget
                barrier={baseFeesOverTime?.barrier}
                baseFeesSeries={baseFeesSeries}
                baseFeesMap={baseFeesMap ?? {}}
                max={max?.[1]}
                timeFrame={timeFrame}
                onClickTimeFrame={handleClickTimeFrame}
              />
            </div>
          </div>
        </div>
      </div>
    </BasicErrorBoundary>
  );
};

export default GasSection;
