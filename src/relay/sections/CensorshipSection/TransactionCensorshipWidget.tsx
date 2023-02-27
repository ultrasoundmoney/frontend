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

const TransactionCensorshipWidget: FC = () => {
  return (
    <WidgetBackground className="flex w-full flex-col gap-y-4">
      <div className="flex items-center justify-between gap-x-2">
        <WidgetTitle>transaction censorship</WidgetTitle>
        <TimeFrameIndicator timeFrame="d1" onClickTimeFrame={() => undefined} />
      </div>
      <div className="flex items-baseline gap-x-1">
        <QuantifyText size="text-4xl">
          <SkeletonText width="2rem">22</SkeletonText>
        </QuantifyText>
        <QuantifyText color="text-slateus-200" className="ml-1" size="text-4xl">
          <SkeletonText width="8rem">transactions</SkeletonText>
        </QuantifyText>
      </div>
      <div className="flex items-center gap-x-1">
        <LabelUnitText className="mt-1">
          <SkeletonText width="3rem">33</SkeletonText>
        </LabelUnitText>
        <LabelText className="mt-1">sec</LabelText>
        <LabelText className="mt-1" color="text-slateus-400">
          average inclusion time
        </LabelText>
      </div>
    </WidgetBackground>
  );
};

export default TransactionCensorshipWidget;
