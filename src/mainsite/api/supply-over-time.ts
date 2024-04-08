import * as DateFns from "date-fns";
import { secondsToMilliseconds } from "date-fns";
import _first from "lodash/first";
import { useMemo } from "react";
import useSWR from "swr";
import type { Slot } from "../../beacon-units";
import type { EthNumber } from "../../eth-units";
import type { ApiResult } from "../../fetchers";
import { A, O, OAlt, pipe, Record, RA } from "../../fp";
import type { DateTimeString } from "../../time";
import { MERGE_TIMESTAMP } from "../hardforks/paris";
import { usePosIssuancePerDay } from "../hooks/use-pos-issuance-day";
import type { SupplyPoint } from "../sections/SupplyDashboard";
import { powIssuancePerDay } from "../static-ether-data";
import type { TimeFrame } from "../time-frames";
import { timeFrames } from "../time-frames";
import { fetchApiJson, fetchJsonSwr } from "./fetchers";

export type SupplyAtTime = {
  slot: Slot | null;
  supply: EthNumber;
  timestamp: DateTimeString;
};

export type BlockNumber = number;

// These may be empty when our backend fails to sync blocks for more than 5
// minutes.
export type SupplyOverTime = {
  block_number: BlockNumber;
  d1: SupplyAtTime[];
  d30: SupplyAtTime[];
  d7: SupplyAtTime[];
  h1: SupplyAtTime[];
  m5: SupplyAtTime[];
  since_merge: SupplyAtTime[];
  since_burn: SupplyAtTime[];
  slot: Slot;
  timestamp: DateTimeString;
};

const url = "/api/v2/fees/supply-over-time";

export const fetchSupplyOverTime = (): Promise<ApiResult<SupplyOverTime>> =>
  fetchApiJson<SupplyOverTime>(url);

export const useSupplyOverTime = (): SupplyOverTime | undefined =>
  useSWR<SupplyOverTime>(url, fetchJsonSwr, {
    refreshInterval: secondsToMilliseconds(4),
  }).data;

const BITCOIN_SUPPLY_AT_MERGE = 19_152_350;
const BITCOIN_ISSUANCE_PER_TEN_MINUTES = 6.25;
const BITCOIN_ISSUANCE_PER_SECOND =
  BITCOIN_ISSUANCE_PER_TEN_MINUTES / (60 * 10);
const BITCOIN_HALVENING_SECONDS_AFTER_MERGE = 31536000 * 1.5; // hardcoded to 1 year for testing - TODO: Replace with correct value
const BITCOIN_ISSUANCE_PER_SECOND_AFTER_HALVENING =
  BITCOIN_ISSUANCE_PER_SECOND / 2;

const SLOTS_PER_DAY = 24 * 60 * 5;

const calculateBitcoinIssuedSinceMerge = function (startTime: number, secondsDelta: number) {
  let result;
  if (startTime + secondsDelta < BITCOIN_HALVENING_SECONDS_AFTER_MERGE) {
    // Time frame ends before halfening - same logic as before
    result = secondsDelta * BITCOIN_ISSUANCE_PER_SECOND;
  } else if (startTime > BITCOIN_HALVENING_SECONDS_AFTER_MERGE) {
    // Time frame begins after halfening just change issuance rate
    result = secondsDelta * BITCOIN_ISSUANCE_PER_SECOND_AFTER_HALVENING;
  } else {
    // Time frame stretches across halfening, calcualte issuance before and after halfening and add up
    result =
      (BITCOIN_HALVENING_SECONDS_AFTER_MERGE - startTime ) * BITCOIN_ISSUANCE_PER_SECOND +
      (secondsDelta + startTime - BITCOIN_HALVENING_SECONDS_AFTER_MERGE) *
        BITCOIN_ISSUANCE_PER_SECOND_AFTER_HALVENING;
  }
  return result;
};
const btcSeriesFromPos = (
  ethPosSeries: SupplyPoint[],
): [SupplyPoint[], SupplyPoint[]] => {
  const ethPosFirstPoint = pipe(
    ethPosSeries,
    A.head,
    OAlt.expect("ethPosSeries should have at least one point"),
  );
  const parisToTimeFrameSeconds = DateFns.differenceInSeconds(
    ethPosFirstPoint[0],
    MERGE_TIMESTAMP,
  );
  const firstPointBitcoinSupply =
    BITCOIN_SUPPLY_AT_MERGE +
    calculateBitcoinIssuedSinceMerge(0, parisToTimeFrameSeconds);
    console.log("ethPosFirstPoint", ethPosFirstPoint);
  const points = ethPosSeries.map(([timestamp]) => {
    const secondsDelta =
      ethPosFirstPoint[0] === undefined
        ? 0
        : DateFns.differenceInSeconds(timestamp, ethPosFirstPoint[0]);
    const bitcoinIssued = calculateBitcoinIssuedSinceMerge(parisToTimeFrameSeconds, secondsDelta);
    const nextPoint = [
      timestamp,
      firstPointBitcoinSupply + bitcoinIssued,
    ] as SupplyPoint;
    return nextPoint;
  });
  const scalingConstant = ethPosFirstPoint[1] / firstPointBitcoinSupply;
  const pointsScaled = points.map(([timestamp, bitcoinSupply]) => {
    return [timestamp, bitcoinSupply * scalingConstant] as SupplyPoint;
  });
  return [points, pointsScaled];
};

