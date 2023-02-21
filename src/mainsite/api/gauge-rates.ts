import { secondsToMilliseconds } from "date-fns";
import useSWR from "swr";
import type { EthNumber } from "../../eth-units";
import type { DateTimeString } from "../../time";
import type { TimeFrame } from "../time-frames";
import type { ApiResult } from "./fetchers";
import { fetchApiJson } from "./fetchers";
import { fetchJsonSwr } from "./fetchers";
import type { BlockNumber } from "./supply-over-time";

export type EthUsdAmount = {
  eth: EthNumber;
  usd: number;
};

export type GaugeRateTimeFrame = {
  block_number: BlockNumber;
  burn_rate_yearly: EthUsdAmount;
  issuance_rate_yearly: EthUsdAmount;
  issuance_rate_yearly_pow: EthUsdAmount;
  supply_growth_rate_yearly: number;
  supply_growth_rate_yearly_pow: number;
  timestamp: DateTimeString;
};

export type GaugeRates = Record<TimeFrame, GaugeRateTimeFrame>;

const url = "/api/v2/fees/gauge-rates";

export const fetchGaugeRates = (): Promise<ApiResult<GaugeRates>> =>
  fetchApiJson<GaugeRates>(url);

export const useGaugeRates = (): GaugeRates => {
  const { data } = useSWR<GaugeRates>(url, fetchJsonSwr, {
    refreshInterval: secondsToMilliseconds(4),
  });

  // We use an SWRConfig with fallback data for this hook.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return data!;
};
