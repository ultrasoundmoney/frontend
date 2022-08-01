import * as DateFns from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useGroupedAnalysis1 } from "../../api/grouped-analysis-1";
import {
  DataPoint,
  SupplyInputs,
  useSupplyProjectionInputs,
} from "../../api/supply-projection";
import { Unit } from "../../denomination";
import { GWEI_PER_ETH, WEI_PER_ETH } from "../../eth-units";
import * as Format from "../../format";
import { A, NEA, pipe } from "../../fp";
import { TimeFrameNext, timeFramesNext } from "../../time-frames";
import { useActiveBreakpoint } from "../../utils/use-active-breakpoint";
import { MoneyAmount } from "../Amount";
import CurrencyControl from "../CurrencyControl";
import BurnGauge from "../Gauges/BurnGauge";
import IssuanceGauge from "../Gauges/IssuanceGauge";
import SupplyGrowthGauge from "../Gauges/SupplyGrowthGauge";
import Slider from "../Slider/Slider";
import SupplyView from "../SupplyView";
import { TextInter, TextRoboto } from "../Texts";
import TimeFrameControl from "../TimeFrameControl";
import ToggleSwitch from "../ToggleSwitch";
import { WidgetBackground, WidgetTitle } from "../WidgetSubcomponents";
import EquilibriumGraph from "./EquilibriumGraph";
import EthSupplyWidget from "./EthSupplyWidget";
import PeakSupplyWidget from "./PeakSupplyWidget";

type Point = [number, number];

const YEAR_IN_MINUTES = 365.25 * 24 * 60;

const burnAsFraction = (
  nonStakingSupply: number | undefined,
  weiBurnPerMinute: number | undefined,
) =>
  nonStakingSupply !== undefined && weiBurnPerMinute !== undefined
    ? ((weiBurnPerMinute / WEI_PER_ETH) * YEAR_IN_MINUTES) / nonStakingSupply
    : undefined;

const getStakingSupply = (supplyProjectionInputs: SupplyInputs): number =>
  pipe(
    supplyProjectionInputs.inBeaconValidatorsByDay,
    NEA.last,
    (dataPoint) => dataPoint.v,
  );

const getNonStakingSupply = (
  supplyProjectionInputs: SupplyInputs,
): number | undefined => {
  const supply = NEA.last(supplyProjectionInputs.supplyByDay).v;
  const staked = NEA.last(supplyProjectionInputs.inBeaconValidatorsByDay).v;
  return supply - staked;
};

const MAX_EFFECTIVE_BALANCE: number = 32 * GWEI_PER_ETH;
const SECONDS_PER_SLOT = 12;
const SLOTS_PER_EPOCH = 32;
const EPOCHS_PER_DAY: number =
  (24 * 60 * 60) / SLOTS_PER_EPOCH / SECONDS_PER_SLOT;
const EPOCHS_PER_YEAR: number = 365.25 * EPOCHS_PER_DAY;

const BASE_REWARD_FACTOR = 64;

const getIssuance = (effective_balance_sum: number) => {
  const total_effective_balance = effective_balance_sum * GWEI_PER_ETH;

  const active_validators = total_effective_balance / GWEI_PER_ETH / 32;

  // Balance at stake (Gwei)
  const max_balance_at_stake = active_validators * MAX_EFFECTIVE_BALANCE;

  const max_issuance_per_epoch = Math.trunc(
    (BASE_REWARD_FACTOR * max_balance_at_stake) /
      Math.floor(Math.sqrt(max_balance_at_stake)),
  );
  const max_issuance_per_year = max_issuance_per_epoch * EPOCHS_PER_YEAR;

  const annual_reward = max_issuance_per_year / active_validators;

  return annual_reward / GWEI_PER_ETH;
};

const getIssuanceApr = (effective_balance_sum: number) => {
  const total_effective_balance = effective_balance_sum * GWEI_PER_ETH;

  const active_validators = total_effective_balance / GWEI_PER_ETH / 32;

  // Balance at stake (Gwei)
  const max_balance_at_stake = active_validators * MAX_EFFECTIVE_BALANCE;

  const max_issuance_per_epoch = Math.trunc(
    (BASE_REWARD_FACTOR * max_balance_at_stake) /
      Math.floor(Math.sqrt(max_balance_at_stake)),
  );
  const max_issuance_per_year = max_issuance_per_epoch * EPOCHS_PER_YEAR;

  const apr = max_issuance_per_year / total_effective_balance;

  return apr;
};

