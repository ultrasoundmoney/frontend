import type { SuboptimalTransaction } from "../sections/InclusionDelaySection/SuboptimalInclusionsGraph";
import { E, pipe, T, TEAlt } from "../../fp";
import { fetchApiJson } from "../fetchers";

export type SuboptimalInclusionsPerTimeFrame = Record<
  "d7" | "d30",
  SuboptimalTransaction[]
>;

export const getSuboptimalInclusionsPerTimeFrame: T.Task<SuboptimalInclusionsPerTimeFrame> =
  pipe(
    () => fetchApiJson<SuboptimalTransaction[]>("/api/censorship/delayed-txs"),
    T.map((body) =>
      "error" in body
        ? E.left(body.error)
        : E.right({
            d7: body.data.filter(
              (tx) =>
                new Date(tx.mined) >
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            ),
            d30: body.data,
          }),
    ),
    TEAlt.getOrThrow,
  );
