import * as DateFns from "date-fns";
import _ from "lodash";
import { FC, useEffect, useMemo, useState } from "react";
import { useEffectiveBalanceSum } from "../../api/effective-balance-sum";
import { useGroupedAnalysis1 } from "../../api/grouped-analysis-1";
import {
  SupplyInputs,
  useSupplyProjectionInputs,
} from "../../api/supply-projection";
import { GWEI_PER_ETH, WEI_PER_ETH } from "../../eth-units";
import * as Format from "../../format";
import { NEA, pipe } from "../../fp";
import { MoneyAmount, PercentAmount } from "../Amount";
import Slider2 from "../Slider2";
import { BodyText, TimeFrameText } from "../Texts";
import Twemoji from "../Twemoji";
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
type Gwei = number;

const getIssuancePerYear = (effective_balance_sum: Eth): number => {
  const balance_sum_gwei = effective_balance_sum * GWEI_PER_ETH;
  const max_issuance_per_epoch = Math.trunc(
    (BASE_REWARD_FACTOR * balance_sum_gwei) /
      Math.floor(Math.sqrt(balance_sum_gwei)),
  );
  const issuancePerYear = max_issuance_per_epoch * EPOCHS_PER_YEAR;
  return issuancePerYear / GWEI_PER_ETH;
};

