export type RelayApiTimeFrames = "sevenDays" | "thirtyDays";
export const timeFrameMap: Record<"d7" | "d30", RelayApiTimeFrames> = {
  d7: "sevenDays",
  d30: "thirtyDays",
};
