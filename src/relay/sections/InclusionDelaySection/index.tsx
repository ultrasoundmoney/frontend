import type { FC } from "react";
import { useState } from "react";
import Section from "../../../components/Section";
import LabelText from "../../../components/TextsNext/LabelText";
import TimeFrameControl from "../../../components/TimeFrameControl";
import type { InclusionTimesPerTimeFrame } from "../../censorship-data/inclusion_times";
import InclusionTimesWidget from "./InclusionTimesWidget";
// import TransactionInclusionDelayWidget from "./TransactionInclusionDelayWidget";

type Props = {
  inclusionTimesPerTimeFrame: InclusionTimesPerTimeFrame;
};

const InclusionDelaySection: FC<Props> = ({ inclusionTimesPerTimeFrame }) => {
  const [timeFrame, setTimeFrame] = useState<"d7" | "d30">("d7");
  const inclusionTimes = inclusionTimesPerTimeFrame[timeFrame];

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
            selectedTimeframe={timeFrame}
            onSetTimeFrame={() =>
              setTimeFrame((timeFrame) => (timeFrame === "d7" ? "d30" : "d7"))
            }
            version="censorship"
          />
        </div>
      </div>
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
