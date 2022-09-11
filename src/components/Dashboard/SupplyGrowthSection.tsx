import type { FC } from "react";
import { useMemo } from "react";
import { Suspense, useCallback, useState } from "react";
import type { EthPriceStats } from "../../api/eth-price-stats";
import type { BurnRates } from "../../api/grouped-analysis-1";
import type { Scarcity } from "../../api/scarcity";
import type { Unit } from "../../denomination";
import type { TimeFrameNext } from "../../time-frames";
import { timeFramesNext } from "../../time-frames";
import BasicErrorBoundary from "../BasicErrorBoundary";
import CurrencyControl from "../CurrencyControl";
import BurnGauge from "../Gauges/BurnGauge";
import IssuanceGauge from "../Gauges/IssuanceGauge";
import SupplyGrowthGauge from "../Gauges/SupplyGrowthGauge";
import SectionDivider from "../SectionDivider";
import TimeFrameControl from "../TimeFrameControl";
import ToggleSwitch from "../ToggleSwitch";
import { WidgetTitle } from "../WidgetSubcomponents";
import EthSupplyWidget from "../EthSupplyWidget";
import type { EthSupply } from "../../api/eth-supply";
import BaseFeesWidget from "../BaseFeesWidget";
import type { BaseFeeAtTime } from "../../api/base-fee-over-time"
import { useBaseFeeOverTime } from "../../api/base-fee-over-time";
import { useBaseFeePerGasStats } from "../../api/base-fee-per-gas-stats";
import GasMarketWidget from "../GasMarketWidget";
import type { Gwei } from "../../eth-units";
import { WEI_PER_GWEI } from "../../eth-units";
import _maxBy from "lodash/maxBy";

type JsTimestamp = number;
export type BaseFeePoint = [JsTimestamp, Gwei];

const Controls: FC<{
  timeFrame: TimeFrameNext;
  onSetTimeFrame: (timeFrame: TimeFrameNext) => void;
  simulateMerge: boolean;
  onToggleSimulateMerge: (simulateMerge: boolean) => void;
  unit: Unit;
  onSetUnit: (unit: Unit) => void;
}> = ({
  onSetTimeFrame,
  onSetUnit,
  onToggleSimulateMerge,
  simulateMerge,
  timeFrame,
  unit,
}) => (
    <div className={`bg-blue-tangaroa rounded-bl-lg rounded-br-lg p-8`}>
      <div className="grid grid-cols-2 md:flex md:justify-between flex-col gap-y-8 md:flex-row lg:gap-y-0 ">
        <div className="row-start-1 flex flex-col gap-4 lg:gap-x-4 lg:flex-row lg:items-center">
          <WidgetTitle>time frame</WidgetTitle>
          <TimeFrameControl
            selectedTimeframe={timeFrame}
            onSetTimeFrame={onSetTimeFrame}
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
              onToggle={onToggleSimulateMerge}
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

type Props = {
  burnRates: BurnRates;
  ethSupply: EthSupply;
  ethPriceStats: EthPriceStats;
  scarcity: Scarcity | undefined;
};

const SupplyGrowthSection: FC<Props> = ({
  burnRates,
  ethSupply,
  ethPriceStats,
  scarcity,
}) => {
  const baseFeesOverTime = useBaseFeeOverTime();
  const baseFeePerGasStats = useBaseFeePerGasStats();
  const [simulateMerge, setSimulateMerge] = useState(false);
  const [timeFrame, setTimeFrame] = useState<TimeFrameNext>("d1");
  const [unit, setUnit] = useState<Unit>("eth");

  const handleSetTimeFrame = useCallback(setTimeFrame, [setTimeFrame]);

  const handleSetUnit = useCallback(setUnit, [setUnit]);

  const handleToggleSimulateMerge = useCallback(() => {
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

  const [baseFeesSeries, max] = useMemo(
    () => {
      if (baseFeesOverTime === undefined) {
        return [undefined, undefined]
      }

      const series = pointsFromBaseFeesOverTime(baseFeesOverTime.d1);
      const max = _maxBy(series, (point) => point[1]);

      return [series, max]
    }, [baseFeesOverTime]
  );

  const baseFeesMap = Object.fromEntries(new Map(baseFeesSeries).entries());

  return (
    <BasicErrorBoundary>
      <Suspense>
        <div id="growth" className="mt-16">
          <SectionDivider
            link="growth"
            subtitle="burn greater than issuance?"
            title="supply growth"
          />
          <div className="flex flex-col gap-4 xs:px-4 md:px-16">
            <div>
              <div className="w-full flex flex-col md:flex-row isolate">
                <div className="hidden md:block w-1/3">
                  <BurnGauge
                    burnRates={burnRates}
                    ethPriceStats={ethPriceStats}
                    timeFrame={timeFrame}
                    unit={unit}
                  />
                </div>
                <div className="md:w-1/3">
                  <SupplyGrowthGauge
                    scarcity={scarcity}
                    burnRates={burnRates}
                    onClickTimeFrame={handleClickTimeFrame}
                    simulateMerge={simulateMerge}
                    timeFrame={timeFrame}
                    toggleSimulateMerge={handleToggleSimulateMerge}
                  />
                </div>
                <div className="hidden md:block w-1/3">
                  <IssuanceGauge
                    ethPriceStats={ethPriceStats}
                    simulateMerge={simulateMerge}
                    timeFrame={timeFrame}
                    unit={unit}
                  />
                </div>
              </div>
              <Controls
                onSetTimeFrame={handleSetTimeFrame}
                onSetUnit={handleSetUnit}
                onToggleSimulateMerge={handleToggleSimulateMerge}
                simulateMerge={simulateMerge}
                timeFrame={timeFrame}
                unit={unit}
              />
            </div>
            <div className="flex flex-col lg:flex-row gap-y-4 gap-x-4">
              <div className="flex flex-col gap-y-4 w-full lg:w-1/2 h-min">
                <GasMarketWidget baseFeePerGasStats={baseFeePerGasStats} />
                <EthSupplyWidget ethSupply={ethSupply} />
              </div>
              <div className="w-full lg:w-1/2">
                <BaseFeesWidget
                  barrier={baseFeesOverTime?.barrier}
                  baseFeesSeries={baseFeesSeries ?? []}
                  baseFeesMap={baseFeesMap}
                  max={max?.[1]}
                />
              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </BasicErrorBoundary>
  );
};

export default SupplyGrowthSection;
