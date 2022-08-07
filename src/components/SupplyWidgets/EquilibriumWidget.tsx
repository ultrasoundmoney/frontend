import * as DateFns from "date-fns";
import _ from "lodash";
import { FC, useEffect, useMemo, useState } from "react";
import { useGroupedAnalysis1 } from "../../api/grouped-analysis-1";
import {
  SupplyInputs,
  useSupplyProjectionInputs,
} from "../../api/supply-projection";
import { GWEI_PER_ETH, WEI_PER_ETH } from "../../eth-units";
import * as Format from "../../format";
import { NEA, pipe } from "../../fp";
import { useActiveBreakpoint } from "../../utils/use-active-breakpoint";
import { MoneyAmount, PercentAmount } from "../Amount";
import Slider2 from "../Slider2";
import { BodyText, TextRoboto, TimeFrameText } from "../Texts";
import { WidgetBackground, WidgetTitle } from "../WidgetSubcomponents";
import EquilibriumGraph from "./EquilibriumGraph";

type UnixTimestamp = number;
type Point = [UnixTimestamp, number];

const YEAR_IN_MINUTES = 365.25 * 24 * 60;

const burnAsFraction = (nonStakingSupply: number, weiBurnPerMinute: number) =>
  ((weiBurnPerMinute / WEI_PER_ETH) * YEAR_IN_MINUTES) / nonStakingSupply;

const getStakingSupply = (supplyProjectionInputs: SupplyInputs): number =>
  pipe(
    supplyProjectionInputs.inBeaconValidatorsByDay,
    NEA.last,
    (dataPoint) => dataPoint.v,
  );

