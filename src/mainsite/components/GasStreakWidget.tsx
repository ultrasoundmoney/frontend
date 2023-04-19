import * as DateFns from "date-fns";
import type { FC } from "react";
import LabelText from "../../components/TextsNext/LabelText";
import { LabelUnitText } from "../../components/TextsNext/LabelUnitText";
import QuantifyText from "../../components/TextsNext/QuantifyText";
import SkeletonText from "../../components/TextsNext/SkeletonText";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../components/WidgetSubcomponents";
import { formatZeroDecimals } from "../../format";
import { O, OAlt, pipe } from "../../fp";
import type { DateTimeString } from "../../time";
import {
  decodeGroupedAnalysis1,
  useGroupedAnalysis1,
} from "../api/grouped-analysis-1";
import { useNow } from "../hooks/use-now";
import UltraSoundBarrier from "./UltraSoundBarrier";

type SpanningAgeProps = {
  isLoading: boolean;
  count: number | undefined;
  startedOn: DateTimeString | undefined;
};

const SpanningAge: FC<SpanningAgeProps> = ({ isLoading, startedOn }) => {
  const now = useNow();
  const startedOnO = pipe(startedOn, O.fromNullable, O.map(DateFns.parseISO));
  const formattedDistance = pipe(
    OAlt.sequenceTuple(startedOnO, now),
    O.map(([startedOn, now]) =>
      DateFns.formatDistanceStrict(startedOn, now, {
        roundingMethod: "floor",
      }),
    ),
  );
  const formattedNumber = pipe(
    formattedDistance,
    O.match(
      () => 0,
      (formattedDistance) => Number(formattedDistance.split(" ")[0]),
    ),
  );
  const formattedUnit = O.toUndefined(formattedDistance)?.split(" ")[1];

  return (
    <div className="flex gap-x-1 items-baseline">
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
        <div className="flex gap-x-2 items-center">
          <WidgetTitle>gas streak</WidgetTitle>
        </div>
        <SpanningAge
          isLoading={deflationaryStreak === undefined}
          startedOn={deflationaryStreak?.startedOn ?? undefined}
          count={deflationaryStreak?.count ?? undefined}
        />
        <div className="flex gap-x-1 items-center">
          <div className="flex gap-x-1 items-baseline">
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
          </div>
          <UltraSoundBarrier />
        </div>
      </div>
    </WidgetBackground>
  );
};

export default GasStreakWidget;
