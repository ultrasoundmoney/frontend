import { A, E, Monoid, N, OrdM, pipe, T, TEAlt } from "../../fp";
import { fetchApiJson } from "../fetchers";
import type {
  Builder,
  BuilderCensorship,
} from "../sections/CensorshipSection/BuilderCensorshipWidget";
import type { RelayApiTimeFrames } from "./time_frames";
import { timeFrameMap } from "./time_frames";

type BuilderId = string;

const nameMap: Record<BuilderId, string> = {
  "0x69": "builder0x69",
  beaver: "beaverbuild",
  bloxroute: "bloXroute",
  flashbots: "Flashbots",
  manifold: "Manifold",
  rsync: "rsync-builder",
};

type BuilderRaw = {
  blockCount: number;
  builderId: BuilderId;
  censoringPubkeys: number;
  totalPubkeys: number;
};

type RawData = Record<RelayApiTimeFrames, BuilderRaw[]>;

export type BuilderCensorshipPerTimeFrame = Record<
  "d7" | "d30",
  BuilderCensorship
>;

const byDominanceDesc = pipe(
  N.Ord,
  OrdM.reverse,
  OrdM.contramap((builder: Builder) => builder.dominance),
);

export const getBuilderCensorship = (
  buildersRaw: BuilderRaw[],
): BuilderCensorship => {
  const blockCountAll = pipe(
    buildersRaw,
    A.reduce(0, (acc, builder) => acc + builder.blockCount),
  );
  const blockCountCensoringKeys = pipe(
    buildersRaw,
    A.filter((builder) => builder.censoringPubkeys > 0),
    A.reduce(0, (acc, builder) => acc + builder.blockCount),
  );

  const builders = pipe(
    buildersRaw,
    A.map(
      (builder): Builder => ({
        censoringPubkeys: builder.censoringPubkeys,
        censors:
          builder.censoringPubkeys === 0
            ? "no"
            : builder.censoringPubkeys === builder.totalPubkeys
            ? "fully"
            : "partially",
        dominance: builder.blockCount / blockCountAll,
        id: builder.builderId,
        name: nameMap[builder.builderId] ?? builder.builderId,
        totalPubkeys: builder.totalPubkeys,
      }),
    ),
    A.sort(byDominanceDesc),
  );

  const censoringPubkeys = pipe(
    buildersRaw,
    A.map((builder) => builder.censoringPubkeys),
    Monoid.concatAll(N.MonoidSum),
  );

  const totalPubkeys = pipe(
    buildersRaw,
    A.map((builder) => builder.totalPubkeys),
    Monoid.concatAll(N.MonoidSum),
  );

  return {
    builders,
    censoringPubkeys,
    dominance: blockCountCensoringKeys / blockCountAll,
    totalPubkeys,
  };
};

export const getBuilderCensorshipPerTimeFrame: T.Task<BuilderCensorshipPerTimeFrame> =
  pipe(
    () => fetchApiJson<RawData>("/api/censorship/builders"),
    T.map((body) =>
      "error" in body
        ? E.left(body.error)
        : E.right({
            d7: getBuilderCensorship(body.data[timeFrameMap["d7"]]),
            d30: getBuilderCensorship(body.data[timeFrameMap["d30"]]),
          }),
    ),
    TEAlt.getOrThrow,
  );
