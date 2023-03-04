import relays_count_7d from "./relays_count_7d.json";
import relay_count_ofac_blocks_7d from "./relay_count_ofac_blocks_7d.json";
import relays_count_30d from "./relays_count_30d.json";
import relay_count_ofac_blocks_30d from "./relay_count_ofac_blocks_30d.json";
import { A, Monoid, N, OrdM, pipe } from "../../fp";
import type {
  Relay,
  RelayCensorship,
} from "../sections/CensorshipSection/RelayCensorshipWidget";

type RelayCountRaw = {
  r: string;
  count: number;
};

type RelayCountOfacBlocks = {
  uncensoredblocks: number;
  relay: string;
};

type RawData = Record<
  "d7" | "d30",
  {
    relays_count: RelayCountRaw[];
    relay_count_ofac_blocks: RelayCountOfacBlocks[];
  }
>;

const rawData: RawData = {
  d7: {
    relays_count: relays_count_7d,
    relay_count_ofac_blocks: relay_count_ofac_blocks_7d,
  },
  d30: {
    relays_count: relays_count_30d,
    relay_count_ofac_blocks: relay_count_ofac_blocks_30d,
  },
};

export type RelayCensorshipPerTimeFrame = Record<"d7" | "d30", RelayCensorship>;

const byDominanceDesc = pipe(
  N.Ord,
  OrdM.reverse,
  OrdM.contramap((relay: Relay) => relay.dominance),
);

export const getRelayCensorship = (
  timeFrame: "d7" | "d30",
): RelayCensorship => {
  const relayCounts = rawData[timeFrame].relays_count;
  const relaysWithSanctionedEntityCounts =
    rawData[timeFrame].relay_count_ofac_blocks;

  const nonCensoringRelays = pipe(
    relaysWithSanctionedEntityCounts,
    A.map((relay) => [relay.relay, relay.uncensoredblocks] as [string, number]),
    (names) => new Map(names),
  );
  const allRelays = pipe(
    relayCounts,
    A.map((relay) => [relay.r, relay.count] as [string, number]),
    (names) => new Map(names),
  );
  const censoringRelays = pipe(
    allRelays.keys(),
    (iter) => Array.from(iter),
    A.filter((relay) => !nonCensoringRelays.has(relay)),
    (names) => new Set(names),
  );
  const countAll = pipe(
    relayCounts,
    A.map((relay) => relay.count),
    Monoid.concatAll(N.MonoidSum),
  );
  const countCensored = pipe(
    relayCounts,
    A.filter((relay) => censoringRelays.has(relay.r)),
    A.map((relay) => relay.count),
    Monoid.concatAll(N.MonoidSum),
  );

  const dominance = countCensored / countAll;
  const relay_count = allRelays.size;
  const censoring_relay_count = censoringRelays.size;
  const relays = pipe(
    allRelays.entries(),
    (iter) => Array.from(iter),
    A.map(
      ([id, count]): Relay => ({
        blocks_with_sanctioned_entity: nonCensoringRelays.get(id) ?? 0,
        censors: censoringRelays.has(id),
        dominance: count / countAll,
        id: id,
        name: id,
      }),
    ),
    A.sort(byDominanceDesc),
  );

  return {
    dominance,
    censoring_relay_count,
    relay_count,
    relays,
  };
};

export const relayCensorshipPerTimeFrame: RelayCensorshipPerTimeFrame = {
  d7: getRelayCensorship("d7"),
  d30: getRelayCensorship("d30"),
};
