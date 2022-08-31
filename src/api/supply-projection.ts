import useSWR from "swr";
import { fetchJson } from "./fetchers";

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
    "/api/fees/supply-projection-inputs",
    fetchJson,
  );

  return data;
};
