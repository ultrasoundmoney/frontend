import { A, Monoid, N, OrdM, pipe } from "../../fp";
import operators_7d from "./operators_7d.json";
import operators_30d from "./operators_30d.json";
import { getRelayCensorship } from "./relay_censorship";
import type {
  LidoOperatorCensorship,
  Operator,
} from "../sections/CensorshipSection/LidoOperatorCensorship";

type RelayId = string;

type OperatorRaw = {
  operator_id: string | null;
  sum: number;
  /** connected relay ids */
  array_agg: RelayId[];
};

type RawData = Record<
  "d7" | "d30",
  {
    operators: OperatorRaw[];
  }
>;

const rawData: RawData = {
  d7: {
    operators: operators_7d,
  },
  d30: {
    operators: operators_30d,
  },
};

export type LidoOperatorCensorshipPerTimeFrame = Record<
  "d7" | "d30",
  LidoOperatorCensorship
>;

const byDominanceDesc = pipe(
  N.Ord,
  OrdM.reverse,
  OrdM.contramap((operator: Operator) => operator.dominance),
);

const getOperatorCensorship = (
  timeFrame: "d7" | "d30",
): LidoOperatorCensorship => {
  const operators = rawData[timeFrame].operators;
  const relayCensorship = getRelayCensorship(timeFrame);
  const nonCensoringRelayCount =
    relayCensorship.relay_count - relayCensorship.censoring_relay_count;
  const nonConsoringRelays = pipe(
    relayCensorship.relays,
    A.filter((relay) => !relay.censors),
    A.map((relay) => relay.id),
    (ids) => new Set(ids),
  );
  const allOperators = pipe(
    operators,
    A.filter((operator) => operator.operator_id !== null),
    A.map(
      (operator) => [operator.operator_id, operator.sum] as [string, number],
    ),
    (pairs) => new Map(pairs),
  );
  const nonCensoringOperators = pipe(
    operators,
    A.filter((operator) => operator.operator_id !== null),
    A.filter((operator) =>
      operator.array_agg.some((id) => nonConsoringRelays.has(id)),
    ),
    A.map(
      (operator) => [operator.operator_id, operator.sum] as [string, number],
    ),
    (pairs) => new Map(pairs),
  );

  const countCensored = pipe(
    operators,
    A.filter((operator) => operator.operator_id !== null),
    // filtered above
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    A.filter((operator) => !nonCensoringOperators.has(operator.operator_id!)),
    A.map((operator) => operator.sum),
    Monoid.concatAll(N.MonoidSum),
  );
  const countAll = pipe(
    operators,
    A.filter((operator) => operator.operator_id !== null),
    A.map((operator) => operator.sum),
    Monoid.concatAll(N.MonoidSum),
  );

  const dominance = countCensored / countAll;
  const operator_count = allOperators.size;
  const censoring_operator_count = operator_count - nonCensoringOperators.size;
  const operators_list: Operator[] = pipe(
    operators,
    A.filter((operator) => operator.operator_id !== null),
    A.map(
      (operator): Operator => ({
        // filtered above
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        censors: !nonCensoringOperators.has(operator.operator_id!),
        dominance: operator.sum / countAll,
        // filtered above
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        id: operator.operator_id!,
        // filtered above
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        name: operator.operator_id!,
        non_censoring_relays_connected_count: pipe(
          operator.array_agg,
          A.filter((id) => nonConsoringRelays.has(id)),
          A.size,
        ),
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

export const lidoOperatorCensorshipPerTimeFrame: LidoOperatorCensorshipPerTimeFrame =
  {
    d7: getOperatorCensorship("d7"),
    d30: getOperatorCensorship("d30"),
  };
