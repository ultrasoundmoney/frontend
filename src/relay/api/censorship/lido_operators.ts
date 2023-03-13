import { A, E, Monoid, N, OrdM, pipe, T, TEAlt } from "../../../fp";
import type {
  LidoOperatorCensorship,
  Operator,
} from "../../sections/CensorshipSection/LidoOperatorCensorshipWidget";
import lidoOperatorDetailsMapSource from "./lido_operators_details_map.json";
import { fetchApiJson } from "../../fetchers";
import { fetchRelayCensorshipPerTimeFrame } from "./relays";
import type { RelayCensorship } from "../../sections/CensorshipSection/RelayCensorshipWidget";

const lidoOperatorDetailsMap = lidoOperatorDetailsMapSource as Record<
  string,
  { name: string; website: string }
>;

type RelayId = string;

type OperatorRaw = {
  operatorId: string;
  validatorCount: number;
  /** connected relay ids */
  relays: RelayId[];
};

type RawData = OperatorRaw[];

export type LidoOperatorCensorshipPerTimeFrame = Record<
  "d7" | "d30",
  LidoOperatorCensorship
>;

const byDominanceDesc = pipe(
  N.Ord,
  OrdM.reverse,
  OrdM.contramap((operator: Operator) => operator.dominance),
);

const getLidoOperatorCensorship = (
  operators: OperatorRaw[],
  relayCensorship: RelayCensorship,
): LidoOperatorCensorship => {
  const nonCensoringRelayCount = pipe(
    relayCensorship.relays,
    A.filter((relay) => !relay.censors),
    A.size,
  );
  const nonConsoringRelays = pipe(
    relayCensorship.relays,
    A.filter((relay) => !relay.censors),
    A.map((relay) => relay.id),
    (ids) => new Set(ids),
  );
  const allOperators = pipe(
    operators,
    A.filter((operator) => operator.operatorId !== null),
    A.map(
      (operator) =>
        [operator.operatorId, operator.validatorCount] as [string, number],
    ),
    (pairs) => new Map(pairs),
  );
  const nonCensoringOperators = pipe(
    operators,
    A.filter((operator) => operator.operatorId !== null),
    A.filter((operator) =>
      operator.relays.some((id) => nonConsoringRelays.has(id)),
    ),
    A.map(
      (operator) =>
        [operator.operatorId, operator.validatorCount] as [string, number],
    ),
    (pairs) => new Map(pairs),
  );

  const countCensored = pipe(
    operators,
    A.filter((operator) => operator.operatorId !== null),
    A.filter((operator) => !nonCensoringOperators.has(operator.operatorId)),
    A.map((operator) => operator.validatorCount),
    Monoid.concatAll(N.MonoidSum),
  );
  const countAll = pipe(
    operators,
    A.filter((operator) => operator.operatorId !== null),
    A.map((operator) => operator.validatorCount),
    Monoid.concatAll(N.MonoidSum),
  );

  const dominance = countCensored / countAll;
  const operator_count = allOperators.size;
  const censoring_operator_count = operator_count - nonCensoringOperators.size;
  const operators_list: Operator[] = pipe(
    operators,
    A.filter((operator) => operator.operatorId !== null),
    A.map(
      (operator): Operator => ({
        censors: !nonCensoringOperators.has(operator.operatorId),
        dominance: operator.validatorCount / countAll,
        id: operator.operatorId,
        name:
          lidoOperatorDetailsMap[operator.operatorId]?.name ??
          operator.operatorId,
        non_censoring_relays_connected_count: pipe(
          operator.relays,
          A.filter((id) => nonConsoringRelays.has(id)),
          A.size,
        ),
        url: lidoOperatorDetailsMap[operator.operatorId]?.website ?? null,
      }),
    ),
    A.sort(byDominanceDesc),
  );

  return {
    censoring_operator_count,
    dominance,
    non_censoring_relays_count: nonCensoringRelayCount,
    operator_count,
    operators: operators_list,
  };
};

export const fetchLidoOperatorCensorshipPerTimeFrame: T.Task<LidoOperatorCensorshipPerTimeFrame> =
  pipe(
    T.Do,
    T.apS("relays", fetchRelayCensorshipPerTimeFrame),
    T.apS(
      "lidoOperatorRaws",
      pipe(
        () => fetchApiJson<RawData>("/api/censorship/operators"),
        T.map((data) =>
          "error" in data ? E.left(data.error) : E.right(data.data),
        ),
        TEAlt.getOrThrow,
      ),
    ),
    T.map(({ relays, lidoOperatorRaws }) =>
      E.right({
        d7: getLidoOperatorCensorship(lidoOperatorRaws, relays.d7),
        d30: getLidoOperatorCensorship(lidoOperatorRaws, relays.d30),
      }),
    ),
    TEAlt.getOrThrow,
  );
