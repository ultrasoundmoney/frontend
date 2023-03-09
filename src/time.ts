/// An RFC 3339 date-time string.
export type DateTimeString = string;

// Unix timestamp in milliseconds.
export type JsTimestamp = number;

export const DAYS_PER_YEAR = 365.25;

import * as DateFns from "date-fns";

const GENESIS_TIMESTAMP: Date = DateFns.fromUnixTime(1606824023);

export const dateTimeFromSlot = (slot: number): Date =>
  DateFns.addSeconds(GENESIS_TIMESTAMP, slot * 12);

export const SECONDS_PER_SLOT = 12;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;

const SLOTS_PER_MINUTE = SECONDS_PER_MINUTE / SECONDS_PER_SLOT;
export const SLOTS_PER_DAY =
  HOURS_PER_DAY * MINUTES_PER_HOUR * SLOTS_PER_MINUTE;
