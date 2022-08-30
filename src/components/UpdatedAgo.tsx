import { differenceInSeconds, parseISO } from "date-fns";
import type { FC } from "react";
import { useEffect, useState } from "react";
import type { DateTimeString } from "../time";
import { LabelUnitText } from "./Texts";
import LabelText from "./TextsNext/LabelText";

const UpdatedAge: FC<{ updatedAt: DateTimeString }> = ({ updatedAt }) => {
  const [timeElapsed, setTimeElapsed] = useState<number>();

  useEffect(() => {
    if (updatedAt === undefined) {
      return;
    }

    setTimeElapsed(differenceInSeconds(new Date(), parseISO(updatedAt)));

    const intervalId = window.setInterval(() => {
      setTimeElapsed(differenceInSeconds(new Date(), parseISO(updatedAt)));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [updatedAt]);

  return (
    <div className="flex gap-x-1 truncate items-baseline">
      <LabelText className="text-slateus-400 hidden md:block">
        updated
      </LabelText>
      <LabelUnitText className="-mr-1" skeletonWidth="1rem">
        {timeElapsed}
      </LabelUnitText>
      <LabelText className="ml-1 truncate">seconds</LabelText>
      <LabelText className="text-slateus-400">ago</LabelText>
    </div>
  );
};

export default UpdatedAge;
