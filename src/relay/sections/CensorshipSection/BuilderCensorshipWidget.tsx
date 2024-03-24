import type { FC } from "react";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import SkeletonText from "../../../components/TextsNext/SkeletonText";
import { formatPercentOneDecimal } from "../../../format";
import type { O, RNEA } from "../../../fp";
import type { TimeFrame } from "../../../mainsite/time-frames";
import TinyStatus from "../../components/TinyStatus";
import WidgetBase from "../../components/WidgetBase";
import type { OnClick } from "../../../components/TimeFrameControl";

export type BuilderUnit = {
  pubkey: string;
  totalBlocks: number;
  uncensoredBlocks: number;
};

export type Censors = "no" | "partially" | "fully";

export type BuilderGroup = {
  builderUnits: RNEA.ReadonlyNonEmptyArray<BuilderUnit>;
  censoringPubkeys: number;
  censors: Censors;
  description: O.Option<string>;
  dominance: number;
  id: string;
  name: string;
  totalPubkeys: number;
};

export type BuilderCensorship = {
  builderGroups: RNEA.ReadonlyNonEmptyArray<BuilderGroup>;
  censoringPubkeys: number;
  dominance: number;
  totalPubkeys: number;
};

type Props = {
  builderCensorship: BuilderCensorship;
  onClickTimeFrame: OnClick;
  timeFrame: TimeFrame;
};

const BuilderCensorshipWidget: FC<Props> = ({
  builderCensorship,
  onClickTimeFrame,
  timeFrame,
}) => (
  <WidgetBase
    className="w-full"
    hideTimeFrameLabel
    onClickTimeFrame={onClickTimeFrame}
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
