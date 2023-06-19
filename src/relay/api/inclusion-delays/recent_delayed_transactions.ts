import type { SuboptimalTransaction } from "../../sections/InclusionDelaySection/SuboptimalInclusionsWidget";
import { A, pipe, T, TEAlt } from "../../../fp";
import { fetchCensorshipApiJsonTE } from "../../fetchers";

export type RecentDelayedTransactionsPerTimeFrame = Record<
  "d7" | "d30",
  SuboptimalTransaction[]
>;

export const fetchRecentDelayedTransactionsPerTimeFrame: T.Task<RecentDelayedTransactionsPerTimeFrame> =
  pipe(
    fetchCensorshipApiJsonTE<SuboptimalTransaction[]>(
      "/api/censorship/recent-delayed-txs",
    ),
    TEAlt.unwrap,
    T.map((body) => ({
      d7: pipe(
        body,
        A.filter(
          (tx) =>
            new Date(tx.mined) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        ),
      ),
      d30: body,
    })),
  );
