import useSWR from "swr";
import { fetchJsonSwr } from "./fetchers";

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
    "/api/v2/fees/supply-projection-inputs",
    fetchJsonSwr,
  );

  return data;
};
