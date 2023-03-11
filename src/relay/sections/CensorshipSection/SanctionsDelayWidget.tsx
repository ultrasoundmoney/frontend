import type { FC } from "react";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import SkeletonText from "../../../components/TextsNext/SkeletonText";
import { formatOneDecimal } from "../../../format";
import type { TimeFrame } from "../../../mainsite/time-frames";
import type { SanctionsDelay } from "../../censorship-data/sanctions_delay";
import TinyStatus from "../../components/TinyStatus";
import WidgetBase from "../../components/WidgetBase";

type Props = {
  sanctionsDelay: SanctionsDelay;
  timeFrame: TimeFrame;
};

const SanctionsDelayWidget: FC<Props> = ({ sanctionsDelay, timeFrame }) => (
  <WidgetBase title="sanctions delay" timeFrame={timeFrame} hideTimeFrameLabel>
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
