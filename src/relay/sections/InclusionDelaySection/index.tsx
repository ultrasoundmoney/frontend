import type { FC } from "react";
import { useCallback, useState } from "react";
import Section from "../../../components/Section";
import LabelText from "../../../components/TextsNext/LabelText";
import TimeFrameControl from "../../../components/TimeFrameControl";
import InclusionTimesWidget from "./InclusionTimesWidget";
import SuboptimalInclusionsWidget from "./SuboptimalInclusionsWidget";
import InclusionDelayListWidget from "./InclusionDelayListWidget";
import type { InclusionTimesPerTimeFrame } from "../../api/censorship/inclusion_times";
import type { RecentDelayedTransactionsPerTimeFrame } from "../../api/inclusion-delays/recent_delayed_transactions";
import type { SuboptimalInclusionsPerTimeFrame } from "../../api/inclusion-delays/suboptimal_inclusions";

type Props = {
  inclusionTimesPerTimeFrame: InclusionTimesPerTimeFrame;
  recentDelayedTransactionsPerTimeFrame: RecentDelayedTransactionsPerTimeFrame;
  suboptimalInclusionsPerTimeFrame: SuboptimalInclusionsPerTimeFrame;
};

const InclusionDelaySection: FC<Props> = ({
  inclusionTimesPerTimeFrame,
  recentDelayedTransactionsPerTimeFrame,
  suboptimalInclusionsPerTimeFrame,
}) => {
  const [timeFrame, setTimeFrame] = useState<"d7" | "d30">("d7");
  const inclusionTimes = inclusionTimesPerTimeFrame[timeFrame];
  const suboptimalInclusions = suboptimalInclusionsPerTimeFrame[timeFrame];
  const transactions = recentDelayedTransactionsPerTimeFrame[timeFrame];

  const handleClickTimeFrame = useCallback(() => {
    setTimeFrame((timeFrame) => (timeFrame === "d7" ? "d30" : "d7"));
  }, []);

  return (
    <Section
      title="inclusion delay"
      subtitle="it can take time"
      link="inclusion-delay"
    >
      <div className="flex justify-center p-8 w-full rounded-lg bg-slateus-700">
        <div className="flex gap-4 items-center">
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
      <div className="grid grid-cols-1 gap-4 w-full lg:grid-cols-2">
        <InclusionTimesWidget
          inclusionTimes={inclusionTimes}
          timeFrame={timeFrame}
          onClickTimeFrame={handleClickTimeFrame}
        />
        <SuboptimalInclusionsWidget
          className="row-start-3 lg:row-start-auto"
          suboptimalInclusions={suboptimalInclusions}
          timeFrame={timeFrame}
          onClickTimeFrame={handleClickTimeFrame}
        />
        <InclusionDelayListWidget transactions={transactions} />
      </div>
    </Section>
  );
};

export default InclusionDelaySection;
