import useSWR from "swr";
import fetcher from "./default-fetcher";
import { feesBasePath } from "./fees";

export type DataPoint = {
  t: number;
  v: number;
};

export type SupplyInputs = {
  inContractsByDay: DataPoint[];
  inBeaconValidatorsByDay: DataPoint[];
  supplyByDay: DataPoint[];
};

export const useSupplyProjectionInputs = (): SupplyInputs | undefined => {
  const { data } = useSWR<SupplyInputs>(
    `${feesBasePath}/supply-projection-inputs`,
    fetcher,
  );

  return data;
};
