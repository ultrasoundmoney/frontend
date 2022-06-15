import useSWR from "swr";
import * as Duration from "../duration";
import fetcher from "./default-fetcher";
import { feesBasePath } from "./fees";

export type BlockLag = {
  blockLag: number;
};

export const useBlockLag = () => {
  const { data } = useSWR<BlockLag>(`${feesBasePath}/block-lag`, fetcher, {
    refreshInterval: Duration.millisFromSeconds(2),
  });

  return data;
};
