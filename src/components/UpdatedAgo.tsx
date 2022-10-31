import { differenceInMinutes, differenceInSeconds, parseISO } from "date-fns";
import type { FC } from "react";
import { useContext } from "react";
import { useEffect, useState } from "react";
import { FeatureFlagsContext } from "../feature-flags";
import type { DateTimeString } from "../time";
import { LabelUnitText } from "./Texts";
import LabelText from "./TextsNext/LabelText";
import SkeletonText from "./TextsNext/SkeletonText";

const UpdatedAge: FC<{ updatedAt: DateTimeString | undefined }> = ({
  updatedAt,
}) => {
  const featureFlags = useContext(FeatureFlagsContext);
  const [timeElapsed, setTimeElapsed] = useState<{
    secs: number;
    mins: number;
  }>();

  useEffect(() => {
    if (updatedAt === undefined) {
      return;
    }

    const secs = differenceInSeconds(new Date(), parseISO(updatedAt));
    const mins = differenceInMinutes(new Date(), parseISO(updatedAt));
    setTimeElapsed({ secs, mins });

    const intervalId = window.setInterval(() => {
      const secs = differenceInSeconds(new Date(), parseISO(updatedAt));
      const mins = differenceInMinutes(new Date(), parseISO(updatedAt));
      setTimeElapsed({ secs, mins });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [updatedAt]);

  const secsOrMins =
    timeElapsed === undefined || featureFlags.previewSkeletons
      ? undefined
      : timeElapsed.secs >= 60
      ? timeElapsed.mins
      : timeElapsed.secs;

  const postfixLarge =
    timeElapsed === undefined
      ? undefined
      : timeElapsed?.secs >= 60
      ? timeElapsed.mins === 1
        ? "minute"
        : "minutes"
      : "seconds";

  return (
    <div className="flex items-baseline gap-x-1 truncate">
      <LabelText color="text-slateus-400">updated</LabelText>
      <LabelUnitText className="-mr-1">
        <SkeletonText width="4.5rem">{secsOrMins}</SkeletonText>
      </LabelUnitText>
      <LabelText className="ml-1">{postfixLarge}</LabelText>
      <LabelText color="text-slateus-400" className="truncate">
        ago
      </LabelText>
    </div>
  );
};

export default UpdatedAge;
