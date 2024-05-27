import useSWR from "swr";
import * as Duration from "../../duration";
import { fetchJsonSwr } from "./fetchers";

export type FlippeningDataPoint = {
  marketcapRatio: number;
  t: number;
};

export const useFlippeningData = (): FlippeningDataPoint[] | undefined => {
  const { data } = useSWR<FlippeningDataPoint[]>(
    "/api/v2/fees/flippening-data",
    fetchJsonSwr,
    {
      refreshInterval: Duration.millisFromMinutes(60),
    },
  );

  return data;
};
