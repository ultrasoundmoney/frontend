import * as DateFns from "date-fns";
import { A, pipe, Re } from "../fp";
import { TimeFrameNext } from "../time-frames";

export type BurnRecord = {
  blockNumber: number;
  baseFeeSum: number;
  minedAt: Date;
};

export type BurnRecords = {
  number: number;
  records: Record<TimeFrameNext, BurnRecord[]>;
};

type RawBurnRecord = {
  blockNumber: number;
  baseFeeSum: number;
  minedAt: string;
};

export type RawBurnRecords = {
  number: number;
  records: Record<TimeFrameNext, RawBurnRecord[]>;
};

export const decodeBurnRecords = (rawBurnRecords: RawBurnRecords) =>
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
