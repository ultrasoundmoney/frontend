import { A, E, Monoid, N, OrdM, pipe, T, TEAlt } from "../../fp";
import type {
  Relay,
  RelayCensorship,
} from "../sections/CensorshipSection/RelayCensorshipWidget";
import { fetchApiJson } from "../fetchers";
import type { RelayApiTimeFrames } from "./time_frames";

type RelayRaw = {
  relayId: string;
  totalBlocks: number;
  uncensoredBlocks: number;
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
    A.map(
      (relay): Relay => ({
        blocks_with_sanctioned_entity: relay.uncensoredBlocks,
        censors: relay.uncensoredBlocks === 0,
        dominance: relay.totalBlocks / countAll,
        id: relay.relayId,
        name: relay.relayId,
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

export const getRelayCensorshipPerTimeFrame: T.Task<RelayCensorshipPerTimeFrame> =
  pipe(
    () => fetchApiJson<RawData>("/api/censorship/relays"),
    T.map((body) =>
      "error" in body
        ? E.left(body.error)
        : E.right({
            d7: getRelayCensorship(body.data["sevenDays"]),
            d30: getRelayCensorship(body.data["thirtyDays"]),
          }),
    ),
    TEAlt.getOrThrow,
  );
