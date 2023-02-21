import * as DateFns from "date-fns";
import JSBI from "jsbi";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import type { Slot } from "../../beacon-units";
import { getDomain } from "../../config";
import * as Duration from "../../duration";
import type { EthNumber, GweiString, WeiJSBI } from "../../eth-units";
import { WEI_PER_ETH } from "../../eth-units";
import { WEI_PER_GWEI_JSBI } from "../../eth-units";
import type { ApiResult } from "./fetchers";
import { fetchApiJson, fetchJsonSwr } from "./fetchers";

export type SupplyPartsF = {
  beaconBalancesSumNext: GweiString;
  beaconDepositsSumNext: GweiString;
  executionBalancesSumNext: GweiString;
  slot: Slot;
};

export type SupplyParts = {
  beaconBalancesSum: WeiJSBI;
  beaconDepositsSum: WeiJSBI;
  executionBalancesSum: WeiJSBI;
  slot: number;
};

export const decodeEthSupply = (supplyParts: SupplyPartsF): SupplyParts => ({
  beaconBalancesSum: JSBI.multiply(
    JSBI.BigInt(supplyParts.beaconBalancesSumNext),
    WEI_PER_GWEI_JSBI,
  ),
  beaconDepositsSum: JSBI.multiply(
    JSBI.BigInt(supplyParts.beaconDepositsSumNext),
    WEI_PER_GWEI_JSBI,
  ),
  executionBalancesSum: JSBI.BigInt(supplyParts.executionBalancesSumNext),
  slot: supplyParts.slot,
});

export const ethSupplyFromParts = (supplyParts: SupplyParts): WeiJSBI =>
  JSBI.subtract(
    JSBI.add(supplyParts.executionBalancesSum, supplyParts.beaconBalancesSum),
    supplyParts.beaconDepositsSum,
  );

export const impreciseEthSupplyFromParts = (
  ethSupplyParts: SupplyParts,
): EthNumber => {
  const ethSupplySum = ethSupplyFromParts(ethSupplyParts);
  return JSBI.toNumber(ethSupplySum) / WEI_PER_ETH;
};

export const fetchSupplyParts = (): Promise<ApiResult<SupplyPartsF>> =>
  fetchApiJson(`${getDomain()}/api/v2/fees/supply-parts`);

export const useSupplyParts = (): SupplyParts => {
  const { data } = useSWR<SupplyPartsF>(
    "/api/v2/fees/supply-parts",
    fetchJsonSwr,
    {
      refreshInterval: Duration.millisFromSeconds(4),
    },
  );

  // We use an SWRConfig with fallback data for this hook.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return decodeEthSupply(data!);
};

export const useImpreciseEthSupply = (): EthNumber | undefined => {
  const ethSupply = useSupplyParts();
  const lastRefresh = useRef<Date>();
  const [lastEthSupply, setLastEthSupply] = useState<number>();

  useEffect(() => {
    if (ethSupply === undefined) {
      return undefined;
    }

    if (
      lastRefresh.current === undefined ||
      DateFns.differenceInSeconds(new Date(), lastRefresh.current) > 60
    ) {
      lastRefresh.current = new Date();
      setLastEthSupply(getEthSupplyImprecise(ethSupply));
    }
  }, [ethSupply]);

  return lastEthSupply;
};

export const getEthSupplyImprecise = (ethSupply: SupplyParts): EthNumber =>
  JSBI.toNumber(
    JSBI.subtract(
      JSBI.add(ethSupply.executionBalancesSum, ethSupply.beaconBalancesSum),
      ethSupply.beaconDepositsSum,
    ),
  ) / 1e18;
