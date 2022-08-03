import JSBI from "jsbi";
import useSWR from "swr";
import { WEI_PER_GWEI_JSBI } from "../eth-units";
import { feesBasePath } from "./fees";
import * as Duration from "../duration";

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
  let { data } = useSWR<EthSupplyF>(`${feesBasePath}/eth-supply`, fetcher, {
    refreshInterval: Duration.millisFromSeconds(4),
  });

  return data === undefined
    ? undefined
    : {
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
};
