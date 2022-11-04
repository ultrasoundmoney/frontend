export const limitedTimeFrames = ["m5", "h1", "d1", "d7", "d30"] as const;
export type LimitedTimeFrame = typeof limitedTimeFrames[number];

export const timeFrames = ["m5", "h1", "d1", "d7", "d30", "all"] as const;
export type TimeFrame = typeof timeFrames[number];

export const displayLimitedTimeFrameMap: Record<LimitedTimeFrame, string> = {
  m5: "5m",
  h1: "1h",
  d1: "1d",
  d7: "7d",
  d30: "30d",
};

export const getNextTimeFrame = (timeFrame: TimeFrame): TimeFrame => {
  const nextIndex = (timeFrames.indexOf(timeFrame) + 1) % timeFrames.length;

  // Index is checked above.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return timeFrames[nextIndex]!;
};

export const timeFramesWithMerge = [...timeFrames, "since_merge"] as const;
export type TimeFrameWithMerge = typeof timeFramesWithMerge[number];