const getBurn = (
  yearlyNonStakedBurnFraction: number,
  nonStakedSupply: number,
) => yearlyNonStakedBurnFraction * nonStakedSupply;

const SupplyWidgets = () => {
  const [simulateMerge, setSimulateMerge] = useState(false);
  const baseFeePerGas = useGroupedAnalysis1()?.baseFeePerGas;
  const burnRateAll = useGroupedAnalysis1()?.burnRates.burnRateAll;
  const supplyProjectionInputs = useSupplyProjectionInputs();
  const [timeFrame, setTimeFrame] = useState<TimeFrameNext>("d1");
  const [unit, setUnit] = useState<Unit>("eth");
  const [stakedSupply, setStakedSupply] = useState<number>();
  const [nonStakedSupplyBurnFraction, setNonStakedSupplyBurnFraction] =
    useState<number>();
  const { md, lg } = useActiveBreakpoint();
  const [initialEquilibriumInputsSet, setInitialEquilibriumInputsSet] =
    useState(false);

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

  // Only runs once because of initialEquilibriumInputsSet, after data loads.
  useEffect(() => {
    if (
      burnRateAll === undefined ||
      supplyProjectionInputs === undefined ||
      initialEquilibriumInputsSet
    ) {
      return;
    }

    setInitialEquilibriumInputsSet(true);
    setStakedSupply(getStakingSupply(supplyProjectionInputs));
    const nonStakedSupply = getNonStakingSupply(supplyProjectionInputs);
    setNonStakedSupplyBurnFraction(
      burnAsFraction(nonStakedSupply, burnRateAll),
    );
  }, [burnRateAll, initialEquilibriumInputsSet, supplyProjectionInputs]);

  const equilibriums = useMemo(():
    | {
        cashFlowsEquilibrium: number;
        nonStakedSupplyEquilibrium: number;
        supplyEquilibrium: number;
        supplyEquilibriumMap: Record<number, number>;
        supplyEquilibriumSeries: NEA.NonEmptyArray<Point>;
      }
    | undefined => {
    if (
      supplyProjectionInputs === undefined ||
      stakedSupply === undefined ||
      nonStakedSupplyBurnFraction === undefined
    ) {
      return undefined;
    }

    const supplyEquilibriumSeries = pipe(
      supplyProjectionInputs.supplyByDay,
      A.filterWithIndex(
        (i) =>
          // Reduce the number of points in the historical data, but never the last point.
          i % 500 === 0 || i === supplyProjectionInputs.supplyByDay.length - 1,
      ),
      (arr) => arr as NEA.NonEmptyArray<DataPoint>,
      NEA.map((point) => [point.t, point.v] as Point),
    );

    // Now calculate n years into the future to paint an equilibrium.
    let supply = NEA.last(supplyEquilibriumSeries);
    const staked = stakedSupply;
    let nonStaked = supply[1] - staked;
    const issuance = getIssuance(staked);

    for (let i = 0; i < 32; i++) {
      const nextYear = DateFns.addYears(DateFns.fromUnixTime(supply[0]), 1);
      const burn = getBurn(nonStakedSupplyBurnFraction, nonStaked);

      supply = [DateFns.getUnixTime(nextYear), supply[1] + issuance - burn] as [
        number,
        number,
      ];

      supplyEquilibriumSeries.push(supply);

      nonStaked = supply[1] - staked;
    }

    const supplyEquilibriumMap = supplyEquilibriumSeries.reduce(
      (map: Record<number, number>, [t, v]) => {
        map[t] = v;
        return map;
      },
      {},
    );

    const supplyEquilibrium = supply[1];
    const nonStakedSupplyEquilibrium = nonStaked;
    const cashFlowsEquilibrium = getIssuance(staked);

    return {
      cashFlowsEquilibrium,
      nonStakedSupplyEquilibrium,
      supplyEquilibrium,
      supplyEquilibriumMap,
      supplyEquilibriumSeries,
    };
  }, [nonStakedSupplyBurnFraction, stakedSupply, supplyProjectionInputs]);

  return (
    <div className="flex flex-col gap-4 px-4 md:px-16">
      <div>
        <div className="w-full flex flex-col md:flex-row isolate">
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
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full">
          <EthSupplyWidget></EthSupplyWidget>
        </div>
        <div className="w-full">
          <PeakSupplyWidget></PeakSupplyWidget>
        </div>
      </div>
      <div className="w-full md:m-auto relative bg-blue-tangaroa px-2 md:px-4 xl:px-12 py-4 md:py-8 xl:py-12 rounded-xl">
        <SupplyView />
      </div>
      <WidgetBackground
        className={`relative flex flex-col md:flex-row-reverse gap-x-4 gap-y-8 overflow-hidden`}
      >
        <div
          className={`
            absolute top-0 right-0
            w-3/5 h-full
            opacity-[0.25]
            blur-[100px]
          `}
        >
          <div
            className={`
              absolute md:bottom-[3.0rem] md:-right-[1.0rem]
              w-4/5 h-3/5 rounded-[35%]
              bg-[#0037FA]
            `}
          ></div>
        </div>
        {/* Higher z-level to bypass the background blur of our sibling. */}
        <div className="md:w-1/2 flex justify-center items-center z-20">
          {equilibriums !== undefined ? (
            <EquilibriumGraph
              supplyEquilibriumSeries={equilibriums.supplyEquilibriumSeries}
              supplyEquilibriumMap={equilibriums.supplyEquilibriumMap}
              widthMin={lg ? 0.4 : md ? 0.7 : undefined}
              widthMax={lg ? 0.4 : md ? 0.7 : undefined}
              height={lg ? 220 : 160}
            />
          ) : (
            <TextRoboto
              className={`text-blue-spindle flex items-center ${
                lg ? "h-[220px]" : "h-[160px]"
              }`}
            >
              loading...
            </TextRoboto>
          )}
        </div>
        <div className="md:w-1/2 flex flex-col gap-y-8 z-10">
          <div>
            <div className="flex justify-between">
              <WidgetTitle>supply equilibrium</WidgetTitle>
              <WidgetTitle className="text-right">
                cashflows equilibrium
              </WidgetTitle>
            </div>
            <div className="flex justify-between">
              <MoneyAmount
                amountPostfix="M"
                textSizeClass="text-xl lg:text-3xl"
              >
                {equilibriums !== undefined
                  ? Format.formatOneDigit(equilibriums.supplyEquilibrium / 1e6)
                  : undefined}
              </MoneyAmount>
              <MoneyAmount
                amountPostfix="M"
                unitText="ETH/year"
                textSizeClass="text-xl lg:text-3xl"
              >
                {equilibriums !== undefined
                  ? Format.formatOneDigit(equilibriums.cashFlowsEquilibrium)
                  : undefined}
              </MoneyAmount>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center -mb-1">
              <WidgetTitle>staking apr</WidgetTitle>
              <TextRoboto>
                {stakedSupply !== undefined
                  ? `${Format.formatPercentOneDigit(
                      getIssuanceApr(stakedSupply),
                    )}/year`
                  : undefined}
              </TextRoboto>
            </div>
            <Slider
              min={5 * 1e6}
              max={30 * 1e6}
              value={stakedSupply}
              step={1e5}
              onChange={(e) => setStakedSupply(Number(e.target.value))}
            />
            <div className="flex justify-between items-center -mt-2">
              <TextInter className="text-base md:text-base">
                staking amount
              </TextInter>
              <MoneyAmount amountPostfix="M" unitText="ETH">
                {stakedSupply !== undefined
                  ? Format.formatOneDigit(stakedSupply / 1e6)
                  : undefined}
              </MoneyAmount>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center -mb-1">
              <WidgetTitle>non-staked supply burn</WidgetTitle>
              <TextRoboto>
                {nonStakedSupplyBurnFraction !== undefined
                  ? `${Format.formatPercentOneDigit(
                      nonStakedSupplyBurnFraction,
                    )}/year`
                  : undefined}
              </TextRoboto>
            </div>
            <Slider
              min={0}
              max={0.05}
              value={nonStakedSupplyBurnFraction}
              step={0.001}
              onChange={(e) =>
                setNonStakedSupplyBurnFraction(Number(e.target.value))
              }
            />
            <div className="flex justify-between items-center -mt-2">
              <TextInter className="text-base md:text-base truncate">
                non-staked supply equilibrium
              </TextInter>
              <MoneyAmount amountPostfix="M" unitText="ETH">
                {equilibriums !== undefined
                  ? Format.formatOneDigit(
                      equilibriums.nonStakedSupplyEquilibrium / 1e6,
                    )
                  : undefined}
              </MoneyAmount>
            </div>
          </div>
        </div>
      </WidgetBackground>
    </div>
  );
};

export default SupplyWidgets;
