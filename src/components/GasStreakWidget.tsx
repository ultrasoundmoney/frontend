import { formatDistanceStrict } from "date-fns";
import { useSpring, motion } from "framer-motion";
import type { FC } from "react";
import CountUp from "react-countup";
import {
  decodeGroupedAnalysis1,
  useGroupedAnalysis1,
} from "../api/grouped-analysis-1";
import { LabelUnitText } from "./Texts";
import LabelText from "./TextsNext/LabelText";
import QuantifyText from "./TextsNext/QuantifyText";
import SkeletonText from "./TextsNext/SkeletonText";
import UltraSoundBarrier from "./UltraSoundBarrier";
import { WidgetBackground, WidgetTitle } from "./WidgetSubcomponents";

const SLOT_DURATION_IN_SECONDS = 12;

const SpanningAge: FC<{
  isLoading: boolean;
  blocks: number | undefined;
}> = ({ isLoading, blocks }) => {
  const durationSeconds =
    blocks === undefined ? undefined : blocks * SLOT_DURATION_IN_SECONDS;
  const formattedDistance =
    durationSeconds === undefined
      ? undefined
      : formatDistanceStrict(
          new Date(new Date().getTime() - durationSeconds * 1000),
          new Date(),
        );
  const distanceNumber =
    formattedDistance === undefined
      ? 0
      : Number(formattedDistance.split(" ")[0]);
  const formattedNumber = distanceNumber;
  const formattedUnit = formattedDistance?.split(" ")[1];

  return (
    <div className="flex items-baseline gap-x-1 truncate">
      <QuantifyText size="text-4xl">
        <SkeletonText width="10rem">
          {isLoading ? undefined : (
            <CountUp preserveValue end={formattedNumber} />
          )}
        </SkeletonText>
      </QuantifyText>
      <QuantifyText color="text-slateus-200" className="ml-1" size="text-4xl">
        {isLoading ? undefined : formattedUnit ?? "seconds"}
      </QuantifyText>
    </div>
  );
};

const DeflationaryStreak: FC = () => {
  const groupedAnalysis1F = useGroupedAnalysis1();
  const groupedAnalysis1 = decodeGroupedAnalysis1(groupedAnalysis1F);

  const deflationaryStreak = groupedAnalysis1?.deflationaryStreak.postMerge;

  return (
    <WidgetBackground>
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center gap-x-2">
          <WidgetTitle>gas streak</WidgetTitle>
        </div>
        <span className="font-inter text-xs font-extralight text-blue-spindle md:text-sm">
          <SpanningAge
            isLoading={deflationaryStreak === undefined}
            blocks={deflationaryStreak?.count}
          />
        </span>
        <div className="flex items-center gap-x-1">
          <LabelUnitText className="mt-1">
            {deflationaryStreak?.count}
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

export default DeflationaryStreak;
