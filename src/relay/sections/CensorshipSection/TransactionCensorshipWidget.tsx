import type { FC } from "react";
import { LabelUnitText } from "../../../components/Texts";
import LabelText from "../../../components/TextsNext/LabelText";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import SkeletonText from "../../../components/TextsNext/SkeletonText";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../../components/WidgetSubcomponents";
import TimeFrameIndicator from "../../../mainsite/components/TimeFrameIndicator";
import type { TimeFrame } from "../../../mainsite/time-frames";
import type { TransactionCensorship } from "../../censorship-data/transaction_censorship";

type Props = {
  transactionCensorship: TransactionCensorship;
  timeFrame: TimeFrame;
};

const TransactionCensorshipWidget: FC<Props> = ({
  transactionCensorship,
  timeFrame,
}) => {
  return (
    <WidgetBackground className="w-full">
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between gap-x-2">
          <WidgetTitle>transaction censorship</WidgetTitle>
          <TimeFrameIndicator timeFrame={timeFrame} />
        </div>
        <QuantifyText
          size="text-2xl md:text-4xl"
          unitPostfix="transactions"
          unitPostfixColor="text-slateus-200"
          unitPostfixMargin="ml-4"
        >
          <SkeletonText>{transactionCensorship.count}</SkeletonText>
        </QuantifyText>
        <div className="flex items-baseline gap-x-1">
          <LabelText color="text-slateus-400">{""}</LabelText>
          <LabelUnitText className="invisible">
            <SkeletonText>{"0.3%"}</SkeletonText>
          </LabelUnitText>
          <LabelText color="text-slateus-200">{""}</LabelText>
          <LabelText color="text-slateus-400">{""}</LabelText>
        </div>
      </div>
    </WidgetBackground>
  );
};

export default TransactionCensorshipWidget;
