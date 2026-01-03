import type { EthNumber, EthUsdAmount } from "../../eth-units";
import { O, OAlt, pipe } from "../../fp";
import type { DateTimeString } from "../../time";
import type { SupplyPoint } from "../sections/SupplyDashboard";
import type { TimeFrame } from "../time-frames";
import type { SupplySeriesCollections } from "./supply-over-time";

// USD amounts exist, but we're unhappy with using average USD prices over time frames to calculate USD amounts and will wait until the backend can provide the amounts instead.
export type SupplyChanges = {
  timestamp: DateTimeString;
  burned: EthUsdAmount;
  issued: {
    pos: EthUsdAmount;
    pow: EthUsdAmount;
  };
  delta: {
    pos: EthUsdAmount;
    pow: EthUsdAmount;
  };
};

const deltaFromSeries = (
  series: SupplyPoint[],
  ethUsdPrice: number,
): O.Option<EthUsdAmount> => {
  if (series.length < 2) {
    return O.none;
  }

  const first = series[0];
  const last = series[series.length - 1];
  if (first === undefined || last === undefined) {
    return O.none;
  }
  const delta = last[1] - first[1];

  return O.some({
    eth: delta,
    usd: delta * ethUsdPrice,
  });
};

const deltaFromPoints = (
  first: SupplyPoint | undefined,
  last: SupplyPoint | undefined,
  ethUsdPrice: number,
): O.Option<EthUsdAmount> => {
  if (first === undefined || last === undefined) {
    return O.none;
  }

  const delta = last[1] - first[1];
  return O.some({
    eth: delta,
    usd: delta * ethUsdPrice,
  });
};

export const supplyChangesForTimeFrame = (
  supplySeriesCollections: SupplySeriesCollections,
  ethUsdPrice: EthNumber,
  burned: EthNumber,
  timeFrame: TimeFrame,
): O.Option<SupplyChanges> => {
  const supplySeries = supplySeriesCollections[timeFrame];
  const deltaPos = deltaFromSeries(supplySeries.posSeries, ethUsdPrice);
  const deltaPow =
    // Since burn is a special case. Simulating added proof-of-work
    // from the London hardfork doesn't make sense. It only makes sense
    // to simulate from the merge. This means that the first point in the
    // proof-of-work series is not the point to calculate the delta
    // against. Instead, in that one case, we should use the first point
    // in the proof-of-stake series.
    timeFrame === "since_burn"
      ? deltaFromPoints(
          supplySeries.posSeries[0],
          supplySeries.powSeries[supplySeries.powSeries.length - 1],
          ethUsdPrice,
        )
      : deltaFromSeries(supplySeries.powSeries, ethUsdPrice);

  return pipe(
    OAlt.sequenceStruct({ pos: deltaPos, pow: deltaPow }),
    O.map((delta) => {
      const timestamp = supplySeries.timestamp;
      const issued = {
        pos: {
          eth: delta.pos.eth + burned,
          usd: delta.pos.usd + burned,
        },
        pow: {
          eth: delta.pow.eth + burned,
          usd: delta.pow.usd + burned,
        },
      };

      return {
        burned: {
          eth: burned,
          usd: burned,
        },
        delta,
        issued,
        timestamp,
      };
    }),
  );
};
