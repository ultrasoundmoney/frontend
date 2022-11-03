export const limitedTimeFramesNext = ["m5", "h1", "d1", "d7", "d30"] as const;
export type LimitedTimeFrameNext = typeof limitedTimeFramesNext[number];

export const timeFramesNext = ["m5", "h1", "d1", "d7", "d30", "all"] as const;
export type TimeFrameNext = typeof timeFramesNext[number];

export const displayTimeFrameNextMap: Record<TimeFrameNext, string> = {
  m5: "5m",
  h1: "1h",
  d1: "1d",
  d7: "7d",
  d30: "30d",
  all: "all",
};

export const getNextTimeFrame = (timeFrame: TimeFrameNext): TimeFrameNext => {
  const nextIndex =
    (timeFramesNext.indexOf(timeFrame) + 1) % timeFramesNext.length;

  return timeFramesNext[nextIndex];
};
