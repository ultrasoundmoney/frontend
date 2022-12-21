import * as DateFns from "date-fns";
import _last from "lodash/last";
import dynamic from "next/dynamic";
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import { useBurnRates } from "../../api/burn-rates";
import { useEffectiveBalanceSum } from "../../api/effective-balance-sum";
import { useImpreciseEthSupply } from "../../api/eth-supply";
import { useSupplyProjectionInputs } from "../../api/supply-projection";
import type { Eth, Gwei } from "../../eth-units";
import { GWEI_PER_ETH, WEI_PER_ETH } from "../../eth-units";
import * as Format from "../../format";
import { MoneyAmount, PercentAmount } from "../Amount";
import Slider2 from "../Slider2";
import { TimeFrameText } from "../Texts";
import BodyText from "../TextsNext/BodyText";
import Twemoji from "../Twemoji";
import WidgetErrorBoundary from "../WidgetErrorBoundary";
import { WidgetBackground, WidgetTitle } from "../WidgetSubcomponents";
const EquilibriumGraph = dynamic(() => import("./EquilibriumGraph"));

type UnixTimestamp = number;
type Point = [UnixTimestamp, number];

const YEAR_IN_MINUTES = 365.25 * 24 * 60;

const burnAsFraction = (nonStakingSupply: number, weiBurnPerMinute: number) =>
  ((weiBurnPerMinute / WEI_PER_ETH) * YEAR_IN_MINUTES) / nonStakingSupply;

const MAX_EFFECTIVE_BALANCE: number = 32 * GWEI_PER_ETH;
const SECONDS_PER_SLOT = 12;
const SLOTS_PER_EPOCH = 32;
const EPOCHS_PER_DAY: number =
  (24 * 60 * 60) / SLOTS_PER_EPOCH / SECONDS_PER_SLOT;
const EPOCHS_PER_YEAR: number = 365.25 * EPOCHS_PER_DAY;

const BASE_REWARD_FACTOR = 64;

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
  const markerList: BurnMarker[] =
    burnMarkers !== undefined
      ? [
          { label: "all", value: burnMarkers.all },
          { label: "🦇🔊🚧", value: burnMarkers.ultrasound },
          { label: "30d", value: burnMarkers.d30 },
          { label: "7d", value: burnMarkers.d7 },
          { label: "1d", value: burnMarkers.d1 },
        ]
      : [];

  const shownList = markerList.reduce((list: BurnMarker[], marker) => {
    const someConflict = list.some(
      (shownMarker) => Math.abs(shownMarker.value - marker.value) < 0.0017,
    );

    if (someConflict) {
      return list;
    }

    return [...list, marker];
  }, []);

  return (
    <>
      {shownList.map((marker, index) => {
        const percent =
          ((marker.value - BURN_RATE_MIN) / BURN_RATE_RANGE) * 100;
        return (
          <div
            key={marker.label}
            className={`
              absolute top-[14px] flex
              -translate-x-1/2 flex-col items-center
            `}
            // Positions the marker along the track whilst compensating for the thumb width as the browser natively does. 7 being half the thumb width.
            style={{
              left: `calc(${percent}% - ${((percent / 100) * 2 - 1) * 7}px)`,
            }}
          >
            <div
              className={`
                -mt-0.5 w-0.5 rounded-b-full bg-slateus-200
                ${index % 2 === 0 ? "h-2" : "h-6"}
              `}
            ></div>
            <TimeFrameText className="mt-1 select-none text-slateus-200">
              <Twemoji
                className="flex gap-x-1"
                imageClassName="mt-0.5 h-3"
                wrapper
              >
                {marker.label}
              </Twemoji>
            </TimeFrameText>
          </div>
        );
      })}
    </>
  );
};

