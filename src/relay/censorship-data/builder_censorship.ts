import builders_7d from "./builders_7d.json";
import builders_30d from "./builders_30d.json";
import { A, N, OrdM, pipe } from "../../fp";
import type {
  Builder,
  BuilderCensorship,
} from "../sections/CensorshipSection/BuilderCensorshipWidget";

type BuilderRaw = {
  pubkey: string | null;
  builder_id: string | null;
  censoring: string;
  count: number;
};

type RawData = Record<"d7" | "d30", BuilderRaw[]>;

const rawData: RawData = {
  d7: builders_7d,
  d30: builders_30d,
};

export type BuilderCensorshipPerTimeFrame = Record<
  "d7" | "d30",
  BuilderCensorship
>;

export const getBuilderCensorship = (
  timeFrame: "d7" | "d30",
): BuilderCensorship => {
  const builders = rawData[timeFrame].filter(
    (builder) => builder.builder_id !== null && builder.pubkey !== null,
  );
  const blockCountBuilder = pipe(
    builders,
    A.reduce(new Map<string, number>(), (acc, builder) => {
      // filtered above
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const id = builder.builder_id!;
      const count = builder.count;
      const oldCount = acc.get(id) ?? 0;
      return acc.set(id, oldCount + count);
    }),
  );
  const censoringKeyCountBuilder = pipe(
    builders,
    A.filter((builder) => builder.censoring === "yes"),
    A.reduce(new Map<string, number>(), (acc, builder) => {
      // filtered above
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const id = builder.builder_id!;
      const oldCount = acc.get(id) ?? 0;
      return acc.set(id, oldCount + 1);
    }),
  );
  const pubKeyCountBuilder = pipe(
    builders,
    A.reduce(new Map<string, number>(), (acc, builder) => {
      // filtered above
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const id = builder.builder_id!;
      const oldCount = acc.get(id) ?? 0;
      return acc.set(id, oldCount + 1);
    }),
  );
  const blockCountAll = pipe(
    builders,
    A.reduce(0, (acc, builder) => acc + builder.count),
  );
  const blockCountCensoringKeys = pipe(
    builders,
    A.filter((builder) => builder.censoring === "yes"),
    A.reduce(0, (acc, builder) => acc + builder.count),
  );

  const byDominanceDesc = pipe(
    N.Ord,
    OrdM.reverse,
    OrdM.contramap((builder: Builder) => builder.dominance),
  );

  const builderCensorship: BuilderCensorship = {
    builders: pipe(
      builders,
      A.map((builder) => builder.builder_id),
      // filtered above
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      A.reduce(new Set<string>(), (acc, id) => acc.add(id!)),
      (set) => Array.from(set),
      A.map(
        (builder): Builder => ({
          censoring_pub_key_count: censoringKeyCountBuilder.get(builder) ?? 0,
          censors:
            censoringKeyCountBuilder.get(builder) === undefined
              ? "no"
              : censoringKeyCountBuilder.get(builder) ===
                pubKeyCountBuilder.get(builder)
              ? "fully"
              : "partially",
          dominance: (blockCountBuilder.get(builder) ?? 0) / blockCountAll,
          id: builder,
          name: builder,
          pub_key_count: pubKeyCountBuilder.get(builder) ?? 0,
        }),
      ),
      A.sort(byDominanceDesc),
    ),
    censoring_pub_key_count: pipe(
      builders,
      A.filter((builder) => builder.censoring === "yes"),
      A.size,
    ),
    dominance: blockCountCensoringKeys / blockCountAll,
    pub_key_count: pipe(builders, A.size),
  };

  return builderCensorship;
};

export const builderCensorshipPerTimeFrame: BuilderCensorshipPerTimeFrame = {
  d7: getBuilderCensorship("d7"),
  d30: getBuilderCensorship("d30"),
};
