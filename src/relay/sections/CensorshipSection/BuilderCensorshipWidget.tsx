import type { FC } from "react";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import SkeletonText from "../../../components/TextsNext/SkeletonText";
import { formatPercentOneDecimal } from "../../../format";
import type { TimeFrame } from "../../../mainsite/time-frames";
import TinyStatus from "../../components/TinyStatus";
import WidgetBase from "../../components/WidgetBase";

export type Builder = {
  censoringPubkeys: number;
  censors: "partially" | "fully" | "no";
  description?: string;
  dominance: number;
  id: string;
  name: string;
  totalPubkeys: number;
};

export type BuilderCensorship = {
  builders: Builder[];
  censoringPubkeys: number;
  dominance: number;
  totalPubkeys: number;
};

type Props = {
  builderCensorship: BuilderCensorship;
  timeFrame: TimeFrame;
};

const BuilderCensorshipWidget: FC<Props> = ({
  builderCensorship,
  timeFrame,
}) => (
  <WidgetBase
    className="w-full"
    hideTimeFrameLabel
    timeFrame={timeFrame}
    title="builder censorship"
  >
    <QuantifyText
      size="text-2xl sm:text-3xl xl:text-4xl"
      unitPostfix="dominance"
      unitPostfixColor="text-slateus-200"
      unitPostfixMargin="ml-4"
    >
      <SkeletonText>
        {formatPercentOneDecimal(builderCensorship.dominance)}
      </SkeletonText>
    </QuantifyText>
    <TinyStatus
      value={`${builderCensorship.censoringPubkeys}/${builderCensorship.totalPubkeys}`}
      postText="censoring pubkeys"
      skeletonWidth="3.05rem"
    />
  </WidgetBase>
);

export default BuilderCensorshipWidget;
