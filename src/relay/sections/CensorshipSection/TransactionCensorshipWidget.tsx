import type { FC } from "react";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import SkeletonText from "../../../components/TextsNext/SkeletonText";
import { formatPercentOneDecimal, formatZeroDecimals } from "../../../format";
import type { TimeFrame } from "../../../mainsite/time-frames";
import type { TransactionCensorship } from "../../censorship-data/transaction_censorship";
import TinyStatus from "../../components/TinyStatus";
import WidgetBase from "../../components/WidgetBase";

type Props = {
  transactionCensorship: TransactionCensorship;
  timeFrame: TimeFrame;
};

const TransactionCensorshipWidget: FC<Props> = ({
  transactionCensorship,
  timeFrame,
}) => {
  return (
    <WidgetBase
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
        <SkeletonText>{transactionCensorship.count}</SkeletonText>
      </QuantifyText>
      <div className="flex flex-col gap-x-2 gap-y-4 justify-between md:flex-row lg:flex-row">
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
};

export default TransactionCensorshipWidget;
