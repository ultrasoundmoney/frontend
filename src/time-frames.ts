/**
 * @deprecated use timeFramesNext instead.
 */
export const timeFrames = ["5m", "1h", "24h", "7d", "30d", "all"] as const;

/**
 * @deprecated use TimeFramesNext instead.
 */
export type TimeFrame = typeof timeFrames[number];

export const limitedTimeFramesNext = ["m5", "h1", "d1", "d7", "d30"] as const;
export type LimitedTimeFrameNext = typeof limitedTimeFramesNext[number];

export const timeFramesNext = ["m5", "h1", "d1", "d7", "d30", "all"] as const;
export type TimeFrameNext = typeof timeFramesNext[number];

export const nextFromTimeFrame: Record<TimeFrame, TimeFrameNext> = {
  "5m": "m5",
  "1h": "h1",
  "24h": "d1",
  "7d": "d7",
  "30d": "d30",
  all: "all",
};

export const timeFrameFromNext: Record<TimeFrameNext, TimeFrame> = {
  m5: "5m",
  h1: "1h",
  d1: "24h",
  d7: "7d",
  d30: "30d",
  all: "all",
};

export const displayTimeFrameMap: Record<TimeFrame, string> = {
  "5m": "5m",
  "1h": "1h",
  "24h": "1d",
  "7d": "7d",
  "30d": "30d",
  all: "all",
};

export const displayTimeFrameNextMap: Record<TimeFrameNext, string> = {
  m5: "5m",
  h1: "1h",
  d1: "1d",
  d7: "7d",
  d30: "30d",
  all: "all",
  merge: "since_merge",
};

export const timeFrameNextNextFromNextMap: Record<
  TimeFrameNext,
  TimeFrameWithBurnWithMerge
> = {
  all: "since_burn",
  d1: "d1",
  d30: "d30",
  d7: "d7",
  h1: "h1",
  m5: "m5",
};

export const getNextTimeFrame = (timeFrame: TimeFrameNext): TimeFrameNext => {
  const nextIndex =
    (timeFramesNext.indexOf(timeFrame) + 1) % timeFramesNext.length;

  return timeFramesNext[nextIndex];
};
