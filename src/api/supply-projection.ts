import useSWR from "swr";
import fetcher from "./default-fetcher";
import { feesBasePath } from "./fees";

type DataPoint = {
  t: number;
  v: number;
};

type RawSupplyInputs = {
  lockedData: DataPoint[];
  supplyData: DataPoint[];
  stakedData: DataPoint[];
};

type SupplyInputs = {
  stakingData: DataPoint[];
  contractData: DataPoint[];
  supplyData: DataPoint[];
};

export const useSupplyProjectionInputs = (): SupplyInputs | undefined => {
  const { data } = useSWR<RawSupplyInputs>(
    `${feesBasePath}/supply-projection-inputs`,
    fetcher,
  );

  if (data === undefined) {
    return undefined;
  }

  return {
    stakingData: data.stakedData,
    contractData: data.lockedData,
    supplyData: data.supplyData,
  };
};
