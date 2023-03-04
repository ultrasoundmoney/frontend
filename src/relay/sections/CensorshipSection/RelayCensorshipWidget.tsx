import type { FC } from "react";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import SkeletonText from "../../../components/TextsNext/SkeletonText";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../../components/WidgetSubcomponents";
import { formatPercentOneDecimal } from "../../../format";
import TimeFrameIndicator from "../../../mainsite/components/TimeFrameIndicator";
import type { TimeFrame } from "../../../mainsite/time-frames";
import TinyStatus from "../../components/TinyStatus";

export type Relay = {
  blocks_with_sanctioned_entity: number;
  censors: boolean;
  description?: string;
  dominance: number;
  id: string;
  name: string;
};

export type RelayCensorship = {
  dominance: number;
  censoring_relay_count: number;
  relay_count: number;
  relays: Relay[];
};

type Props = {
  timeFrame: TimeFrame;
  relayCensorship: RelayCensorship;
};

const RelayCensorshipWidget: FC<Props> = ({ relayCensorship, timeFrame }) => (
  <WidgetBackground className="w-full">
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between gap-x-2">
        <WidgetTitle>relay censorship</WidgetTitle>
        <TimeFrameIndicator timeFrame={timeFrame} />
      </div>
      <QuantifyText
        size="text-2xl md:text-4xl"
        unitPostfix="dominance"
        unitPostfixColor="text-slateus-200"
        unitPostfixMargin="ml-4"
      >
        <SkeletonText>
          {formatPercentOneDecimal(relayCensorship.dominance)}
        </SkeletonText>
      </QuantifyText>
      <TinyStatus
        value={`${relayCensorship.censoring_relay_count}/${relayCensorship.relay_count}`}
        postText="censoring relays"
        skeletonWidth="3.05rem"
      />
    </div>
  </WidgetBackground>
);

export default RelayCensorshipWidget;
