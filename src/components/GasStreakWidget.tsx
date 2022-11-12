import { addSeconds, formatDistanceStrict, parseISO } from "date-fns";
import type { FC } from "react";
import {
  decodeGroupedAnalysis1,
  useGroupedAnalysis1,
} from "../api/grouped-analysis-1";
import { formatZeroDecimals } from "../format";
import type { DateTimeString } from "../time";
import { SECONDS_PER_SLOT } from "../time";
import { LabelUnitText } from "./Texts";
import LabelText from "./TextsNext/LabelText";
import QuantifyText from "./TextsNext/QuantifyText";
import SkeletonText from "./TextsNext/SkeletonText";
import UltraSoundBarrier from "./UltraSoundBarrier";
import { WidgetBackground, WidgetTitle } from "./WidgetSubcomponents";

type SpanningAgeProps = {
  isLoading: boolean;
  count: number | undefined;
  startedOn: DateTimeString | undefined;
};

const SpanningAge: FC<SpanningAgeProps> = ({ isLoading, count, startedOn }) => {
  const formattedDistance =
    startedOn === undefined || count === undefined
      ? undefined
      : formatDistanceStrict(
          parseISO(startedOn),
          addSeconds(parseISO(startedOn), count * SECONDS_PER_SLOT),
        );
  const formattedNumber =
    formattedDistance === undefined
      ? 0
      : Number(formattedDistance.split(" ")[0]);
  const formattedUnit = formattedDistance?.split(" ")[1];

  return (
    <div className="flex items-baseline gap-x-1 truncate">
      <QuantifyText size="text-4xl">
        <SkeletonText width="2rem">
          {isLoading ? undefined : formattedNumber}
        </SkeletonText>
      </QuantifyText>
      <QuantifyText color="text-slateus-200" className="ml-1" size="text-4xl">
        <SkeletonText width="8rem">
          {isLoading ? undefined : formattedUnit ?? "seconds"}
        </SkeletonText>
      </QuantifyText>
    </div>
  );
};

const GasStreakWidget: FC = () => {
  const groupedAnalysis1F = useGroupedAnalysis1();
  const groupedAnalysis1 = decodeGroupedAnalysis1(groupedAnalysis1F);
  const deflationaryStreak = groupedAnalysis1?.deflationaryStreak.postMerge;

  return (
    <WidgetBackground>
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-x-2">
          <WidgetTitle>gas streak</WidgetTitle>
        </div>
        <span className="font-inter text-xs font-extralight text-slateus-200 md:text-sm">
          <SpanningAge
            isLoading={deflationaryStreak === undefined}
            startedOn={deflationaryStreak?.startedOn ?? undefined}
            count={deflationaryStreak?.count ?? undefined}
          />
        </span>
        <div className="flex items-center gap-x-1">
          <LabelUnitText className="mt-1">
            <SkeletonText width="3rem">
              {deflationaryStreak === undefined
                ? undefined
                : deflationaryStreak === null
                ? 0
                : formatZeroDecimals(deflationaryStreak.count)}
            </SkeletonText>
          </LabelUnitText>
          <LabelText className="mt-1">
            {deflationaryStreak?.count === 1 ? " block" : " blocks"}
          </LabelText>
          <LabelText className="mt-1" color="text-slateus-400">
            above
          </LabelText>
          <UltraSoundBarrier />
        </div>
      </div>
    </WidgetBackground>
  );
};

export default GasStreakWidget;
