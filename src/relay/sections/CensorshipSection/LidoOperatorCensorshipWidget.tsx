import type { FC } from "react";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import SkeletonText from "../../../components/TextsNext/SkeletonText";
import { formatPercentOneDecimal } from "../../../format";
import type { TimeFrame } from "../../../mainsite/time-frames";
import TinyStatus from "../../components/TinyStatus";
import WidgetBase from "../../components/WidgetBase";
import { OnClick } from "../../../components/TimeFrameControl";

export type Operator = {
  censors: boolean;
  description?: string;
  dominance: number;
  id: string;
  name: string;
  non_censoring_relays_connected_count: number;
  url: string | null;
};

export type LidoOperatorCensorship = {
  censoring_operator_count: number;
  dominance: number;
  non_censoring_relays_count: number;
  operator_count: number;
  operators: Operator[];
};

type Props = {
  lidoOperatorCensorship: LidoOperatorCensorship;
  onClickTimeFrame: OnClick;
  timeFrame: TimeFrame;
};

const LidoOperatorCensorshipWidget: FC<Props> = ({
  lidoOperatorCensorship,
  onClickTimeFrame,
  timeFrame,
}) => (
  <WidgetBase
    onClickTimeFrame={onClickTimeFrame}
    title="lido operator censorship"
    timeFrame={timeFrame}
    hideTimeFrameLabel
  >
    <QuantifyText
      size="text-2xl sm:text-3xl xl:text-4xl"
      unitPostfix="dominance"
      unitPostfixColor="text-slateus-200"
      unitPostfixMargin="ml-4"
    >
      <SkeletonText>
        {formatPercentOneDecimal(lidoOperatorCensorship.dominance)}
      </SkeletonText>
    </QuantifyText>
    <TinyStatus
      value={`${lidoOperatorCensorship.censoring_operator_count}/${lidoOperatorCensorship.operator_count}`}
      postText="censoring lido operators"
      skeletonWidth="3.05rem"
    />
  </WidgetBase>
);
export default LidoOperatorCensorshipWidget;
