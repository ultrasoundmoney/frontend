import type { FC } from "react";
import { useEffect, useState } from "react";
import LabelText from "../../components/TextsNext/LabelText";
import { ico } from "../../dates";
import { millisFromHours } from "../../duration";
import { getFormattedDays } from "./TimeFrameIndicator";

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
