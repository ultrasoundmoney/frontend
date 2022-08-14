import type { TimeFrameNext } from "../time-frames";

/** RFC 3339 date time string */
type DateTimeString = string;

export type BurnRecord = {
  blockNumber: number;
  baseFeeSum: number;
  minedAt: DateTimeString;
};

export type BurnRecords = {
  number: number;
  records: Record<TimeFrameNext, BurnRecord[]>;
};
