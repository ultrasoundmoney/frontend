import * as DateFns from "date-fns";
import _ from "lodash";
import type { TimeFrameNext } from "../time-frames";

export type BurnRecord = {
  blockNumber: number;
  baseFeeSum: number;
  minedAt: Date;
};

export type BurnRecords = {
  number: number;
  records: Record<TimeFrameNext, BurnRecord[]>;
};

type BurnRecordF = {
  blockNumber: number;
  baseFeeSum: number;
  minedAt: string;
};

export type BurnRecordsF = {
  number: number;
  records: Record<TimeFrameNext, BurnRecordF[]>;
};

export const decodeBurnRecords = (
  rawBurnRecords: BurnRecordsF,
): BurnRecords => ({
  ...rawBurnRecords,
  records: _.mapValues(rawBurnRecords.records, (records) =>
    records.map((record) => ({
      ...record,
      minedAt: DateFns.parseISO(record.minedAt),
    })),
  ),
});
