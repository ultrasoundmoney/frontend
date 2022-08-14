import JSBI from "jsbi";
import * as DateFns from "date-fns";
import useSWR from "swr";
import { Eth, WeiJSBI, WEI_PER_GWEI_JSBI } from "../eth-units";
import { feesBasePath } from "./fees";
import * as Duration from "../duration";
import { useEffect, useMemo, useRef, useState } from "react";
import { ethFromWei } from "~/format";

export type EthSupplyPartsF = {
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

export type EthSupplyParts = {
  beaconBalancesSum: {
    balancesSum: WeiJSBI;
    slot: number;
  };
  beaconDepositsSum: {
    depositsSum: WeiJSBI;
    slot: number;
  };
  executionBalancesSum: {
    balancesSum: WeiJSBI;
    blockNumber: number;
  };
};

export const decodeEthSupply = (
  ethSupplyF: EthSupplyPartsF,
): EthSupplyParts => ({
  beaconDepositsSum: {
    slot: ethSupplyF.beaconDepositsSum.slot,
    depositsSum: JSBI.multiply(
      JSBI.BigInt(ethSupplyF.beaconDepositsSum.depositsSum),
      WEI_PER_GWEI_JSBI,
    ),
  },
  beaconBalancesSum: {
    slot: ethSupplyF.beaconBalancesSum.slot,
    balancesSum: JSBI.multiply(
      JSBI.BigInt(ethSupplyF.beaconBalancesSum.balancesSum),
      WEI_PER_GWEI_JSBI,
    ),
  },
  executionBalancesSum: {
    balancesSum: JSBI.BigInt(ethSupplyF.executionBalancesSum.balancesSum),
    blockNumber: ethSupplyF.executionBalancesSum.blockNumber,
  },
});

export const getEthSupply = (ethSupplyParts: EthSupplyParts): WeiJSBI => {
  return JSBI.subtract(
    JSBI.add(
      ethSupplyParts.executionBalancesSum.balancesSum,
      ethSupplyParts.beaconBalancesSum.balancesSum,
    ),
    ethSupplyParts.beaconDepositsSum.depositsSum,
  );
};

export const getEthSupplyImprecise = (ethSupplyParts: EthSupplyParts): Eth =>
  JSBI.toNumber(
    JSBI.divide(
      getEthSupply(ethSupplyParts),
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18)),
    ),
  );

const fetcher = <A>(url: RequestInfo) =>
  fetch(url).then((res) => res.json() as Promise<A>);

export const useEthSupply = (): EthSupplyParts | undefined => {
  const { data } = useSWR<EthSupplyPartsF>(
    `${feesBasePath}/eth-supply`,
    fetcher,
    {
      refreshInterval: Duration.millisFromSeconds(4),
    },
  );

  return useMemo(() => {
    if (data === undefined) {
      return undefined;
    }
    return decodeEthSupply(data);
  }, [data]);
};

export const useImpreciseEthSupply = (): Eth | undefined => {
  const ethSupply = useEthSupply();
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

export const useImpreciseEthSupply2 = (ethSupply: EthSupplyParts): number => {
  const lastRefresh = useRef<Date>();
  const [lastEthSupply, setLastEthSupply] = useState<number>(
    getEthSupplyImprecise(ethSupply),
  );

  useEffect(() => {
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
