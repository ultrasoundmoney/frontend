import type { FC } from "react";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import SkeletonText from "../../../components/TextsNext/SkeletonText";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../../components/WidgetSubcomponents";
import { formatPercentOneDecimal } from "../../../format";
import TimeFrameIndicator from "../../../mainsite/components/TimeFrameIndicator";
import type { TimeFrame } from "../../../mainsite/time-frames";
import TinyStatus from "../../components/TinyStatus";

export type Builder = {
  censoring_pub_key_count: number;
  censors: "partially" | "fully" | "no";
  description?: string;
  dominance: number;
  id: string;
  name: string;
  pub_key_count: number;
};

export type BuilderCensorship = {
  builders: Builder[];
  censoring_pub_key_count: number;
  dominance: number;
  pub_key_count: number;
};

type Props = {
  builderCensorship: BuilderCensorship;
  timeFrame: TimeFrame;
};

const BuilderCensorshipWidget: FC<Props> = ({
  builderCensorship,
  timeFrame,
}) => {
  return (
    <WidgetBackground className="w-full">
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between gap-x-2">
          <WidgetTitle>builder censorship</WidgetTitle>
          <TimeFrameIndicator timeFrame={timeFrame} />
        </div>
        <QuantifyText
          size="text-2xl md:text-4xl"
          unitPostfix="dominance"
          unitPostfixColor="text-slateus-200"
          unitPostfixMargin="ml-4"
        >
          <SkeletonText>
            {formatPercentOneDecimal(builderCensorship.dominance)}
          </SkeletonText>
        </QuantifyText>
        <TinyStatus
          value={`${builderCensorship.censoring_pub_key_count}/${builderCensorship.pub_key_count}`}
          postText="censoring builder pubkeys"
          skeletonWidth="3.05rem"
        />
      </div>
    </WidgetBackground>
  );
};

export default BuilderCensorshipWidget;