const EquilibriumWidget = () => {
  const burnRates = useBurnRates();
  const supplyProjectionInputs = useSupplyProjectionInputs();
  const ethSupply = useImpreciseEthSupply();
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
      ethSupply === undefined ||
      effectiveBalanceSum === undefined ||
      initialEquilibriumInputsSet
    ) {
      return;
    }

    const initialStakingApr = getIssuanceApr(effectiveBalanceSum);
    const staked = effectiveBalanceSum / 1e9;
    const nonStakedSupply = ethSupply - staked;

    setInitialEquilibriumInputsSet(true);
    setStakingAprFraction(initialStakingApr);
    setNowMarker(initialStakingApr);
    setNonStakingBurnFraction(
      burnAsFraction(nonStakedSupply, burnRates.burnRateAll),
    );
    setBurnMarkers({
      all: burnAsFraction(nonStakedSupply, burnRates.burnRateAll),
      d1: burnAsFraction(nonStakedSupply, burnRates.burnRate24h),
      d30: burnAsFraction(nonStakedSupply, burnRates.burnRate30d),
      d7: burnAsFraction(nonStakedSupply, burnRates.burnRate7d),
      ultrasound: getIssuancePerYear(staked) / nonStakedSupply,
    });
  }, [
    burnRates,
    effectiveBalanceSum,
    ethSupply,
    initialEquilibriumInputsSet,
    stakingAprFraction,
  ]);

  useEffect(() => {
    if (
      burnRates === undefined ||
      effectiveBalanceSum === undefined ||
      ethSupply === undefined
    ) {
      return;
    }
    const issuancePerYear = getIssuancePerYear(
      getStakedFromApr(stakingAprFraction),
    );
    const nonStakedSupply = ethSupply - getStakedFromApr(stakingAprFraction);
    setBurnMarkers((burnMarkers) =>
      burnMarkers !== undefined
        ? {
            ...burnMarkers,
            ultrasound: issuancePerYear / nonStakedSupply,
          }
        : undefined,
    );
  }, [burnRates, effectiveBalanceSum, ethSupply, stakingAprFraction]);

  const historicSupplyByMonth = useMemo((): Point[] | undefined => {
    if (supplyProjectionInputs === undefined) {
      return undefined;
    }

    const list = supplyProjectionInputs.supplyByDay.reduce(
      (list: Point[], point) => {
        const last = _last(list);

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

    return list;
  }, [supplyProjectionInputs]);

  const equilibriums = useMemo(():
    | {
        cashFlowsEquilibrium: number;
        nonStakedSupplyEquilibrium: number;
        supplyEquilibrium: number;
        supplyEquilibriumMap: Record<number, number>;
        supplyEquilibriumSeries: Point[];
        yearlyIssuanceFraction: number;
      }
    | undefined => {
    if (
      stakingAprFraction === undefined ||
      nonStakingBurnFraction === undefined ||
      historicSupplyByMonth === undefined ||
      ethSupply === undefined
    ) {
      return undefined;
    }

    const supplyEquilibriumSeries = [...historicSupplyByMonth];

    // Now calculate n years into the future to paint an equilibrium.
    let supply: Point = [
      DateFns.getUnixTime(DateFns.startOfDay(new Date())),
      ethSupply,
    ];
    const staked = getStakedFromApr(stakingAprFraction);
    let nonStaked = supply[1] - staked;
    const issuance = getIssuancePerYear(staked);

    const YEARS_TO_SIMULATE = 200;

    for (let i = 0; i < YEARS_TO_SIMULATE; i++) {
      const yearDateTime = DateFns.fromUnixTime(supply[0]);
      const nextYear = DateFns.getUnixTime(DateFns.addYears(yearDateTime, 1));
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
    historicSupplyByMonth,
    ethSupply,
  ]);

  const nowMarkerPercent =
    nowMarker !== undefined
      ? ((nowMarker - STAKING_MIN) / STAKING_RANGE) * 100
      : undefined;

  return (
    <WidgetErrorBoundary title="supply equilibrium">
      <WidgetBackground
        className={`relative flex-col gap-x-4 overflow-hidden p-0 lg:flex-row-reverse`}
      >
        <div
          // will-change-transform is critical for mobile performance of rendering the chart overlayed on this element.
          className={`
            pointer-events-none absolute top-0
            right-0 h-full
            w-3/5
            opacity-[0.25]
            blur-[100px]
            will-change-transform
          `}
        >
          <div
            className={`
              pointer-events-none absolute h-3/5
              w-4/5 rounded-[35%] bg-[#0037FA]
              lg:bottom-[3.0rem]
              lg:-right-[1.0rem]
            `}
          ></div>
        </div>
        <div className="grid grid-cols-1 gap-y-8 gap-x-8 p-8 lg:grid-cols-2">
          <div className="flex justify-between">
            <div className="flex flex-col gap-y-4">
              <WidgetTitle className="hidden md:inline">
                supply equilibrium
              </WidgetTitle>
              <WidgetTitle className="inline md:hidden">
                equilibrium (A)
              </WidgetTitle>
              <MoneyAmount
                amountPostfix={nonStakingBurnFraction === 0 ? "" : "M"}
                textSizeClass="text-2xl md:text-3xl"
              >
                {equilibriums !== undefined
                  ? Format.formatOneDecimal(
                      equilibriums.supplyEquilibrium / 1e6,
                    )
                  : undefined}
              </MoneyAmount>
            </div>
            <div className="flex flex-col gap-y-4">
              <WidgetTitle className="hidden text-right md:inline">
                staking
              </WidgetTitle>
              <WidgetTitle className="inline text-right md:hidden">
                staking (B)
              </WidgetTitle>
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
          <div className="row-span-3 lg:col-start-2">
            <WidgetTitle className="lg:ml-6">
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
          <div className="flex flex-col gap-y-7">
            <div>
              <div className="flex items-baseline justify-between">
                <div className="flex items-center truncate">
                  <WidgetTitle>issuance rewards</WidgetTitle>
                  <BodyText className="invisible text-xs md:text-xs lg:visible">
                    &nbsp;for stakers
                  </BodyText>
                </div>
                <PercentAmount
                  amountPostfix="/year"
                  className="text-base lg:text-lg"
                >
                  {stakingAprFraction !== undefined &&
                  initialEquilibriumInputsSet
                    ? Format.formatPercentOneDecimal(stakingAprFraction)
                    : undefined}
                </PercentAmount>
              </div>
              {/* Thumb appears behind the track without the z-10. */}
              <div className="relative z-10">
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
                <div
                  className={`
                  relative top-[14px] flex
                  -translate-x-1/2 select-none flex-col
                  items-center
                  ${nowMarkerPercent === undefined ? "invisible" : "visible"}
                `}
                  style={{
                    // Positions the marker along the track whilst compensating for the thumb width as the browser natively does. 7 being half the thumb width.
                    left: `calc(${nowMarkerPercent}% - ${
                      (((nowMarkerPercent ?? 0) / 100) * 2 - 1) * 7
                    }px)`,
                  }}
                >
                  <div className="-mt-0.5 h-2 w-0.5 rounded-b-full bg-slateus-200"></div>
                  <TimeFrameText className="mt-0.5 text-slateus-200">
                    now
                  </TimeFrameText>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <div className="flex items-center truncate">
                  <WidgetTitle>burn rate</WidgetTitle>
                  <BodyText className="text-xs md:text-xs">
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
              <div className="relative mb-10">
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

          <div className="mt-2 -mb-2 flex w-full flex-col items-baseline justify-between md:flex-row">
            <WidgetTitle>issuance and burn at equilibrium</WidgetTitle>
            <MoneyAmount amountPostfix="K" unitText="ETH/year">
              {equilibriums !== undefined
                ? Format.formatZeroDecimals(
                    equilibriums.cashFlowsEquilibrium / 1e3,
                  )
                : undefined}
            </MoneyAmount>
          </div>
        </div>
      </WidgetBackground>
    </WidgetErrorBoundary>
  );
};

export default EquilibriumWidget;
