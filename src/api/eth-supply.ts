import * as DateFns from "date-fns";
import JSBI from "jsbi";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import * as Duration from "../duration";
import { WEI_PER_GWEI_JSBI } from "../eth-units";
import { feesBasePath } from "./fees";

export type EthSupplyF = {
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

export type EthSupply = {
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

export const decodeEthSupply = (ethSupply: EthSupplyF): EthSupply => ({
  beaconDepositsSum: {
    slot: ethSupply.beaconDepositsSum.slot,
    depositsSum: JSBI.multiply(
      JSBI.BigInt(ethSupply.beaconDepositsSum.depositsSum),
      WEI_PER_GWEI_JSBI,
    ),
  },
  beaconBalancesSum: {
    slot: ethSupply.beaconBalancesSum.slot,
    balancesSum: JSBI.multiply(
      JSBI.BigInt(ethSupply.beaconBalancesSum.balancesSum),
      WEI_PER_GWEI_JSBI,
    ),
  },
  executionBalancesSum: {
    balancesSum: JSBI.BigInt(ethSupply.executionBalancesSum.balancesSum),
    blockNumber: ethSupply.executionBalancesSum.blockNumber,
  },
});

const fetcher = <A>(url: RequestInfo) =>
  fetch(url).then((res) => res.json() as Promise<A>);

export const useEthSupply = (): EthSupplyF | undefined => {
  const { data } = useSWR<EthSupplyF>(`${feesBasePath}/eth-supply`, fetcher, {
    refreshInterval: Duration.millisFromSeconds(4),
  });

  return data;
};

export const useImpreciseEthSupply = (): number | undefined => {
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
      setLastEthSupply(getEthSupplyImprecise(decodeEthSupply(ethSupply)));
    }
  }, [ethSupply]);

  return lastEthSupply;
};

export const getEthSupplyImprecise = (ethSupply: EthSupply): number =>
  JSBI.toNumber(
    JSBI.divide(
      JSBI.subtract(
        JSBI.add(
          ethSupply.executionBalancesSum.balancesSum,
          ethSupply.beaconBalancesSum.balancesSum,
        ),
        ethSupply.beaconDepositsSum.depositsSum,
      ),
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18)),
    ),
  );
