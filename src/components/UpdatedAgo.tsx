import { differenceInMinutes, differenceInSeconds, parseISO } from "date-fns";
import type { FC } from "react";
import { useEffect, useState } from "react";
import type { DateTimeString } from "../time";
import { LabelUnitText } from "./Texts";
import LabelText from "./TextsNext/LabelText";

const UpdatedAge: FC<{ updatedAt: DateTimeString | undefined }> = ({
  updatedAt,
}) => {
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
    timeElapsed === undefined
      ? undefined
      : timeElapsed.secs >= 60
      ? timeElapsed.mins
      : timeElapsed.secs;

  const postfixSmall =
    timeElapsed === undefined
      ? undefined
      : timeElapsed?.secs >= 60
      ? timeElapsed.mins === 1
        ? "min"
        : "mins"
      : "secs";

  const postfixLarge =
    timeElapsed === undefined
      ? undefined
      : timeElapsed?.secs >= 60
      ? timeElapsed.mins === 1
        ? "minute"
        : "minutes"
      : "seconds";

  return (
    <div className="flex gap-x-1 items-baseline truncate">
      <LabelText className="text-slateus-400">updated</LabelText>
      <LabelUnitText className="-mr-1" skeletonWidth="1rem">
        {secsOrMins}
      </LabelUnitText>
      <LabelText className="ml-1 inline xs:hidden">{postfixSmall}</LabelText>
      <LabelText className="ml-1 hidden xs:inline">{postfixLarge}</LabelText>
      <LabelText className="text-slateus-400 truncate">ago</LabelText>
    </div>
  );
};

export default UpdatedAge;
