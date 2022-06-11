import useSWR from "swr";
import { feesBasePath } from "../api/fees";

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
