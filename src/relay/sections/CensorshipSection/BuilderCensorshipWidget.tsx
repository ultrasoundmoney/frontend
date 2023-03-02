import type { FC } from "react";
import { LabelUnitText } from "../../../components/Texts";
import LabelText from "../../../components/TextsNext/LabelText";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import SkeletonText from "../../../components/TextsNext/SkeletonText";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../../components/WidgetSubcomponents";
import { formatPercentOneDecimal } from "../../../format";
import TimeFrameIndicator from "../../../mainsite/components/TimeFrameIndicator";

type Api = {
  builder_censorship_per_time_frame: Record<
    "d1",
    { dominance: number; blocks_censored: number }
  >;
};

const api: Api = {
  builder_censorship_per_time_frame: {
    d1: {
      dominance: 0.425,
      blocks_censored: 0.521,
    },
  },
};

type Props = {
  timeFrame: "d1";
};

const BuilderCensorshipWidget: FC<Props> = ({ timeFrame }) => {
  const builderCensorship = api?.builder_censorship_per_time_frame[timeFrame];
  const dominance =
    builderCensorship === undefined
      ? undefined
      : formatPercentOneDecimal(builderCensorship.dominance);
  const blocksCensored =
    builderCensorship === undefined
      ? undefined
      : formatPercentOneDecimal(builderCensorship.blocks_censored);

  return (
    <WidgetBackground className="w-full">
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between gap-x-2">
          <WidgetTitle>builder censorship</WidgetTitle>
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
        <div className="flex items-center gap-x-1">
          <LabelUnitText className="mt-1">
            <SkeletonText width="3.05rem">{blocksCensored}</SkeletonText>
          </LabelUnitText>
          <LabelText className="mt-1" color="text-slateus-400">
            of blocks censored
          </LabelText>
        </div>
      </div>
    </WidgetBackground>
  );
};

export default BuilderCensorshipWidget;
