import type { DateTimeString } from "../../time";
import { pipe } from "fp-ts/lib/function";
import { A, E, N, T, TEAlt } from "../../fp";
import { fetchApiJson } from "../fetchers";
import type { TimeFrame } from "../../mainsite/time-frames";

type TransactionRaw = {
  transactionHash: string;
  blockNumber: number;
  mined: DateTimeString;
  delay: number;
  blacklist: string[];
  blockDelay: number;
};

export type CensoredTransaction = {
  inclusion: DateTimeString;
  sanctionListIds: string[];
  sanctionsListName: string;
  took: number;
  transaction_delay: number;
  transaction_hash: string;
};

export type TransactionCensorship = {
  averageInclusionTime: number;
  blocksCensoredPercent: number;
  count: number;
  transactions: CensoredTransaction[];
};

export type TransactionCensorshipPerTimeFrame = Record<
  "d7" | "d30",
  TransactionCensorship
>;

const sanctionListNameMap: Record<string, string> = {
  ofac: "OFAC (US)",
};

const getTransactionsPerTimeFrame = (
  rawData: TransactionRaw[],
  timeFrame: TimeFrame,
): TransactionCensorship => {
  const raw_transactions = rawData.sort(
    (a, b) => new Date(b.mined).getTime() - new Date(a.mined).getTime(),
  );
  const totalTransactions = raw_transactions.length;
  const totalBlocksCensored = pipe(
    raw_transactions,
    A.map((transaction) => transaction.blockNumber),
    A.uniq(N.Eq),
    A.size,
  );
  // Estimate the total number of blocks for the time frame.
  const totalBlocks =
    timeFrame === "d7"
      ? (7 * 24 * 60 * 60) / 12
      : timeFrame === "d30"
      ? (30 * 24 * 60 * 60) / 12
      : (undefined as never);

  // Is delay the same as inclusion time?
  const averageInclusionTime = pipe(
    raw_transactions,
    A.map((transaction) => transaction.delay),
    A.reduce(0, (a, b) => a + b),
    (total) => total / totalTransactions,
  );

  const transactions = raw_transactions.slice(0, 1000).map(
    (d): CensoredTransaction => ({
      inclusion: d.mined,
      sanctionListIds: d.blacklist,
      sanctionsListName:
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        sanctionListNameMap[d.blacklist[0]!] ?? d.blacklist.join(", "),
      took: d.delay,
      transaction_delay: d.blockDelay,
      transaction_hash: d.transactionHash,
    }),
  );

  return {
    count: totalTransactions,
    blocksCensoredPercent: totalBlocksCensored / totalBlocks,
    averageInclusionTime: averageInclusionTime,
    transactions,
  };
};

export const getTransactionCensorshipPerTimeFrame: T.Task<TransactionCensorshipPerTimeFrame> =
  pipe(
    () => fetchApiJson<TransactionRaw[]>("/api/censorship/censored-txs"),
    T.map((body) =>
      "error" in body
        ? E.left(body.error)
        : E.right({
            d7: pipe(
              body.data,
              A.filter(
                (transactionRaw) =>
                  new Date(transactionRaw.mined).getTime() >
                  new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
              ),
              (transactions) => getTransactionsPerTimeFrame(transactions, "d7"),
            ),
            d30: getTransactionsPerTimeFrame(body.data, "d30"),
          }),
    ),
    TEAlt.getOrThrow,
  );
