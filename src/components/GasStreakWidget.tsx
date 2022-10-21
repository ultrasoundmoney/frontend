import { FC, useContext } from "react";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import Skeleton from "react-loading-skeleton";
import {
  decodeGroupedAnalysis1,
  useGroupedAnalysis1,
} from "../api/grouped-analysis-1";
import { AmountUnitSpace } from "./Spacing";
import { WidgetBackground, WidgetTitle } from "./WidgetSubcomponents";
import { DateTimeString } from "../time";
import { FeatureFlagsContext } from "../feature-flags";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  formatDistanceStrict,
  parseISO,
} from "date-fns";
import LabelText from "./TextsNext/LabelText";
import { BaseText, LabelUnitText } from "./Texts";
import SkeletonText from "./TextsNext/SkeletonText";
import QuantifyText from "./TextsNext/QuantifyText";
import { useSpring, animated } from "react-spring";
import { formatZeroDecimals } from "../format";
import UltraSoundBarrier from "./UltraSoundBarrier";

type TimeElapsed = {
  secs: number;
  mins: number;
  hours: number;
  days: number;
};

const SpanningAge: FC<{
  isLoading: boolean;
  updatedAt: DateTimeString | undefined;
}> = ({ isLoading, updatedAt }) => {
  const featureFlags = useContext(FeatureFlagsContext);
  const [timeElapsed, setTimeElapsed] = useState<TimeElapsed>();

  useEffect(() => {
    if (updatedAt === undefined) {
      return;
    }

    const dt = parseISO(updatedAt);
    const secs = differenceInSeconds(new Date(), dt);
    const mins = differenceInMinutes(new Date(), dt);
    const hours = differenceInHours(new Date(), dt);
    const days = differenceInDays(new Date(), dt);
    setTimeElapsed({ secs, mins, hours, days });

    const intervalId = window.setInterval(() => {
      const secs = differenceInSeconds(new Date(), parseISO(updatedAt));
      const mins = differenceInMinutes(new Date(), parseISO(updatedAt));
      const hours = differenceInHours(new Date(), dt);
      const days = differenceInDays(new Date(), dt);
      setTimeElapsed({ secs, mins, hours, days });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [updatedAt]);

  const largestNonZero: keyof TimeElapsed | undefined =
    timeElapsed === undefined || featureFlags.previewSkeletons
      ? undefined
      : timeElapsed.days > 0
      ? "days"
      : timeElapsed.hours > 0
      ? "hours"
      : timeElapsed.mins > 0
      ? "mins"
      : "secs";

  const timeUnitsAgo =
    largestNonZero === undefined || timeElapsed === undefined
      ? undefined
      : timeElapsed[largestNonZero];

  // If it's one second, minute, hour, or day, cut of the 's' in seconds, etc.
  const postfix =
    timeUnitsAgo === undefined
      ? undefined
      : timeUnitsAgo === 1
      ? `${largestNonZero}`.slice(0, -1)
      : largestNonZero;

  return (
    <div className="flex items-baseline gap-x-1 truncate">
      <QuantifyText size="text-4xl">
        <SkeletonText width="10rem">
          {isLoading ? undefined : timeUnitsAgo ?? 0}
        </SkeletonText>
      </QuantifyText>
      <QuantifyText color="text-slateus-200" className="ml-1" size="text-4xl">
        {isLoading ? undefined : postfix ?? "seconds"}
      </QuantifyText>
    </div>
  );
};

const DeflationaryStreak: FC = () => {
  const groupedAnalysis1F = useGroupedAnalysis1();
  const groupedAnalysis1 = decodeGroupedAnalysis1(groupedAnalysis1F);

  const deflationaryStreak = groupedAnalysis1?.deflationaryStreak.postMerge;
  const { blocks } = useSpring({ blocks: deflationaryStreak?.count });

  return (
    <WidgetBackground>
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center gap-x-2">
          <WidgetTitle>gas streak</WidgetTitle>
        </div>
        <span className="font-inter text-xs font-extralight text-blue-spindle md:text-sm">
          <SpanningAge
            isLoading={deflationaryStreak === undefined}
            updatedAt={deflationaryStreak?.startedOn}
          />
        </span>
        <div className="flex items-center gap-x-1">
          <LabelUnitText className="mt-1">
            <animated.span>
              {blocks?.to((x) => formatZeroDecimals(x))}
            </animated.span>
          </LabelUnitText>
          <LabelText className="mt-1"> blocks</LabelText>
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
