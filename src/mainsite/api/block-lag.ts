import useSWR from "swr";
import * as Duration from "../../duration";
import { fetchJsonSwr } from "./fetchers";

export type BlockLag = {
  blockLag: number;
};

export const useBlockLag = () => {
  const { data } = useSWR<BlockLag>("/api/fees/block-lag", fetchJsonSwr, {
    refreshInterval: Duration.millisFromSeconds(4),
  });

  return data;
};