const getIssuanceApr = (effective_balance_sum: Gwei): number => {
  const balance_sum_gwei = effective_balance_sum;
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

const STAKING_MIN = 0.025;
const STAKING_MAX = 0.05;
const STAKING_RANGE = STAKING_MAX - STAKING_MIN;

const BURN_RATE_MIN = 0.0;
const BURN_RATE_MAX = 0.04;
const BURN_RATE_RANGE = BURN_RATE_MAX - BURN_RATE_MIN;

type BurnMarkers = {
  all: number;
  ultrasound: number;
  d30: number;
  d7: number;
  d1: number;
};
type BurnMarker = { label: string; value: number };

const BurnMarkers: FC<{ burnMarkers?: BurnMarkers }> = ({ burnMarkers }) => {
  const markerList: BurnMarker[] = (
    burnMarkers !== undefined
      ? [
          { label: "all", value: burnMarkers.all },
          { label: "30d", value: burnMarkers.d30 },
          { label: "🦇🔊", value: burnMarkers.ultrasound },
          { label: "7d", value: burnMarkers.d7 },
          { label: "1d", value: burnMarkers.d1 },
        ]
      : []
  )
    .reduce((list: BurnMarker[], marker) => {
      const last = _.last(list);

      if (last === undefined) {
        return [marker];
      }

      const distance = Math.abs(marker.value - last.value);
      if (distance < 0.002) {
        return list;
      } else {
        list.push(marker);
        return list;
      }
    }, [])
    .sort((m1, m2) => m1.value - m2.value);

  return (
    <>
      {markerList.map((marker, index) => {
        const percent =
          ((marker.value - BURN_RATE_MIN) / BURN_RATE_RANGE) * 100;
        return (
          <div
            key={marker.label}
            className={`
                  absolute top-[14px] -translate-x-1/2
                  flex flex-col items-center
                `}
            // Positions the marker along the track whilst compensating for the thumb width as the browser natively does. 7 being half the thumb width.
            style={{
              left: `calc(${percent}% - ${((percent / 100) * 2 - 1) * 7}px)`,
            }}
          >
            <div
              className={`
                w-0.5 rounded-b-full bg-blue-spindle -mt-0.5
                ${index % 2 === 0 ? "h-2" : "h-6"}
              `}
            ></div>
            <TimeFrameText className="text-blue-spindle mt-1 select-none">
              <Twemoji className="flex" imageClassName="mt-0.5 h-3" wrapper>
                {marker.label}
              </Twemoji>
            </TimeFrameText>
          </div>
        );
      })}
    </>
  );
};

const EquilibriumWidget: FC = () => {
  const burnRates = useGroupedAnalysis1()?.burnRates;
  const supplyProjectionInputs = useSupplyProjectionInputs();
  const effectiveBalanceSum = useEffectiveBalanceSum();
  const [initialEquilibriumInputsSet, setInitialEquilibriumInputsSet] =
    useState(false);
  const [stakingAprFraction, setStakingAprFraction] = useState<number>(0);
  const [nonStakingBurnFraction, setNonStakingBurnFraction] =
    useState<number>(0);
  const [nowMarker, setNowMarker] = useState<number>();
  const [burnMarkers, setBurnMarkers] = useState<BurnMarkers>();

  // Only runs once because of initialEquilibriumInputsSet, after data loads.
  useEffect(() => {
    if (
      burnRates === undefined ||
      supplyProjectionInputs === undefined ||
      effectiveBalanceSum === undefined ||
      initialEquilibriumInputsSet
    ) {
      return;
    }

    setStakingAprFraction(getIssuanceApr(effectiveBalanceSum));
    const nonStakedSupply = getNonStakingSupply(supplyProjectionInputs);
    setNonStakingBurnFraction(
      burnAsFraction(nonStakedSupply, burnRates.burnRateAll),
    );
    setNowMarker(getIssuanceApr(effectiveBalanceSum));
    setBurnMarkers({
      all: burnAsFraction(nonStakedSupply, burnRates.burnRateAll),
      d1: burnAsFraction(nonStakedSupply, burnRates.burnRate24h),
      d30: burnAsFraction(nonStakedSupply, burnRates.burnRate30d),
      d7: burnAsFraction(nonStakedSupply, burnRates.burnRate7d),
      ultrasound:
        getIssuancePerYear(getStakingSupply(supplyProjectionInputs)) /
        nonStakedSupply,
    });
    setInitialEquilibriumInputsSet(true);
  }, [
    burnRates,
    effectiveBalanceSum,
    initialEquilibriumInputsSet,
    supplyProjectionInputs,
  ]);

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

  return (
    <WidgetBackground
      className={`relative flex-col lg:flex-row-reverse gap-x-4 overflow-hidden p-0`}
    >
      <div
        // will-change-transform is critical for mobile performance of rendering the chart overlayed on this element.
        className={`
            absolute top-0 right-0
            w-3/5 h-full
            opacity-[0.25]
            blur-[100px]
            will-change-transform
          `}
      >
        <div
          className={`
            absolute lg:bottom-[3.0rem] lg:-right-[1.0rem]
            w-4/5 h-3/5 rounded-[35%]
            bg-[#0037FA]
          `}
        ></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-8 gap-x-4 p-8">
        <div>
          <div className="flex justify-between">
            <WidgetTitle>supply equilibrium</WidgetTitle>
            <WidgetTitle className="text-right">staking</WidgetTitle>
          </div>
          <div className="flex justify-between">
            <MoneyAmount
              amountPostfix={nonStakingBurnFraction === 0 ? "" : "M"}
              textSizeClass="text-2xl md:text-3xl"
            >
              {equilibriums !== undefined
                ? Format.formatOneDecimal(equilibriums.supplyEquilibrium / 1e6)
                : undefined}
            </MoneyAmount>
            <MoneyAmount
              amountPostfix="M"
              unitText="ETH"
              textSizeClass="text-2xl md:text-3xl"
            >
              {stakingAprFraction !== undefined && initialEquilibriumInputsSet
                ? Format.formatOneDecimal(
                    getStakedFromApr(stakingAprFraction) / 1e6,
                  )
                : undefined}
            </MoneyAmount>
          </div>
        </div>
        <div className="lg:col-start-2 row-span-3">
          <WidgetTitle className="lg:ml-8">
            ETH supply—200y projection
          </WidgetTitle>
          {equilibriums !== undefined ? (
            <EquilibriumGraph
              supplyEquilibriumSeries={equilibriums.supplyEquilibriumSeries}
              supplyEquilibriumMap={equilibriums.supplyEquilibriumMap}
              supplyEquilibrium={equilibriums.supplyEquilibrium}
              staking={getStakedFromApr(stakingAprFraction)}
            />
          ) : null}
        </div>
        <div className="flex flex-col gap-y-7 -mt-4 lg:mt-6">
          <div>
            <div className="flex justify-between items-baseline">
              <div className="flex items-center truncate">
                <WidgetTitle>issuance rewards</WidgetTitle>
                <BodyText className="text-xs lg:text-xs invisible lg:visible">
                  &nbsp;for stakers
                </BodyText>
              </div>
              <PercentAmount
                amountPostfix="/year"
                className="text-base lg:text-lg"
              >
                {stakingAprFraction !== undefined && initialEquilibriumInputsSet
                  ? Format.formatPercentOneDecimal(stakingAprFraction)
                  : undefined}
              </PercentAmount>
            </div>
            <div className="relative">
              <Slider2
                min={STAKING_MIN}
                max={STAKING_MAX}
                value={stakingAprFraction}
                step={0.001}
                onChange={(event) =>
                  setStakingAprFraction(Number(event.target.value))
                }
                thumbVisible={initialEquilibriumInputsSet}
              />
              {
                <div
                  className={`
                    relative top-[14px] -translate-x-1/2
                    flex flex-col items-center
                    select-none
                    ${nowMarkerPercent === undefined ? "invisible" : "visible"}
                  `}
                  style={{
                    // Positions the marker along the track whilst compensating for the thumb width as the browser natively does. 7 being half the thumb width.
                    left: `calc(${nowMarkerPercent}% - ${
                      (((nowMarkerPercent ?? 0) / 100) * 2 - 1) * 7
                    }px)`,
                  }}
                >
                  <div className="w-0.5 h-2 rounded-b-full bg-blue-spindle -mt-0.5"></div>
                  <TimeFrameText className="text-blue-spindle mt-0.5">
                    now
                  </TimeFrameText>
                </div>
              }
            </div>
          </div>
          <div>
            <div className="flex justify-between items-baseline">
              <div className="flex items-center truncate">
                <WidgetTitle>burn rate</WidgetTitle>
                <BodyText className="text-xs lg:text-xs">
                  &nbsp;for non-stakers
                </BodyText>
              </div>
              <PercentAmount amountPostfix="/year">
                {nonStakingBurnFraction !== undefined &&
                initialEquilibriumInputsSet
                  ? Format.formatPercentOneDecimal(nonStakingBurnFraction)
                  : undefined}
              </PercentAmount>
            </div>
            <div className="relative mb-12">
              <Slider2
                min={BURN_RATE_MIN}
                max={BURN_RATE_MAX}
                value={nonStakingBurnFraction}
                step={0.001}
                onChange={(event) =>
                  setNonStakingBurnFraction(Number(event.target.value))
                }
                thumbVisible={initialEquilibriumInputsSet}
              />
              <BurnMarkers burnMarkers={burnMarkers} />
            </div>
          </div>
        </div>

        <div className="flex items-end">
          <div className="flex flex-col md:flex-row w-full justify-between items-baseline mt-2">
            <WidgetTitle>issuance and burn at equilibrium</WidgetTitle>
            <MoneyAmount amountPostfix="K" unitText="ETH/year">
              {equilibriums !== undefined
                ? Format.formatNoDecimals(
                    equilibriums.cashFlowsEquilibrium / 1e3,
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
