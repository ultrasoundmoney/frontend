import type { FC } from "react";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import SkeletonText from "../../../components/TextsNext/SkeletonText";
import { formatPercentOneDecimal, formatZeroDecimals } from "../../../format";
import type { TimeFrame } from "../../../mainsite/time-frames";
import type { DateTimeString } from "../../../time";
import TinyStatus from "../../components/TinyStatus";
import WidgetBase from "../../components/WidgetBase";
import type { OnClick } from "../../../components/TimeFrameControl";

export type CensoredTransaction = {
  delayBlocks: number;
  hash: string;
  inclusion: DateTimeString;
  sanctionListIds: string[];
  sanctionsListName: string;
  tookSeconds: number;
};

export type TransactionCensorship = {
  averageInclusionTime: number;
  blocksCensoredPercent: number;
  count: number;
  transactions: CensoredTransaction[];
};

type Props = {
  onClickTimeFrame: OnClick;
  transactionCensorship: TransactionCensorship;
  transactionCount: number;
  timeFrame: TimeFrame;
};

const TransactionCensorshipWidget: FC<Props> = ({
  onClickTimeFrame,
  transactionCensorship,
  transactionCount,
  timeFrame,
}) => (
  <WidgetBase
    onClickTimeFrame={onClickTimeFrame}
    title="transaction censorship"
    timeFrame={timeFrame}
    hideTimeFrameLabel
  >
    <QuantifyText
      size="text-2xl sm:text-3xl xl:text-4xl"
      unitPostfix="transactions"
      unitPostfixColor="text-slateus-200"
      unitPostfixMargin="ml-4"
    >
      <SkeletonText>{transactionCount}</SkeletonText>
    </QuantifyText>
    <div className="flex flex-col gap-x-2 gap-y-4 justify-between sm:flex-row lg:flex-row">
      <TinyStatus
        value={formatPercentOneDecimal(
          transactionCensorship.blocksCensoredPercent,
        )}
        postText="blocks censored"
      />
      <TinyStatus
        value={
          formatZeroDecimals(transactionCensorship.averageInclusionTime) + "s"
        }
        postText="average inclusion time"
      />
    </div>
  </WidgetBase>
);

export default TransactionCensorshipWidget;
