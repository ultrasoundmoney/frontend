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
  inContractsByDay: DataPoint[];
  inBeaconValidatorsByDay: DataPoint[];
  supplyByDay: DataPoint[];
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
    inContractsByDay: data.lockedData,
    inBeaconValidatorsByDay: data.inValidators,
    supplyByDay: data.supplyData,
  };
};
