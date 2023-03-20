import type { FC } from "react";

import type { Payload, Builder } from "../../types";
import Section from "../../../components/Section";
import TopBuildersWidget from "./TopBuildersWidget";
import TopBlocksWidget from "./TopBlocksWidget";

type Props = {
  payloadCount: number;
  topPayloads: Array<Payload>;
  topBuilders: Array<Builder>;
};

const LeaderboardSection: FC<Props> = ({
  payloadCount,
  topBuilders,
  topPayloads,
}) => {
  return (
    <Section title="leaderboards" subtitle="ultra wow" link="leaderboards">
      <div className="flex w-full flex-col gap-x-4 gap-y-4 lg:flex-row">
        <div className="flex flex-col lg:w-1/2">
          <TopBuildersWidget
            payloadCount={payloadCount}
            topBuilders={topBuilders}
          />
        </div>
        <div className="flex flex-col lg:w-1/2">
          <TopBlocksWidget topBlocks={topPayloads} />
        </div>
      </div>
    </Section>
  );
};

export default LeaderboardSection;
