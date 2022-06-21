import useSWR from "swr";
import fetcher from "./default-fetcher";
import { feesBasePath } from "./fees";

type DataPoint = {
  t: number;
  v: number;
};

type SupplyInputs = {
  inContractsByDay: DataPoint[];
  inBeaconValidatorsByDay: DataPoint[];
  supplyByDay: DataPoint[];
};

export const useSupplyProjectionInputs = (): SupplyInputs | undefined => {
  const { data } = useSWR<SupplyInputs>(
    `${feesBasePath}/supply-projection-inputs`,
    fetcher,
  );

  if (data === undefined) {
    return undefined;
  }

  return {
    inContractsByDay: data.inContractsByDay,
    inBeaconValidatorsByDay: data.inBeaconValidatorsByDay,
    supplyByDay: data.supplyByDay,
  };
};
