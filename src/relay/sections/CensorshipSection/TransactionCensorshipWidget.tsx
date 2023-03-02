import type { FC } from "react";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import SkeletonText from "../../../components/TextsNext/SkeletonText";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../../components/WidgetSubcomponents";
import { formatZeroDecimals } from "../../../format";
import TimeFrameIndicator from "../../../mainsite/components/TimeFrameIndicator";
import TinyStatus from "../../components/TinyStatus";

type Api =
  | {
      relay_censorship_per_time_frame: Record<
        "d1",
        { count: number; average_inclusion_time: number }
      >;
    }
  | undefined;

const api: Api = {
  relay_censorship_per_time_frame: {
    d1: {
      count: 22,
      average_inclusion_time: 33,
    },
  },
};

const getShortTimeDistancePostfix = (seconds: number) => {
  if (seconds < 60) {
    return `sec`;
  } else if (seconds < 60 * 60) {
    return `min`;
  } else if (seconds < 60 * 60 * 24) {
    return `hr`;
  } else {
    return `d`;
  }
};

type Props = {
  timeFrame: "d1";
};

const TransactionCensorshipWidget: FC<Props> = ({ timeFrame }) => {
  const transactionCensorship = api?.relay_censorship_per_time_frame[timeFrame];
  const dominance =
    transactionCensorship === undefined
      ? undefined
      : formatZeroDecimals(transactionCensorship.count);
  const averageInclusionTime =
    transactionCensorship === undefined
      ? undefined
      : String(transactionCensorship.average_inclusion_time);

  return (
    <WidgetBackground className="w-full">
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between gap-x-2">
          <WidgetTitle>transaction censorship</WidgetTitle>
          <TimeFrameIndicator timeFrame="d1" />
        </div>
        <QuantifyText
          size="text-2xl md:text-4xl"
          unitPostfix="transactions"
          unitPostfixColor="text-slateus-200"
          unitPostfixMargin="ml-4"
        >
          <SkeletonText>{dominance}</SkeletonText>
        </QuantifyText>
        <TinyStatus
          value={averageInclusionTime}
          unitPostfix={getShortTimeDistancePostfix(
            transactionCensorship.average_inclusion_time,
          )}
          postText="average inclusion time"
        />
      </div>
    </WidgetBackground>
  );
};

export default TransactionCensorshipWidget;
