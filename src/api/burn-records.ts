import * as DateFns from "date-fns";
import useSWR from "swr";
import * as Duration from "../duration";
import { A, pipe, Re } from "../fp";
import { TimeFrameNext } from "../time-frames";
import fetcher from "./default-fetcher";
import { feesBasePath } from "./fees";

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

export const useBurnRecords = (): BurnRecords | undefined => {
  const { data } = useSWR<RawBurnRecords>(
    `${feesBasePath}/burn-records`,
    fetcher,
    {
      refreshInterval: Duration.millisFromSeconds(4),
    },
  );

  return data === undefined ? undefined : decodeBurnRecords(data);
};
