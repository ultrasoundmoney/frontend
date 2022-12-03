import * as DateFns from "date-fns";
import JSBI from "jsbi";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { getDomain } from "../config";
import * as Duration from "../duration";
import type { EthNumber } from "../eth-units";
import { WEI_PER_ETH } from "../eth-units";
import { WEI_PER_GWEI_JSBI } from "../eth-units";
import type { ApiResult } from "./fetchers";
import { fetchApiJson, fetchJsonSwr } from "./fetchers";

export type SupplyPartsF = {
  beaconBalancesSum: {
    balancesSum: string;
    slot: number;
  };
  beaconDepositsSum: {
    depositsSum: string;
    slot: number;
  };
  executionBalancesSum: {
    balancesSum: string;
    blockNumber: number;
  };
};

export type SupplyParts = {
  beaconBalancesSum: {
    balancesSum: JSBI;
    slot: number;
  };
  beaconDepositsSum: {
    depositsSum: JSBI;
    slot: number;
  };
  executionBalancesSum: {
    balancesSum: JSBI;
    blockNumber: number;
  };
};

export const decodeEthSupply = (supplyParts: SupplyPartsF): SupplyParts => ({
  beaconDepositsSum: {
    slot: supplyParts.beaconDepositsSum.slot,
    depositsSum: JSBI.multiply(
      JSBI.BigInt(supplyParts.beaconDepositsSum.depositsSum),
      WEI_PER_GWEI_JSBI,
    ),
  },
  beaconBalancesSum: {
    slot: supplyParts.beaconBalancesSum.slot,
    balancesSum: JSBI.multiply(
      JSBI.BigInt(supplyParts.beaconBalancesSum.balancesSum),
      WEI_PER_GWEI_JSBI,
    ),
  },
  executionBalancesSum: {
    balancesSum: JSBI.BigInt(supplyParts.executionBalancesSum.balancesSum),
    blockNumber: supplyParts.executionBalancesSum.blockNumber,
  },
});

export const ethSupplyFromParts = (supplyParts: SupplyParts): JSBI => {
  const ethSupplySum = JSBI.subtract(
    JSBI.add(
      supplyParts.executionBalancesSum.balancesSum,
      supplyParts.beaconBalancesSum.balancesSum,
    ),
    supplyParts.beaconDepositsSum.depositsSum,
  );

  return ethSupplySum;
};

export const impreciseEthSupplyFromParts = (
  ethSupplyParts: SupplyParts,
): EthNumber => {
  const ethSupplySum = ethSupplyFromParts(ethSupplyParts);
  return JSBI.toNumber(ethSupplySum) / WEI_PER_ETH;
};

export const fetchSupplyParts = (): Promise<ApiResult<SupplyPartsF>> =>
  fetchApiJson(`${getDomain()}/api/v2/fees/eth-supply-parts`);

export const useSupplyParts = (): SupplyParts => {
  const { data } = useSWR<SupplyPartsF>(
    "/api/v2/fees/eth-supply-parts",
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

export const getEthSupplyImprecise = (ethSupply: SupplyParts): number =>
  JSBI.toNumber(
    JSBI.subtract(
      JSBI.add(
        ethSupply.executionBalancesSum.balancesSum,
        ethSupply.beaconBalancesSum.balancesSum,
      ),
      ethSupply.beaconDepositsSum.depositsSum,
    ),
  ) / 1e18;
