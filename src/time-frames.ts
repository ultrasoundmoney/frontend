export const limitedTimeFrames = ["m5", "h1", "d1", "d7", "d30"] as const;
export type LimitedTimeFrame = typeof limitedTimeFrames[number];

export const timeFrames = ["m5", "h1", "d1", "d7", "d30", "all"] as const;
export type TimeFrame = typeof timeFrames[number];

export const displayTimeFrameMap: Record<TimeFrame, string> = {
  m5: "5m",
  h1: "1h",
  d1: "1d",
  d7: "7d",
  d30: "30d",
  all: "all",
};

export const getNextTimeFrame = (timeFrame: TimeFrame): TimeFrame => {
  const nextIndex = (timeFrames.indexOf(timeFrame) + 1) % timeFrames.length;

  return timeFrames[nextIndex];
};
