import * as DateFns from "date-fns";
import mapValues from "lodash/mapValues";
import type { TimeFrame } from "../time-frames";

export type BurnRecord = {
  blockNumber: number;
  baseFeeSum: number;
  minedAt: Date;
};

export type BurnRecords = {
  number: number;
  records: Record<TimeFrame, BurnRecord[]>;
};

type BurnRecordF = {
  blockNumber: number;
  baseFeeSum: number;
  minedAt: string;
};

export type BurnRecordsF = {
  number: number;
  records: Record<TimeFrame, BurnRecordF[]>;
};

export const decodeBurnRecords = (
  rawBurnRecords: BurnRecordsF,
): BurnRecords => ({
  ...rawBurnRecords,
  records: mapValues(rawBurnRecords.records, (records) =>
    records.map((record) => ({
      ...record,
      minedAt: DateFns.parseISO(record.minedAt),
    })),
  ),
});
