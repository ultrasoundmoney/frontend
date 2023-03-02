import type { FC } from "react";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import SkeletonText from "../../../components/TextsNext/SkeletonText";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../../components/WidgetSubcomponents";
import { formatPercentOneDecimal } from "../../../format";
import TimeFrameIndicator from "../../../mainsite/components/TimeFrameIndicator";
import TinyStatus from "../../components/TinyStatus";

type Api = {
  relay_censorship_per_time_frame: Record<
    "d1",
    { dominance: number; blocks_censored: number }
  >;
};

const api: Api = {
  relay_censorship_per_time_frame: {
    d1: {
      dominance: 0.122,
      blocks_censored: 0.211,
    },
  },
};

type Props = {
  timeFrame: "d1";
};

const LidoOperatorCensorship: FC<Props> = ({ timeFrame }) => {
  const relayCensorship = api?.relay_censorship_per_time_frame[timeFrame];
  const dominance =
    relayCensorship === undefined
      ? undefined
      : formatPercentOneDecimal(relayCensorship.dominance);
  const blocksCensored =
    relayCensorship === undefined
      ? undefined
      : formatPercentOneDecimal(relayCensorship.blocks_censored);

  return (
    <WidgetBackground className="w-full">
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between gap-x-2">
          <WidgetTitle>lido operator censorship</WidgetTitle>
          <TimeFrameIndicator timeFrame="d1" />
        </div>
        <QuantifyText
          size="text-2xl md:text-4xl"
          unitPostfix="dominance"
          unitPostfixColor="text-slateus-200"
          unitPostfixMargin="ml-4"
        >
          <SkeletonText>{dominance}</SkeletonText>
        </QuantifyText>
        <TinyStatus
          value={blocksCensored}
          postText="of blocks censored"
          skeletonWidth="3.05rem"
        />
      </div>
    </WidgetBackground>
  );
};

export default LidoOperatorCensorship;
