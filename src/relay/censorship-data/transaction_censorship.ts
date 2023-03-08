import type { DateTimeString } from "../../time";
import { pipe } from "fp-ts/lib/function";
import { A, E, T, TEAlt } from "../../fp";
import { fetchApiJson } from "../fetchers";

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
  sanction_list: string;
  took: number;
  transaction_delay: number;
  transaction_hash: string;
};

export type TransactionCensorship = {
  count: number;
  blocks_censored_percent: number;
  average_inclusion_time: number;
  transactions: CensoredTransaction[];
};

export type TransactionCensorshipPerTimeFrame = Record<
  "d7" | "d30",
  TransactionCensorship
>;

const getTransactionsPerTimeFrame = (
  rawData: TransactionRaw[],
): TransactionCensorship => {
  const raw_transactions = rawData.sort(
    (a, b) => new Date(b.mined).getTime() - new Date(a.mined).getTime(),
  );
  const totalTransactions = raw_transactions.length;
  // ???
  const totalBlocksCensored = 0;
  const transactions = raw_transactions.slice(0, 1000).map((d) => ({
    inclusion: d.mined,
    sanction_list: d.blacklist.join(", "),
    took: d.delay,
    transaction_delay: d.blockDelay,
    transaction_hash: d.transactionHash,
  }));

  return {
    count: totalTransactions,
    blocks_censored_percent: totalBlocksCensored / totalTransactions,
    average_inclusion_time: 0,
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
              getTransactionsPerTimeFrame,
            ),
            d30: getTransactionsPerTimeFrame(body.data),
          }),
    ),
    TEAlt.getOrThrow,
  );
