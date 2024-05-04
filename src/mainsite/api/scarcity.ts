import JSBI from "jsbi";
import useSWR from "swr";
import * as Duration from "../../duration";
import type { EthNumber, WeiJSBI } from "../../eth-units";
import type { ApiResult } from "../../fetchers";
import { fetchApiJson, fetchJsonSwr } from "./fetchers";
import { useSupplyProjectionInputs } from "./supply-projection";

export type Scarcity = {
  engines: {
    burned: {
      amount: WeiJSBI;
      name: string;
      startedOn: Date;
    };
    locked: {
      amount: EthNumber;
      name: string;
      startedOn: Date;
    };
    staked: {
      amount: WeiJSBI;
      name: string;
      startedOn: Date;
    };
  };
  ethSupply: WeiJSBI;
  number: number;
};

// BigInt string that uses our server-side encoding of numbers + 'n', i.e. '7825428883900n'
type WeiString = string;

const jsbiFromBigIntString = (str: string): JSBI =>
  JSBI.BigInt(str.slice(0, -1));

export type ScarcityF = {
  engines: {
    burned: {
      amount: WeiString;
      name: string;
      startedOn: Date;
    };
    locked: {
      amount: EthNumber;
      name: string;
      startedOn: Date;
    };
    staked: {
      amount: WeiString;
      name: string;
      startedOn: Date;
    };
  };
  ethSupply: WeiString;
  number: number;
};

const url = "/api/fees/scarcity";

export const fetchScarcity = (): Promise<ApiResult<ScarcityF>> =>
  fetchApiJson(url);

export const useScarcity = (): Scarcity => {
  const { data } = useSWR<ScarcityF>(url, fetchJsonSwr, {
    refreshInterval: Duration.millisFromHours(1),
  });
const supplyProjectionInputs = useSupplyProjectionInputs();

  // We use an SWRConfig with fallback data for this hook.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const safeData = data!;

  return {
    engines: {
      burned: {
        ...safeData.engines.burned,
        startedOn: new Date(safeData.engines.burned.startedOn),
        amount: jsbiFromBigIntString(safeData.engines.burned.amount),
      },
      locked: {
        ...safeData.engines.locked,
        amount: supplyProjectionInputs?.inContractsByDay?.[supplyProjectionInputs?.inContractsByDay.length - 1]?.v ?? 0,
        startedOn: new Date(safeData.engines.locked.startedOn),
      },
      staked: {
        ...safeData.engines.staked,
        startedOn: new Date(safeData.engines.staked.startedOn),
        amount: jsbiFromBigIntString(safeData.engines.staked.amount),
      },
    },
    ethSupply: jsbiFromBigIntString(safeData.ethSupply),
    number: safeData.number,
  };
};
