import { A, Monoid, N, OrdM, pipe, T, TEAlt } from "../../../fp";
import type {
  Relay,
  RelayCensorship,
} from "../../sections/CensorshipSection/RelayCensorshipWidget";
import { fetchCensorshipApiJsonTE } from "../../fetchers";
import type { RelayApiTimeFrames } from "../time_frames";

type RelayId = string;

// These maps are meant to be temporary until the backend provides the data. The frontend will already try to do so.
const nameMap: Record<RelayId, string> = {
  "blxr-ethical": "bloXroute",
  "blxr-max-profit": "bloXroute",
  "blxr-regulated": "bloXroute",
  aestus: "Aestus",
  agnostic: "Agnostic",
  blocknative: "Blocknative",
  eden: "Eden",
  flashbots: "Flashbots",
  manifold: "Manifold",
  relayoor: "Relayooor",
  ultrasound: "ultra sound",
};

const descriptionMap: Record<RelayId, string> = {
  "blxr-ethical": "ethical",
  "blxr-max-profit": "max profit",
  "blxr-regulated": "regulated",
};

const urlMap: Record<RelayId, string> = {
  eden: "https://relay.edennetwork.io/info",
};

type RelayRaw = {
  relayId: RelayId;
  totalBlocks: number;
  uncensoredBlocks: number;
  description?: string;
  name?: string;
  url?: string;
};

type RawData = Record<RelayApiTimeFrames, RelayRaw[]>;

export type RelayCensorshipPerTimeFrame = Record<"d7" | "d30", RelayCensorship>;

const byDominanceDesc = pipe(
  N.Ord,
  OrdM.reverse,
  OrdM.contramap((relay: Relay) => relay.dominance),
);

export const getRelayCensorship = (rawRelays: RelayRaw[]): RelayCensorship => {
  const countAll = pipe(
    rawRelays,
    A.map((relay) => relay.totalBlocks),
    Monoid.concatAll(N.MonoidSum),
  );
  const countCensored = pipe(
    rawRelays,
    A.filter((relay) => relay.uncensoredBlocks === 0),
    A.map((relay) => relay.totalBlocks),
    Monoid.concatAll(N.MonoidSum),
  );
  const dominance = countCensored / countAll;
  const relay_count = rawRelays.length;
  const censoring_relay_count = pipe(
    rawRelays,
    A.filter((relay) => relay.uncensoredBlocks === 0),
    A.size,
  );
  const relays = pipe(
    rawRelays,
    A.map((relay): Relay => {
      const description = relay.description ?? descriptionMap[relay.relayId];
      const url = relay.url ?? urlMap[relay.relayId];
      return {
        ...(description && { description }),
        ...(url && { url }),
        blocks_with_sanctioned_entity: relay.uncensoredBlocks,
        censors: relay.uncensoredBlocks === 0,
        dominance: relay.totalBlocks / countAll,
        id: relay.relayId,
        name: relay.name ?? nameMap[relay.relayId] ?? relay.relayId,
      };
    }),
    A.sort(byDominanceDesc),
  );

  return {
    dominance,
    censoring_relay_count,
    relay_count,
    relays,
  };
};

export const fetchRelayCensorshipPerTimeFrame: T.Task<RelayCensorshipPerTimeFrame> =
  pipe(
    fetchCensorshipApiJsonTE<RawData>("/api/censorship/relays"),
    TEAlt.unwrap,
    T.map((body) => ({
      d7: getRelayCensorship(body.sevenDays),
      d30: getRelayCensorship(body.thirtyDays),
    })),
  );
