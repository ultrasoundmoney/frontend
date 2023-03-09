import type { GweiNumber } from "../../eth-units";
import type { DateTimeString } from "../../time";
import { DAYS_PER_YEAR, SLOTS_PER_DAY } from "../../time";
import { useGaugeRates } from "./gauge-rates";

export type IssuanceEstimate = {
  timestamp: DateTimeString;
  issuance_per_slot_gwei: GweiNumber;
};

export const useIssuanceEstimate = (): IssuanceEstimate => {
  const gaugeRates = useGaugeRates();
  const issuance_per_slot_gwei =
    gaugeRates.d7.issuance_rate_yearly.eth / DAYS_PER_YEAR / SLOTS_PER_DAY;
  return {
    issuance_per_slot_gwei,
    timestamp: gaugeRates.d7.timestamp,
  };
};
