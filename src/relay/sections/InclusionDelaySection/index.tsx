import type { FC } from "react";
import Section from "../../../components/Section";
import type { InclusionTimesPerTimeFrame } from "../../censorship-data/inclusion_times";
import InclusionTimesWidget from "./InclusionTimesWidget";
// import TransactionInclusionDelayWidget from "./TransactionInclusionDelayWidget";

type Props = {
  inclusionTimesPerTimeFrame: InclusionTimesPerTimeFrame;
};

const InclusionDelaySection: FC<Props> = ({ inclusionTimesPerTimeFrame }) => {
  const timeFrame = "d7";
  const inclusionTimes = inclusionTimesPerTimeFrame[timeFrame];

  return (
    <Section
      title="inclusion delay"
      subtitle="it can take time"
      link="inclusion-delay"
    >
      <div className="grid w-full grid-cols-1 gap-4 ">
        {/* <TransactionInclusionDelayWidget /> */}
        <InclusionTimesWidget
          inclusionTimes={inclusionTimes}
          timeFrame={timeFrame}
        />
      </div>
    </Section>
  );
};

export default InclusionDelaySection;
