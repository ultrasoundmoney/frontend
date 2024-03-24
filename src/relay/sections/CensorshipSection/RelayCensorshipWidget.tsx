import type { FC } from "react";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import SkeletonText from "../../../components/TextsNext/SkeletonText";
import { formatPercentOneDecimal } from "../../../format";
import type { TimeFrame } from "../../../mainsite/time-frames";
import TinyStatus from "../../components/TinyStatus";
import WidgetBase from "../../components/WidgetBase";
import { OnClick } from "../../../components/TimeFrameControl";

export type Relay = {
  blocks_with_sanctioned_entity: number;
  censors: boolean;
  description?: string;
  dominance: number;
  id: string;
  name: string;
  url?: string;
};

export type RelayCensorship = {
  dominance: number;
  censoring_relay_count: number;
  relay_count: number;
  relays: Relay[];
};

type Props = {
  onClickTimeFrame: OnClick;
  relayCensorship: RelayCensorship;
  timeFrame: TimeFrame;
};

const RelayCensorshipWidget: FC<Props> = ({
  onClickTimeFrame,
  relayCensorship,
  timeFrame,
}) => (
  <WidgetBase
    hideTimeFrameLabel
    onClickTimeFrame={onClickTimeFrame}
    timeFrame={timeFrame}
    title="relay censorship"
  >
    <QuantifyText
      size="text-2xl sm:text-3xl xl:text-4xl"
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
  </WidgetBase>
);

export default RelayCensorshipWidget;
