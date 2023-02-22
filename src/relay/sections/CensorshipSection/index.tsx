import type { FC } from "react";
import Section from "../../../components/Section";
import CensoredTransactionsWidget from "./CensoredTransactionsWidget";
import InclusionTimesWidget from "./InclusionTimesWidget";
import RelayCensorshipWidget from "./RelayCensorshipWidget";
import RelaysWidget from "./RelaysWidget";
import TransactionCensorshipWidget from "./TransactionCensorshipWidget";

const CensorshipSection: FC = () => {
  return (
    <Section title="censorship" subtitle="not ultra sound" link="censorship">
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
        <RelayCensorshipWidget />
        <TransactionCensorshipWidget />
        <RelaysWidget
          relays={[
            { name: "Flashbots", censoring: true, dominance: 0.603 },
            {
              name: "bloXroute",
              description: "max profit",
              dominance: 0.397,
              censoring: false,
            },
          ]}
        />
        <CensoredTransactionsWidget
          transactions={[
            {
              category: "OFAC",
              hash: "0xf450",
              inclusion: "2023-02-22T07:00:00Z",
              took: 32,
            },
            {
              category: "congestion",
              hash: "0xa2d0",
              inclusion: "2023-02-22T06:00:00Z",
              took: 46,
            },
            {
              category: "unknown",
              hash: "0x2ba2",
              inclusion: "2023-02-22T05:00:00Z",
              took: 103,
            },
            {
              category: "OFAC",
              hash: "0x55bf",
              inclusion: "2023-02-22T04:00:00Z",
              took: 37,
            },
          ]}
        />
        <InclusionTimesWidget />
      </div>
    </Section>
  );
};

export default CensorshipSection;