const powSeriesFromPos = (
  ethPosSeries: SupplyPoint[],
  powMinPosIssuancePerDay: EthNumber,
  timeFrame: TimeFrame,
): SupplyPoint[] =>
  pipe(
    ethPosSeries,
    A.filter(([timestamp]) => new Date(timestamp) >= MERGE_TIMESTAMP),
    A.map(([timestamp, supply]) => {
      const firstPoint = _first(ethPosSeries);
      // Map can only be called for points that are not undefined.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const firstPointTimestamp = new Date(firstPoint![0]);
      const slotsSinceStart =
        DateFns.differenceInSeconds(new Date(timestamp), firstPointTimestamp) /
        12;
      const slotsSinceMerge =
        DateFns.differenceInSeconds(new Date(timestamp), MERGE_TIMESTAMP) / 12;
      const slotCount =
        timeFrame === "since_burn" ? slotsSinceMerge : slotsSinceStart;

      const simulatedPowIssuanceSinceStart =
        (slotCount / SLOTS_PER_DAY) * powMinPosIssuancePerDay;

      const nextSupply = supply + simulatedPowIssuanceSinceStart;
      const nextPoint: SupplyPoint = [timestamp, nextSupply];
      return nextPoint;
    }),
  );

const supplyPointFromSupplyAtTime = (supplyAtTime: SupplyAtTime): SupplyPoint =>
  [
    new Date(supplyAtTime.timestamp).getTime(),
    supplyAtTime.supply,
  ] as SupplyPoint;

export type SupplySeriesCollection = {
  btcSeries: SupplyPoint[];
  btcSeriesScaled: SupplyPoint[];
  posSeries: SupplyPoint[];
  powSeries: SupplyPoint[];
  timestamp: DateTimeString;
};

export type SupplySeriesCollections = Record<TimeFrame, SupplySeriesCollection>;

// We use four series to show supply over time. Three of which are derivatives
// of the first. As the response is currently rather large, containing an
// update for all time frames every block, even though 99% of the data is the
// same. We derive the other series from the first.
export const useSupplySeriesCollections =
  (): O.Option<SupplySeriesCollections> => {
    const supplyOverTimePerTimeFrame = useSupplyOverTime();
    const posIssuancePerDay = usePosIssuancePerDay();
    // To compare proof of stake issuance to proof of work issuance we offer a
    // "simulate proof of work" toggle. However, we only have a supply series under
    // proof of stake. Already including proof of stake issuance. Adding proof of
    // work issuance would mean "simulated proof of work" is really what supply
    // would look like if there was both proof of work _and_ proof of stake
    // issuance. To make the comparison apples to apples we subtract an estimated
    // proof of stake issuance to show the supply as if there were _only_ proof of
    // work issuance. A possible improvement would be to drop this ad-hoc solution
    // and have the backend return separate series.
    const powMinPosIssuancePerDay = powIssuancePerDay - posIssuancePerDay;

    return useMemo(
      () =>
        pipe(
          supplyOverTimePerTimeFrame,
          O.fromNullable,
          O.map((supplyOverTimePerTimeFrame) =>
            pipe(
              // If only supply over time was a proper hashmap, we wouldn't need a complex zip here.
              timeFrames,
              RA.toArray,
              A.map(
                (timeFrame) =>
                  [timeFrame, supplyOverTimePerTimeFrame[timeFrame]] as const,
              ),
              A.map(([timeFrame, supplyOverTime]) => {
                const posSeries = pipe(
                  supplyOverTime,
                  A.map(supplyPointFromSupplyAtTime),
                );
                const powSeries = powSeriesFromPos(
                  posSeries,
                  powMinPosIssuancePerDay,
                  timeFrame,
                );
                const [btcSeries, btcSeriesScaled] =
                  btcSeriesFromPos(posSeries);
                return [
                  timeFrame,
                  {
                    btcSeries,
                    btcSeriesScaled,
                    posSeries,
                    powSeries,
                    timestamp: supplyOverTimePerTimeFrame.timestamp,
                  },
                ] as [TimeFrame, SupplySeriesCollection];
              }),
              (entries) =>
                Record.fromEntries(entries) as SupplySeriesCollections,
            ),
          ),
        ),
      [powMinPosIssuancePerDay, supplyOverTimePerTimeFrame],
    );
  };
