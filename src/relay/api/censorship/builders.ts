import {
  D,
  E,
  EAlt,
  flow,
  Monoid,
  N,
  O,
  OAlt,
  OrdM,
  pipe,
  R,
  RA,
  RNEA,
  T,
  TEAlt,
} from "../../../fp";
import { fetchApiJson, fetchApiJsonTE } from "../../fetchers";
import type {
  BuilderCensorship,
  BuilderGroup,
  BuilderUnit,
  Censors,
} from "../../sections/CensorshipSection/BuilderCensorshipWidget";
import type { RelayApiTimeFrames } from "../time_frames";

// const nameMap: Record<BuilderName, string> = {
//   "0x69": "builder0x69",
//   beaver: "beaverbuild",
//   bloxroute: "bloXroute",
//   flashbots: "Flashbots",
//   manifold: "Manifold",
//   rsync: "rsync-builder",
// };

/**
 * A single entity which builds blocks known by its pubkey.
 * Ofter a single 'builder' owns many.
 */
const BuilderRaw = pipe(
  D.struct({
    builderName: D.nullable(D.string),
    builderPubkey: D.string,
    totalBlocks: D.number,
    uncensoredBlocks: D.number,
  }),
  D.intersect(D.partial({ builderDescription: D.nullable(D.string) })),
);

type BuilderRaw = D.TypeOf<typeof BuilderRaw>;

type BuilderCensorshipResponse = Record<
  RelayApiTimeFrames,
  RNEA.ReadonlyNonEmptyArray<unknown>
>;

export type BuilderCensorshipPerTimeFrame = Record<
  "d7" | "d30",
  BuilderCensorship
>;

const getName = (
  builderUnits: RNEA.ReadonlyNonEmptyArray<BuilderRaw>,
): string =>
  pipe(
    builderUnits,
    RNEA.head,
    O.fromNullableK((builder) => builder.builderName),
    // If a builder doesn't have a name, we use a shortened pub key.
    O.getOrElse(() =>
      pipe(
        builderUnits,
        RNEA.head,
        (builder) => builder.builderPubkey,
        shortenPubkey,
      ),
    ),
  );

const isCensoringBuilderUnit = (builder: BuilderRaw): boolean =>
  builder.uncensoredBlocks === 0;

const getCensors = (
  builderUnits: RNEA.ReadonlyNonEmptyArray<BuilderRaw>,
): Censors =>
  pipe(
    builderUnits,
    RA.filter(isCensoringBuilderUnit),
    RA.size,
    (censoringPubkeys) =>
      censoringPubkeys === 0
        ? "no"
        : censoringPubkeys === RA.size(builderUnits)
        ? "fully"
        : "partially",
  );

const builderUnitFromApi = (builder: BuilderRaw): BuilderUnit => ({
  pubkey: builder.builderPubkey,
  totalBlocks: builder.totalBlocks,
  uncensoredBlocks: builder.uncensoredBlocks,
});

const builderGroupsFromApi = (
  builderRaws: RNEA.ReadonlyNonEmptyArray<BuilderRaw>,
): RNEA.ReadonlyNonEmptyArray<BuilderGroup> => {
  const blockCount = blockCountFromBuilderRaws(builderRaws);
  return pipe(
    builderRaws,
    RNEA.groupBy((builder) => builder.builderName ?? builder.builderPubkey),
    R.mapWithIndex(
      (id, builderUnits): BuilderGroup => ({
        builderUnits: pipe(builderUnits, RNEA.map(builderUnitFromApi)),
        censoringPubkeys: pipe(
          builderUnits,
          RA.filter(isCensoringBuilderUnit),
          RA.size,
        ),
        censors: getCensors(builderUnits),
        description: pipe(
          builderUnits,
          RNEA.head,
          O.fromNullableK((builder) => builder.builderDescription),
        ),
        dominance: pipe(
          builderUnits,
          RA.map((builder) => builder.totalBlocks),
          Monoid.concatAll(N.MonoidSum),
          (builderGroupBlocks) => builderGroupBlocks / blockCount,
        ),
        id,
        name: getName(builderUnits),
        totalPubkeys: RA.size(builderUnits),
      }),
    ),
    (record) => Object.values(record),
    RNEA.fromReadonlyArray,
    OAlt.unwrap,
  );
};

const byDominanceDesc = pipe(
  N.Ord,
  OrdM.reverse,
  OrdM.contramap((builder: BuilderGroup) => builder.dominance),
);

const shortenPubkey = (pubkey: string): string =>
  pubkey.slice(0, 5) + "..." + pubkey.slice(-3);

export const builderCensorshipFromBuilderGroups = (
  builderGroups: RNEA.ReadonlyNonEmptyArray<BuilderGroup>,
): BuilderCensorship => {
  const blockCount = pipe(
    builderGroups,
    RA.chain((builder) => builder.builderUnits),
    RA.map((builder) => builder.totalBlocks),
    Monoid.concatAll(N.MonoidSum),
  );

  const censoringBlockCount = pipe(
    builderGroups,
    RA.chain((builder) => builder.builderUnits),
    RA.filter((builder) => builder.uncensoredBlocks === 0),
    RA.map((builder) => builder.totalBlocks),
    Monoid.concatAll(N.MonoidSum),
  );

  const dominance = censoringBlockCount / blockCount;

  const censoringPubkeys = pipe(
    builderGroups,
    RA.map((builderGroup) => builderGroup.censoringPubkeys),
    Monoid.concatAll(N.MonoidSum),
  );

  const totalPubkeys = pipe(
    builderGroups,
    RA.map((builderGroup) => builderGroup.totalPubkeys),
    Monoid.concatAll(N.MonoidSum),
  );

  return {
    builderGroups: pipe(builderGroups, RNEA.sort(byDominanceDesc)),
    censoringPubkeys,
    dominance,
    totalPubkeys,
  };
};

const blockCountFromBuilderRaws = (
  builders: RNEA.ReadonlyNonEmptyArray<BuilderRaw>,
): number =>
  pipe(
    builders,
    RA.map((builder) => builder.totalBlocks),
    Monoid.concatAll(N.MonoidSum),
  );

const builderCensorshipFromRaws = flow(
  E.traverseArray(BuilderRaw.decode),
  EAlt.unwrap,
  RNEA.fromReadonlyArray,
  OAlt.expect("expect API to return at least one builder"),
  builderGroupsFromApi,
  builderCensorshipFromBuilderGroups,
);

export const fetchBuilderCensorshipPerTimeFrame: T.Task<BuilderCensorshipPerTimeFrame> =
  pipe(
    fetchApiJsonTE<BuilderCensorshipResponse>("/api/censorship/builders-v2"),
    TEAlt.unwrap,
    T.map((body) => ({
      d7: builderCensorshipFromRaws(body.sevenDays),
      d30: builderCensorshipFromRaws(body.thirtyDays),
    })),
  );
