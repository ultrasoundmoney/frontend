import type { DateTimeString } from "../../../time";
import { A, N, pipe, T, TEAlt } from "../../../fp";
import { fetchApiJsonTE } from "../../fetchers";
import type {
  CensoredTransaction,
  TransactionCensorship,
} from "../../sections/CensorshipSection/TransactionCensorshipWidget";
import * as DateFns from "date-fns";

type TransactionRaw = {
  transactionHash: string;
  blockNumber: number;
  mined: DateTimeString;
  delay: number;
  blacklist: string[];
  blockDelay: number;
};

export type TransactionCensorshipPerTimeFrame = Record<
  "d7" | "d30",
  TransactionCensorship
>;

const sanctionListNameMap: Record<string, string> = {
  ofac: "OFAC (US)",
};

const fetchTransactionsPerTimeFrame = (
  rawData: TransactionRaw[],
  timeFrame: "d7" | "d30",
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
      tookSeconds: d.delay,
      delayBlocks: d.blockDelay,
      hash: d.transactionHash,
    }),
  );

  return {
    count: totalTransactions,
    blocksCensoredPercent: totalBlocksCensored / totalBlocks,
    averageInclusionTime: averageInclusionTime,
    transactions,
  };
};

const isTransactionLessThanSevenDaysOld = (transaction: TransactionRaw) =>
  DateFns.isAfter(new Date(transaction.mined), DateFns.subDays(new Date(), 7));

export const fetchTransactionCensorshipPerTimeFrame: T.Task<TransactionCensorshipPerTimeFrame> =
  pipe(
    fetchApiJsonTE<TransactionRaw[]>("/api/censorship/censored-txs"),
    TEAlt.unwrap,
    T.map((body) => ({
      d7: pipe(
        body,
        A.filter(isTransactionLessThanSevenDaysOld),
        (transactions) => fetchTransactionsPerTimeFrame(transactions, "d7"),
      ),
      d30: fetchTransactionsPerTimeFrame(body, "d30"),
    })),
  );
