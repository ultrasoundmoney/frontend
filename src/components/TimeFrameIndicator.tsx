import { differenceInDays } from "date-fns";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { londonHardFork, parisHardFork } from "../dates";
import { millisFromHours } from "../duration";
import type { TimeFrameNext } from "../time-frames";
import { displayLimitedTimeFrameMap } from "../time-frames";
import LabelText from "./TextsNext/LabelText";
import { LondonHardForkTooltip } from "./TimeFrameControl";

const getFormattedDays = (now: Date, isParis: boolean) => {
    const daysCount = differenceInDays(
        now,
        isParis ? parisHardFork : londonHardFork,
    );
    return `${daysCount}d`;
};

type Props = {
    className?: string;
    onClickTimeFrame: () => void;
    timeFrame: TimeFrameNext;
};

const TimeFrameIndicator: FC<Props> = ({
    className = "",
    onClickTimeFrame,
    timeFrame,
}) => {
    const [daysSinceLondon, setDaysSinceLondon] = useState<string>();
    const [daysSinceParis, setDaysSinceParis] = useState<string>();

    useEffect(() => {
        setDaysSinceLondon(getFormattedDays(new Date(), false));
        setDaysSinceParis(getFormattedDays(new Date(), true));

        const id = setTimeout(() => {
            setDaysSinceLondon(getFormattedDays(new Date(), false));
            setDaysSinceParis(getFormattedDays(new Date(), true));
        }, millisFromHours(1));

        return () => clearTimeout(id);
    }, []);

    return (
        <LondonHardForkTooltip zLevel="z-30" timeFrame={timeFrame}>
            <button
                className={`flex items-baseline gap-x-2 ${className}`}
                onClick={onClickTimeFrame}
            >
                <LabelText>
                    {timeFrame === "since_burn"
                        ? "since burn"
                        : timeFrame === "since_merge"
                        ? "since merge"
                        : "time frame"}
                </LabelText>
                <p className="font-roboto text-xs text-white">
                    {timeFrame === "since_burn"
                        ? daysSinceLondon
                        : timeFrame === "since_merge"
                        ? daysSinceParis
                        : displayLimitedTimeFrameMap[timeFrame]}
                </p>
            </button>
        </LondonHardForkTooltip>
    );
};

export default TimeFrameIndicator;
