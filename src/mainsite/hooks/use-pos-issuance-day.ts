import type { EthNumber } from "../../eth-units";
import { DAYS_PER_YEAR } from "../../time";
import { useGaugeRates } from "../api/gauge-rates";

export const usePosIssuancePerDay = (): EthNumber =>
  useGaugeRates().d7.issuance_rate_yearly.eth / DAYS_PER_YEAR;
