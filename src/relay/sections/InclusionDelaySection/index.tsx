import type { FC } from "react";
import { useState } from "react";
import Section from "../../../components/Section";
import LabelText from "../../../components/TextsNext/LabelText";
import TimeFrameControl from "../../../components/TimeFrameControl";
import type { InclusionTimesPerTimeFrame } from "../../censorship-data/inclusion_times";
import type { SuboptimalInclusionsPerTimeFrame } from "../../censorship-data/suboptimal_inclusions";
import InclusionTimesWidget from "./InclusionTimesWidget";
import SuboptimalInclusions from "./SuboptimalInclusions";
// import TransactionInclusionDelayWidget from "./TransactionInclusionDelayWidget";

type Props = {
  inclusionTimesPerTimeFrame: InclusionTimesPerTimeFrame;
  suboptimalInclusionsPerTimeFrame: SuboptimalInclusionsPerTimeFrame;
};

const InclusionDelaySection: FC<Props> = ({
  inclusionTimesPerTimeFrame,
  suboptimalInclusionsPerTimeFrame,
}) => {
  const [timeFrame, setTimeFrame] = useState<"d7" | "d30">("d7");
  const inclusionTimes = inclusionTimesPerTimeFrame[timeFrame];
  const suboptimalInclusions = suboptimalInclusionsPerTimeFrame[timeFrame];
  // const transactions = suboptimalInclusionsPerTimeFrame[timeFrame];

  return (
    <Section
      title="inclusion delay"
      subtitle="it can take time"
      link="inclusion-delay"
    >
      <div className="flex w-full justify-center rounded-lg bg-slateus-700 p-8">
        <div className="flex items-center gap-4">
          <LabelText>time frame</LabelText>
          <TimeFrameControl
            selectedTimeFrame={timeFrame}
            onSetTimeFrame={() =>
              setTimeFrame((timeFrame) => (timeFrame === "d7" ? "d30" : "d7"))
            }
            version="censorship"
          />
        </div>
      </div>
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
        <InclusionTimesWidget
          inclusionTimes={inclusionTimes}
          timeFrame={timeFrame}
        />
        <SuboptimalInclusions
          suboptimalInclusions={suboptimalInclusions}
          timeFrame={timeFrame}
        />
        {/* <TransactionInclusionDelayWidget transactions={transactions} /> */}
      </div>
    </Section>
  );
};

export default InclusionDelaySection;
