import type { EthNumber } from "../../eth-units";
import { A, flow, OAlt, pipe, R } from "../../fp";
import type { DateTimeString } from "../../time";
import type { SupplyPoint } from "../sections/SupplyDashboard";
import type { TimeFrame } from "../time-frames";
import type { SupplySeriesCollections } from "./supply-over-time";

export type SupplyChanges = {
  timestamp: DateTimeString;
  posDelta: EthNumber;
  powDelta: EthNumber;
};

export type SupplyChangesPerTimeFrame = Record<TimeFrame, SupplyChanges>;

const deltaFromSeries = (series: SupplyPoint[]): EthNumber =>
  pipe(
    { first: A.head(series), last: A.last(series) },
    OAlt.sequenceStruct,
    OAlt.expect("series should have at least two points"),
    ({ first, last }) => last[1] - first[1],
  );

export const supplyChangesFromCollections = (
  supplySeriesCollections: SupplySeriesCollections,
): SupplyChangesPerTimeFrame =>
  pipe(
    supplySeriesCollections,
    flow(
      R.map((supplySeries) => {
        const posDelta = deltaFromSeries(supplySeries.posSeries);
        const powDelta = deltaFromSeries(supplySeries.powSeries);
        const timestamp = supplySeries.timestamp;
        return {
          posDelta,
          powDelta,
          timestamp,
        };
      }),
    ),
  );
