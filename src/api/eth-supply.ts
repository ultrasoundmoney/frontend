import JSBI from "jsbi";
import * as DateFns from "date-fns";
import useSWR from "swr";
import { WEI_PER_GWEI_JSBI } from "../eth-units";
import { feesBasePath } from "./fees";
import * as Duration from "../duration";
import { useEffect, useMemo, useRef, useState } from "react";

type EthSupplyF = {
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

type EthSupply = {
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

const fetcher = <A>(url: RequestInfo) =>
  fetch(url).then((res) => res.json() as Promise<A>);

export const useEthSupply = (): EthSupply | undefined => {
  const { data } = useSWR<EthSupplyF>(`${feesBasePath}/eth-supply`, fetcher, {
    refreshInterval: Duration.millisFromSeconds(4),
  });

  return useMemo(() => {
    if (data === undefined) {
      return undefined;
    }
    return {
      beaconDepositsSum: {
        slot: data.beaconDepositsSum.slot,
        depositsSum: JSBI.multiply(
          JSBI.BigInt(data.beaconDepositsSum.depositsSum),
          WEI_PER_GWEI_JSBI,
        ),
      },
      beaconBalancesSum: {
        slot: data.beaconBalancesSum.slot,
        balancesSum: JSBI.multiply(
          JSBI.BigInt(data.beaconBalancesSum.balancesSum),
          WEI_PER_GWEI_JSBI,
        ),
      },
      executionBalancesSum: {
        balancesSum: JSBI.BigInt(data.executionBalancesSum.balancesSum),
        blockNumber: data.executionBalancesSum.blockNumber,
      },
    };
  }, [data]);
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
      setLastEthSupply(getEthSupplyImprecise(ethSupply));
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