const getNonStakingSupply = (supplyProjectionInputs: SupplyInputs): number => {
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

type Eth = number;

// let active_validators = effective_balance_sum as f64 / GWEI_PER_ETH_F64 / 32f64;

// // Balance at stake (Gwei)
// let max_balance_at_stake = active_validators * MAX_EFFECTIVE_BALANCE;

// let max_issuance_per_epoch = ((BASE_REWARD_FACTOR as f64 * max_balance_at_stake)
//     / max_balance_at_stake.sqrt().floor())
// .trunc();
// let max_issuance_per_year = max_issuance_per_epoch * EPOCHS_PER_YEAR;

// let annual_reward = max_issuance_per_year / active_validators;
// let apr = max_issuance_per_year / effective_balance_sum as f64;

const getIssuancePerYear = (effective_balance_sum: Eth): number => {
  const balance_sum_gwei = effective_balance_sum * GWEI_PER_ETH;
  const max_issuance_per_epoch = Math.trunc(
    (BASE_REWARD_FACTOR * balance_sum_gwei) /
      Math.floor(Math.sqrt(balance_sum_gwei)),
  );
  const issuancePerYear = max_issuance_per_epoch * EPOCHS_PER_YEAR;
  return issuancePerYear / GWEI_PER_ETH;
};

const getIssuanceApr = (effective_balance_sum: Eth): number => {
  const balance_sum_gwei = effective_balance_sum * GWEI_PER_ETH;
  const max_issuance_per_epoch = Math.trunc(
    (BASE_REWARD_FACTOR * balance_sum_gwei) /
      Math.floor(Math.sqrt(balance_sum_gwei)),
  );
  const issuancePerYear = max_issuance_per_epoch * EPOCHS_PER_YEAR;
  const apr = issuancePerYear / balance_sum_gwei;
  return apr;
};

const BASE_REWARDS_PER_EPOCH = 4;

const getStakedFromApr = (apr: number): number => {
  const baseReward = (apr * 32e9) / 4 / EPOCHS_PER_YEAR;
  const active_validators =
    ((MAX_EFFECTIVE_BALANCE * BASE_REWARD_FACTOR) /
      BASE_REWARDS_PER_EPOCH /
      baseReward) **
      2 /
    32e9;
  return active_validators * 32;
};

const getBurn = (
  yearlyNonStakedBurnFraction: number,
  nonStakedSupply: number,
) => yearlyNonStakedBurnFraction * nonStakedSupply;

const STAKING_MIN = 0.02;
const STAKING_MAX = 0.05;
const STAKING_RANGE = STAKING_MAX - STAKING_MIN;

const BURN_RATE_MIN = 0.01;
const BURN_RATE_MAX = 0.05;
const BURN_RATE_RANGE = BURN_RATE_MAX - BURN_RATE_MIN;

const EquilibriumWidget: FC = () => {
  const burnRateAll = useGroupedAnalysis1()?.burnRates.burnRateAll;
  const supplyProjectionInputs = useSupplyProjectionInputs();
  const [initialEquilibriumInputsSet, setInitialEquilibriumInputsSet] =
    useState(false);
  const [stakingAprFraction, setStakingAprFraction] = useState<number>(0);
  const [nonStakingBurnFraction, setNonStakingBurnFraction] =
    useState<number>(0);
  const [nowMarker, setNowMarker] = useState<number>();
  const [allMarker, setAllMarker] = useState<number>();
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

    setStakingAprFraction(
      getIssuanceApr(getStakingSupply(supplyProjectionInputs)),
    );
    const nonStakedSupply = getNonStakingSupply(supplyProjectionInputs);
    setNonStakingBurnFraction(burnAsFraction(nonStakedSupply, burnRateAll));
    setNowMarker(getIssuanceApr(getStakingSupply(supplyProjectionInputs)));
    setAllMarker(burnAsFraction(nonStakedSupply, burnRateAll));
    setInitialEquilibriumInputsSet(true);
  }, [burnRateAll, initialEquilibriumInputsSet, supplyProjectionInputs]);

  const historicSupplyByMonth = useMemo(():
    | NEA.NonEmptyArray<Point>
    | undefined => {
    if (supplyProjectionInputs === undefined) {
      return undefined;
    }

    const list = supplyProjectionInputs.supplyByDay.reduce(
      (list: Point[], point) => {
        const last = _.last(list);

        // First loop there is no last to compare to.
        if (last === undefined) {
          return [[point.t, point.v] as Point];
        }

        // If we don't have a point from this month yet, add it.
        if (
          DateFns.getMonth(DateFns.fromUnixTime(last[0])) !==
          DateFns.getMonth(DateFns.fromUnixTime(point.t))
        ) {
          return [...list, [point.t, point.v] as Point];
        }

        // If we already have a point from a given month, don't add another.
        return list;
      },
      [],
    );

    return list as NEA.NonEmptyArray<Point>;
  }, [supplyProjectionInputs]);

  const equilibriums = useMemo(():
    | {
        cashFlowsEquilibrium: number;
        nonStakedSupplyEquilibrium: number;
        supplyEquilibrium: number;
        supplyEquilibriumMap: Record<number, number>;
        supplyEquilibriumSeries: NEA.NonEmptyArray<Point>;
        yearlyIssuanceFraction: number;
      }
    | undefined => {
    if (
      stakingAprFraction === undefined ||
      nonStakingBurnFraction === undefined ||
      supplyProjectionInputs === undefined ||
      historicSupplyByMonth === undefined
    ) {
      return undefined;
    }

    const supplyEquilibriumSeries = [
      ...historicSupplyByMonth,
    ] as NEA.NonEmptyArray<Point>;

    // Now calculate n years into the future to paint an equilibrium.
    let supply = NEA.last(supplyEquilibriumSeries);
    const staked = getStakedFromApr(stakingAprFraction);
    let nonStaked = supply[1] - staked;
    const issuance = getIssuancePerYear(staked);

    const YEARS_TO_SIMULATE = 200;

    for (let i = 0; i < YEARS_TO_SIMULATE; i++) {
      const nextYear = pipe(
        supply[0],
        DateFns.fromUnixTime,
        (dt) => DateFns.addYears(dt, 1),
        DateFns.getUnixTime,
      );
      const burn = getBurn(nonStakingBurnFraction, nonStaked);
      const nextSupply = supply[1] + issuance - burn;

      supply = [nextYear, nextSupply] as Point;

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

    const supplyEquilibrium =
      getIssuancePerYear(staked) / nonStakingBurnFraction + staked;
    const nonStakedSupplyEquilibrium = nonStaked;
    const cashFlowsEquilibrium = getIssuancePerYear(staked);
    const yearlyIssuanceFraction = getIssuanceApr(staked) / staked;

    return {
      cashFlowsEquilibrium,
      nonStakedSupplyEquilibrium,
      supplyEquilibrium,
      supplyEquilibriumMap,
      supplyEquilibriumSeries,
      yearlyIssuanceFraction,
    };
  }, [
    stakingAprFraction,
    nonStakingBurnFraction,
    supplyProjectionInputs,
    historicSupplyByMonth,
  ]);

  const nowMarkerPercent =
    nowMarker !== undefined
      ? ((nowMarker - STAKING_MIN) / STAKING_RANGE) * 100
      : undefined;

  const allMarkerPercent =
    allMarker !== undefined
      ? ((allMarker - BURN_RATE_MIN) / BURN_RATE_RANGE) * 100
      : undefined;

  return (
    <WidgetBackground
      className={`relative flex flex-col md:flex-row-reverse gap-x-4 gap-y-8 overflow-hidden p-0`}
    >
      {/* <div */}
      {/*   className={` */}
      {/*       absolute top-0 right-0 */}
      {/*       w-3/5 h-full */}
      {/*       opacity-[0.25] */}
      {/*       blur-[100px] */}
      {/*     `} */}
      {/* > */}
      {/*   <div */}
      {/*     className={` */}
      {/*         absolute md:bottom-[3.0rem] md:-right-[1.0rem] */}
      {/*         w-4/5 h-3/5 rounded-[35%] */}
      {/*         bg-[#0037FA] */}
      {/*       `} */}
      {/*   ></div> */}
      {/* </div> */}
      {/* Higher z-level to bypass the background blur of our sibling. */}
      <div className="md:w-1/2 flex justify-center items-center z-20">
        {equilibriums !== undefined ? (
          <EquilibriumGraph
            supplyEquilibriumSeries={equilibriums.supplyEquilibriumSeries}
            supplyEquilibriumMap={equilibriums.supplyEquilibriumMap}
            supplyEquilibrium={equilibriums.supplyEquilibrium}
            staking={getStakedFromApr(stakingAprFraction)}
            width={lg ? 400 : md ? 250 : 300}
            height={lg ? 333 : 160}
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
      <div className="md:w-1/2 flex flex-col gap-y-8 z-10 p-8">
        <div>
          <div className="flex justify-between">
            <WidgetTitle>supply equilibrium</WidgetTitle>
            <WidgetTitle className="text-right">staking</WidgetTitle>
          </div>
          <div className="flex justify-between">
            <MoneyAmount amountPostfix="M" textSizeClass="text-xl lg:text-3xl">
              {equilibriums !== undefined
                ? Format.formatOneDigit(equilibriums.supplyEquilibrium / 1e6)
                : undefined}
            </MoneyAmount>
            <MoneyAmount
              amountPostfix="M"
              unitText="ETH"
              textSizeClass="text-xl lg:text-3xl"
            >
              {stakingAprFraction !== undefined && initialEquilibriumInputsSet
                ? Format.formatOneDigit(
                    getStakedFromApr(stakingAprFraction) / 1e6,
                  )
                : undefined}
            </MoneyAmount>
          </div>
        </div>
        <div className="flex flex-col gap-y-5">
          <div>
            <div className="flex justify-between items-baseline -mb-1">
              <div className="flex items-center truncate">
                <WidgetTitle>issuance rewards</WidgetTitle>
                <BodyText className="lg:text-xs invisible lg:visible">
                  &nbsp;for stakers
                </BodyText>
              </div>
              <PercentAmount className="text-base lg:text-lg">
                {stakingAprFraction !== undefined && initialEquilibriumInputsSet
                  ? `${Format.formatPercentOneDigit(stakingAprFraction)}/year`
                  : undefined}
              </PercentAmount>
            </div>
            <div className="relative">
              <Slider2
                min={0.02}
                max={0.05}
                value={stakingAprFraction}
                step={0.0001}
                onChange={(event) =>
                  setStakingAprFraction(Number(event.target.value))
                }
                thumbVisible={initialEquilibriumInputsSet}
              />
              {nowMarker !== undefined && nowMarkerPercent !== undefined && (
                <div
                  className={`
                  relative top-[14px] -translate-x-1/2
                  flex flex-col items-center
                `}
                  style={{
                    // Positions the marker along the track whilst compensating for the thumb width as the browser natively does. 7 being half the thumb width.
                    left: `calc(${nowMarkerPercent}% - ${
                      ((nowMarkerPercent / 100) * 2 - 1) * 7
                    }px)`,
                  }}
                >
                  <div className="w-0.5 h-2 rounded-b-full bg-blue-spindle -mt-0.5"></div>
                  <TimeFrameText className="text-blue-spindle mt-0.5">
                    now
                  </TimeFrameText>
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="flex justify-between items-baseline -mb-1">
              <div className="flex items-center truncate">
                <WidgetTitle>burn rate</WidgetTitle>
                <BodyText className="lg:text-xs invisible lg:visible">
                  &nbsp;for non-stakers
                </BodyText>
              </div>
              <PercentAmount>
                {nonStakingBurnFraction !== undefined &&
                initialEquilibriumInputsSet
                  ? `${Format.formatPercentOneDigit(
                      nonStakingBurnFraction,
                    )}/year`
                  : undefined}
              </PercentAmount>
            </div>
            <div className="relative">
              <Slider2
                min={BURN_RATE_MIN}
                max={BURN_RATE_MAX}
                value={nonStakingBurnFraction}
                step={0.0001}
                onChange={(event) =>
                  setNonStakingBurnFraction(Number(event.target.value))
                }
                thumbVisible={initialEquilibriumInputsSet}
              />
              {allMarker !== undefined && allMarkerPercent !== undefined && (
                <div
                  className={`
                  relative top-[14px] -translate-x-1/2
                  flex flex-col items-center
                `}
                  // Positions the marker along the track whilst compensating for the thumb width as the browser natively does. 7 being half the thumb width.
                  style={{
                    left: `calc(${allMarkerPercent}% - ${
                      ((allMarkerPercent / 100) * 2 - 1) * 7
                    }px)`,
                  }}
                >
                  <div className="w-0.5 h-2 rounded-b-full bg-blue-spindle -mt-0.5"></div>
                  <TimeFrameText className="text-blue-spindle mt-1">
                    all
                  </TimeFrameText>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-baseline">
          <WidgetTitle>issuance and burn match</WidgetTitle>
          <MoneyAmount amountPostfix="M" unitText="ETH/year">
            {equilibriums !== undefined
              ? Format.formatOneDigit(equilibriums.cashFlowsEquilibrium / 1e6)
              : undefined}
          </MoneyAmount>
        </div>
      </div>
    </WidgetBackground>
  );
};

export default EquilibriumWidget;
