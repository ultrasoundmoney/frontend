import { differenceInDays } from "date-fns";
import type { FC } from "react";
import { useEffect, useState } from "react";
import LabelText from "../../components/TextsNext/LabelText";
import { ico } from "../../dates";
import { millisFromHours } from "../../duration";
import type { TimeFrame } from "../time-frames";
import { displayLimitedTimeFrameMap } from "../time-frames";
import type { OnClick } from "../../components/TimeFrameControl";

const getFormattedDays = (now: Date, fork: Date): string => {
  const daysCount = differenceInDays(now, fork);
  return `${daysCount}d`;
};

type Props = {
  className?: string;
};

const ICOTimeFrameIndicator: FC<Props> = ({ className = "" }) => {
  const [daysSinceICO, setDaysSinceICO] = useState<string>();

  useEffect(() => {
    setDaysSinceICO(getFormattedDays(new Date(), ico));

    const id = setTimeout(() => {
      setDaysSinceICO(getFormattedDays(new Date(), ico));
    }, millisFromHours(1));

    return () => clearTimeout(id);
  }, []);

  return (
    <div
      className={`
          flex items-baseline gap-x-2
          ${className}
        `}
    >
      <LabelText className={"block"}>since ico</LabelText>
      <p className="font-roboto text-xs text-white">{daysSinceICO}</p>
    </div>
  );
};

export default ICOTimeFrameIndicator;
