import type { SuboptimalTransaction } from "../../sections/InclusionDelaySection/SuboptimalInclusionsWidget";
import { A, pipe, T, TEAlt } from "../../../fp";
import { fetchCensorshipApiJsonTE } from "../../fetchers";

export type SuboptimalInclusionsPerTimeFrame = Record<
  "d7" | "d30",
  SuboptimalTransaction[]
>;

const isTransactionLessThanSevenDaysOld = (
  tx: SuboptimalTransaction,
): boolean =>
  new Date(tx.mined) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

export const fetchSuboptimalInclusionsPerTimeFrame: T.Task<SuboptimalInclusionsPerTimeFrame> =
  pipe(
    fetchCensorshipApiJsonTE<SuboptimalTransaction[]>(
      "/api/censorship/delayed-txs",
    ),
    TEAlt.unwrap,
    T.map((body) => ({
      d7: pipe(body, A.filter(isTransactionLessThanSevenDaysOld)),
      d30: body,
    })),
  );
