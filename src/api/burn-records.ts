import * as DateFns from "date-fns";
import { A, pipe, Re } from "../fp";
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

export const decodeBurnRecords = (rawBurnRecords: BurnRecordsF) =>
  pipe({
    ...rawBurnRecords,
    records: pipe(
      rawBurnRecords.records,
      Re.map(
        A.map((rawBurnRecord) => ({
          ...rawBurnRecord,
          minedAt: DateFns.parseISO(rawBurnRecord.minedAt),
        })),
      ),
    ),
  });
