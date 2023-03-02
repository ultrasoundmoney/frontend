import type { FC } from "react";
import Section from "../../../components/Section";
import BuilderCensorshipWidget from "./BuilderCensorshipWidget";
import BuilderListWidget from "./BuilderListWidget";
import LidoOperatorCensorship from "./LidoOperatorCensorship";
import LidoOperatorList from "./LidoOperatorList";
import RelayCensorshipWidget from "./RelayCensorshipWidget";
import RelayListWidget from "./RelayListWidget";
import TransactionCensorshipList from "./TransactionCensorshipList";
import TransactionCensorshipWidget from "./TransactionCensorshipWidget";

const CensorshipSection: FC = () => (
  <Section title="censorship" subtitle="not ultra sound" link="censorship">
    <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <RelayCensorshipWidget timeFrame="d1" />
        <RelayListWidget timeFrame="d1" />
      </div>
      <div className="flex flex-col gap-4">
        <BuilderCensorshipWidget timeFrame="d1" />
        <BuilderListWidget timeFrame="d1" />
      </div>
      <div className="flex flex-col gap-4">
        <LidoOperatorCensorship timeFrame="d1" />
        <LidoOperatorList timeFrame="d1" />
      </div>
      <div className="flex flex-col gap-4">
        <TransactionCensorshipWidget timeFrame="d1" />
        <TransactionCensorshipList timeFrame="d1" />
      </div>
    </div>
  </Section>
);

export default CensorshipSection;
