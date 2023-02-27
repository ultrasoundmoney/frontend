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

const RelayCensorshipWidget: FC = () => {
  return (
    <WidgetBackground className="w-full">
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between gap-x-2">
          <WidgetTitle>relay censorship</WidgetTitle>
          <TimeFrameIndicator
            timeFrame="d1"
            onClickTimeFrame={() => undefined}
          />
        </div>
        <div className="flex items-baseline gap-x-1">
          <QuantifyText size="text-4xl">
            <SkeletonText width="2rem">68.1%</SkeletonText>
          </QuantifyText>
          <QuantifyText
            color="text-slateus-200"
            className="ml-1"
            size="text-4xl"
          >
            <SkeletonText width="8rem">{"dominance"}</SkeletonText>
          </QuantifyText>
        </div>
        <div className="flex items-center gap-x-1">
          <LabelUnitText className="mt-1">
            <SkeletonText width="3rem">55.1%</SkeletonText>
          </LabelUnitText>
          <LabelText className="mt-1" color="text-slateus-400">
            of blocks censored
          </LabelText>
        </div>
      </div>
    </WidgetBackground>
  );
};

export default RelayCensorshipWidget;
