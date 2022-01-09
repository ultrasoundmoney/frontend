/**
 * @deprecated use timeFramesNext instead.
 */
export const timeFrames = ["5m", "1h", "24h", "7d", "30d", "all"] as const;

/**
 * @deprecated use TimeFramesNext instead.
 */
export type TimeFrame = typeof timeFrames[number];

export const timeFramesNext = ["m5", "h1", "d1", "d7", "d30", "all"] as const;
export type TimeFrameNext = typeof timeFramesNext[number];
