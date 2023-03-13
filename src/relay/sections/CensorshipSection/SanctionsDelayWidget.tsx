import type { FC } from "react";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import SkeletonText from "../../../components/TextsNext/SkeletonText";
import { formatOneDecimal } from "../../../format";
import type { TimeFrame } from "../../../mainsite/time-frames";
import TinyStatus from "../../components/TinyStatus";
import WidgetBase from "../../components/WidgetBase";

export type SanctionsDelay = {
  count: number;
  censored_count: number;
  average_censored_delay: number;
};

type Props = {
  onClickTimeFrame: () => void;
  sanctionsDelay: SanctionsDelay;
  timeFrame: TimeFrame;
};

const SanctionsDelayWidget: FC<Props> = ({
  onClickTimeFrame,
  sanctionsDelay,
  timeFrame,
}) => (
  <WidgetBase
    hideTimeFrameLabel
    onClickTimeFrame={onClickTimeFrame}
    timeFrame={timeFrame}
    title="sanctions delay"
  >
    <QuantifyText
      size="text-2xl sm:text-3xl xl:text-4xl"
      unitPostfix="seconds"
      unitPostfixColor="text-slateus-200"
      unitPostfixMargin="ml-4"
    >
      <SkeletonText>
        {formatOneDecimal(sanctionsDelay.average_censored_delay)}
      </SkeletonText>
    </QuantifyText>
    <TinyStatus
      value={`${sanctionsDelay.censored_count}/${sanctionsDelay.count}`}
      postText="censored OFAC transactions"
      mobilePostText="censored OFAC transactions"
      skeletonWidth="3.05rem"
    />
  </WidgetBase>
);

export default SanctionsDelayWidget;
