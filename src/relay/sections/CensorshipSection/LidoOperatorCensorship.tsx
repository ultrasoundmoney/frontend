import type { FC } from "react";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import SkeletonText from "../../../components/TextsNext/SkeletonText";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../../components/WidgetSubcomponents";
import { formatPercentOneDecimal } from "../../../format";
import TimeFrameIndicator from "../../../mainsite/components/TimeFrameIndicator";
import { TimeFrame } from "../../../mainsite/time-frames";
import TinyStatus from "../../components/TinyStatus";

export type Operator = {
  censors: boolean;
  description?: string;
  dominance: number;
  id: string;
  name: string;
  non_censoring_relays_connected_count: number;
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
  timeFrame: TimeFrame;
};

const LidoOperatorCensorship: FC<Props> = ({
  lidoOperatorCensorship,
  timeFrame,
}) => {
  return (
    <WidgetBackground className="w-full">
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between gap-x-2">
          <WidgetTitle>lido operator censorship</WidgetTitle>
          <TimeFrameIndicator timeFrame={timeFrame} />
        </div>
        <QuantifyText
          size="text-2xl md:text-4xl"
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
      </div>
    </WidgetBackground>
  );
};

export default LidoOperatorCensorship;
