import type { EthNumber, EthUsdAmount } from "../../eth-units";
import { A, flow, OAlt, pipe, R } from "../../fp";
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

export type SupplyChangesPerTimeFrame = Record<TimeFrame, SupplyChanges>;

const deltaFromSeries = (
  series: SupplyPoint[],
  ethUsdPrice: number,
): EthUsdAmount =>
  pipe(
    { first: A.head(series), last: A.last(series) },
    OAlt.sequenceStruct,
    OAlt.expect("series should have at least two points"),
    ({ first, last }) => last[1] - first[1],
    (delta) => ({
      eth: delta,
      usd: delta * ethUsdPrice,
    }),
  );

export const supplyChangesFromCollections = (
  supplySeriesCollections: SupplySeriesCollections,
  ethUsdPrice: EthNumber,
  burned: EthNumber,
  timeFrame: TimeFrame,
): SupplyChangesPerTimeFrame =>
  pipe(
    supplySeriesCollections,
    flow(
      R.map((supplySeries) => {
        const delta = {
          pos: deltaFromSeries(supplySeries.posSeries, ethUsdPrice),
          pow:
            // Since burn is a special case. Simulating added proof-of-work
            // from the London hardfork doesn't make sense. It only makes sense
            // to simulate from the merge. This means that the first point in the
            // proof-of-work series is not the point to calculate the delta
            // against. Instead, in that one case, we should use the first point
            // in the proof-of-stake series.
            timeFrame === "since_burn"
              ? deltaFromSeries(
                  [
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    supplySeries.posSeries[0]!,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    supplySeries.powSeries[supplySeries.powSeries.length - 1]!,
                  ],
                  ethUsdPrice,
                )
              : deltaFromSeries(supplySeries.powSeries, ethUsdPrice),
        };
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
    ),
  );
