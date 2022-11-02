import JSBI from "jsbi";
import useSWR from "swr";
import * as Duration from "../duration";
import type { ApiResult } from "./fetchers";
import { fetchApiJson, fetchJsonSwr } from "./fetchers";

export type Scarcity = {
  engines: {
    burned: {
      amount: JSBI;
      name: string;
      startedOn: Date;
    };
    locked: {
      amount: number;
      name: string;
      startedOn: Date;
    };
    staked: {
      amount: JSBI;
      name: string;
      startedOn: Date;
    };
  };
  ethSupply: JSBI;
  number: number;
};

// BigInt string that uses our server-side encoding of numbers + 'n', i.e. '7825428883900n'
type BigIntString = string;

const jsbiFromBigIntString = (str: string): JSBI =>
  JSBI.BigInt(str.slice(0, -1));

export type ScarcityF = {
  engines: {
    burned: {
      amount: BigIntString;
      name: string;
      startedOn: Date;
    };
    locked: {
      amount: number;
      name: string;
      startedOn: Date;
    };
    staked: {
      amount: BigIntString;
      name: string;
      startedOn: Date;
    };
  };
  ethSupply: BigIntString;
  number: number;
};

const url = "/api/fees/scarcity";

export const fetchScarcity = (): Promise<ApiResult<ScarcityF>> =>
  fetchApiJson(url);

export const useScarcity = (): Scarcity => {
  const { data } = useSWR<ScarcityF>(url, fetchJsonSwr, {
    refreshInterval: Duration.millisFromHours(1),
  });

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
