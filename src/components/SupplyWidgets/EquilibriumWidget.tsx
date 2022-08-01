import * as DateFns from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useGroupedAnalysis1 } from "../../api/grouped-analysis-1";
import {
  DataPoint,
  SupplyInputs,
  useSupplyProjectionInputs,
} from "../../api/supply-projection";
import { GWEI_PER_ETH, WEI_PER_ETH } from "../../eth-units";
import * as Format from "../../format";
import { A, NEA, pipe } from "../../fp";
import { useActiveBreakpoint } from "../../utils/use-active-breakpoint";
import { MoneyAmount } from "../Amount";
import Slider from "../Slider/Slider";
import { TextInter, TextRoboto } from "../Texts";
import { WidgetBackground, WidgetTitle } from "../WidgetSubcomponents";
import EquilibriumGraph from "./EquilibriumGraph";

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

const EquilibriumWidget = () => {
  const burnRateAll = useGroupedAnalysis1()?.burnRates.burnRateAll;
  const supplyProjectionInputs = useSupplyProjectionInputs();
  const [initialEquilibriumInputsSet, setInitialEquilibriumInputsSet] =
    useState(false);
  const [stakedSupply, setStakedSupply] = useState<number>();
  const [nonStakedSupplyBurnFraction, setNonStakedSupplyBurnFraction] =
    useState<number>();
  const { md, lg } = useActiveBreakpoint();

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
      stakedSupply === undefined ||
      nonStakedSupplyBurnFraction === undefined ||
      supplyProjectionInputs === undefined
    ) {
      return undefined;
    }

    const reducedSupplyByDay = pipe(
      supplyProjectionInputs.supplyByDay,
      A.filterWithIndex(
        (i) =>
          // Reduce the number of points in the historical data, but never the last point.
          i % 500 === 0 || i === supplyProjectionInputs.supplyByDay.length - 1,
      ),
      (arr) => arr as NEA.NonEmptyArray<DataPoint>,
      NEA.map((point) => [point.t, point.v] as Point),
    );

    const supplyEquilibriumSeries = [
      ...reducedSupplyByDay,
    ] as NEA.NonEmptyArray<Point>;

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
  }, [stakedSupply, nonStakedSupplyBurnFraction, supplyProjectionInputs]);

  return (
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
            // Move below props inside
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
            <MoneyAmount amountPostfix="M" textSizeClass="text-xl lg:text-3xl">
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
            thumbVisible={initialEquilibriumInputsSet}
          />
          <div className="flex justify-between items-center -mt-2">
            <TextInter className="">staking amount</TextInter>
            <MoneyAmount amountPostfix="M" unitText="ETH">
              {stakedSupply !== undefined
                ? Format.formatOneDigit(stakedSupply / 1e6)
                : undefined}
            </MoneyAmount>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center -mb-1">
            <WidgetTitle>non-staked burn</WidgetTitle>
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
            thumbVisible={initialEquilibriumInputsSet}
          />
          <div className="flex justify-between items-center -mt-2">
            <TextInter className="truncate">non-staked equilibrium</TextInter>
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
  );
};

export default EquilibriumWidget;
