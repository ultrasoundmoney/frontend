import useSWR from "swr";
import fetcher from "./default-fetcher";
import { feesBasePath } from "./fees";

type DataPoint = {
  t: number;
  v: number;
};

type RawSupplyInputs = {
  inValidators: DataPoint[];
  lockedData: DataPoint[];
  stakedData: DataPoint[];
  supplyData: DataPoint[];
};

type SupplyInputs = {
  contractData: DataPoint[];
  inValidators: DataPoint[];
  stakingData: DataPoint[];
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
    contractData: data.lockedData,
    inValidators: data.inValidators,
    stakingData: data.stakedData,
    supplyData: data.supplyData,
  };
};
