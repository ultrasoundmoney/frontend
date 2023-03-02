import type { FC } from "react";
import Section from "../../../components/Section";
import InclusionTimesWidget from "./InclusionTimesWidget";
import TransactionInclusionDelayWidget from "./TransactionInclusionDelayWidget";

const InclusionDelaySection: FC = () => (
  <Section
    title="inclusion delay"
    subtitle="it can take time"
    link="inclusion-delay"
  >
    <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
      <TransactionInclusionDelayWidget />
      <InclusionTimesWidget />
    </div>
  </Section>
);

export default InclusionDelaySection;
