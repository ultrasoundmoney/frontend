import type { FC } from "react";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import SkeletonText from "../../../components/TextsNext/SkeletonText";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../../components/WidgetSubcomponents";
import { formatOneDecimal } from "../../../format";
import TimeFrameIndicator from "../../../mainsite/components/TimeFrameIndicator";
import type { TimeFrame } from "../../../mainsite/time-frames";
import type { SanctionsDelay } from "../../censorship-data/sanctions_delay";
import TinyStatus from "../../components/TinyStatus";


type Props = {
  sanctionsDelay: SanctionsDelay
  timeFrame: TimeFrame;
};

const SanctionsDelayWidget: FC<Props> = ({
  sanctionsDelay,
  timeFrame,
}) => {
  return (
    <WidgetBackground className="w-full">
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between gap-x-2">
          <WidgetTitle>sanctions delay</WidgetTitle>
          <TimeFrameIndicator timeFrame={timeFrame} />
        </div>
        <QuantifyText
          size="text-2xl md:text-4xl"
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
          mobilePostText="censored OFAC tx"
          skeletonWidth="3.05rem"
        />
      </div>
    </WidgetBackground>
  );
};

export default SanctionsDelayWidget;
