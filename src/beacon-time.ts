import * as DateFns from "date-fns";

const GENESIS_TIMESTAMP: Date = DateFns.fromUnixTime(1606824023);

export const dateTimeFromSlot = (slot: number): Date =>
  DateFns.addSeconds(GENESIS_TIMESTAMP, slot * 12);
