import * as DateFns from "date-fns";

const GENESIS_TIMESTAMP: Date = DateFns.fromUnixTime(1606824023);

export const getDateTimeFromSlot = (slot: number): Date =>
  DateFns.addSeconds(GENESIS_TIMESTAMP, slot * 12);
