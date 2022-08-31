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

  return (
    <div className="flex gap-x-1 truncate items-baseline">
      <LabelText className="text-slateus-400">updated</LabelText>
      <LabelUnitText className="-mr-1" skeletonWidth="1rem">
        {timeElapsed === undefined
          ? undefined
          : timeElapsed.secs >= 60
          ? timeElapsed.mins
          : timeElapsed.secs}
      </LabelUnitText>
      <LabelText className="ml-1 truncate">
        {timeElapsed === undefined
          ? undefined
          : timeElapsed?.secs >= 60
          ? timeElapsed.mins === 1
            ? "minute"
            : "minutes"
          : "seconds"}
      </LabelText>
      <LabelText className="text-slateus-400">ago</LabelText>
    </div>
  );
};

export default UpdatedAge;
