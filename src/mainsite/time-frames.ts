export const limitedTimeFrames = ["m5", "h1", "d1", "d7", "d30"] as const;
export type LimitedTimeFrame = typeof limitedTimeFrames[number];

/** @deprecated use timeFrames instead, with an API map to convert to/from legacy time frames. */
export const timeFramesOld = ["m5", "h1", "d1", "d7", "d30", "all"] as const;
/** @deprecated use TimeFrame instead, with an API map to convert to/from legacy time frames. */
export type TimeFrameOld = typeof timeFramesOld[number];

export const displayLimitedTimeFrameMap: Record<LimitedTimeFrame, string> = {
  m5: "5m",
  h1: "1h",
  d1: "1d",
  d7: "7d",
  d30: "30d",
};

export const getNextTimeFrameOld = (timeFrame: TimeFrameOld): TimeFrameOld => {
  const nextIndex =
    (timeFramesOld.indexOf(timeFrame) + 1) % timeFramesOld.length;

  // Index is checked above.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return timeFramesOld[nextIndex]!;
};

// We care about the order here. since_merge first then since_burn, therefore
export const timeFrames = [
  ...limitedTimeFrames,
  "since_merge",
  "since_burn",
] as const;
export type TimeFrame = typeof timeFrames[number];

export const getNextTimeFrame = (timeFrame: TimeFrame): TimeFrame => {
  const nextIndex = (timeFrames.indexOf(timeFrame) + 1) % timeFrames.length;

  // Index is checked above.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return timeFrames[nextIndex]!;
};
