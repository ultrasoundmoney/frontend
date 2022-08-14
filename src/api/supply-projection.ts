import useSWR from "swr";
import type { NEA } from "../fp";
import fetcher from "./default-fetcher";
import { feesBasePath } from "./fees";

export type DataPoint = {
  t: number;
  v: number;
};

export type SupplyInputs = {
  inContractsByDay: NEA.NonEmptyArray<DataPoint>;
  inBeaconValidatorsByDay: NEA.NonEmptyArray<DataPoint>;
  supplyByDay: NEA.NonEmptyArray<DataPoint>;
};

export const useSupplyProjectionInputs = (): SupplyInputs | undefined => {
  const { data } = useSWR<SupplyInputs>(
    `${feesBasePath}/supply-projection-inputs`,
    fetcher,
  );

  if (data === undefined) {
    return undefined;
  }

  return data;
};
