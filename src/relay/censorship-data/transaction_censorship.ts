import censored_transactions_7d_last_200 from "./censored_transactions_7d_last_200.json";
// import censored_transactions_30d_last_200 from "./censored_transactions_30d_last_200.json";
import censored_transactions_30d from "./censored_transactions_30d.json";
import type { DateTimeString } from "../../time";

type TransactionRaw = {
  transaction_hash: string;
  block_number: number;
  mined: DateTimeString;
  delay: number;
  blacklist: string[];
  blocksdelay: number;
};

const rawData: Record<"d7" | "d30", TransactionRaw[]> = {
  d7: censored_transactions_7d_last_200,
  // d30: censored_transactions_30d_last_200,
  d30: censored_transactions_30d,
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

const d7Length = rawData.d30.filter((d) => d.block_number > 16699807).length;

const getTransactionsPerTimeFrame = (
  timeFrame: "d7" | "d30",
): TransactionCensorship => {
  const raw_transactions = rawData[timeFrame].sort(
    (a, b) => new Date(b.mined).getTime() - new Date(a.mined).getTime(),
  );
  const totalTransactions =
    timeFrame === "d7" ? d7Length : raw_transactions.length;
  // ???
  const totalBlocksCensored = 0;
  const transactions = raw_transactions.slice(0, 1000).map((d) => ({
    inclusion: d.mined,
    sanction_list: d.blacklist.join(", "),
    took: d.delay,
    transaction_delay: d.blocksdelay,
    transaction_hash: d.transaction_hash,
  }));

  return {
    count: totalTransactions,
    blocks_censored_percent: totalBlocksCensored / totalTransactions,
    average_inclusion_time: 0,
    transactions,
  };
};

export const transactionCensorshipPerTimeFrame: TransactionCensorshipPerTimeFrame =
  {
    d7: getTransactionsPerTimeFrame("d7"),
    d30: getTransactionsPerTimeFrame("d30"),
  };
