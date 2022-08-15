import { LabelText, StatusText, TextRoboto } from "../Texts";
import { WidgetBackground } from "../WidgetSubcomponents";
import * as DateFns from "date-fns";
import { useEffect, useState } from "react";
import Twemoji from "../Twemoji";
import { MERGE_TIMESTAMP_ESTIMATED } from "../../eth-time";
import { useMergeEstimate } from "../../api/merge-estimate";
import { O, pipe } from "../../fp";
import Modal from "../Modal";
import MergeEstimateTooltip from "./MergeEstimateTooltip";
import { Amount } from "../Amount";
import CountUp from "react-countup";
import { merge } from "highcharts";
import { estimatedDailyFeeBurn } from "../../utils/metric-utils";
import { useActiveBreakpoint } from "../../utils/use-active-breakpoint";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const getTimeLeft = (estimatedDateTime: Date) => ({
  days: DateFns.differenceInDays(estimatedDateTime, new Date()),
  hours: DateFns.differenceInHours(estimatedDateTime, new Date()) % 24,
  minutes: DateFns.differenceInMinutes(estimatedDateTime, new Date()) % 60,
  seconds: DateFns.differenceInSeconds(estimatedDateTime, new Date()) % 60,
});

const shiftDateTimeByTimeZone = (dateTime: Date): Date =>
  new Date(dateTime.toISOString().slice(0, -1));

const MergeEstimateWidget = () => {
  const mergeEstimate = useMergeEstimate();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>();
  const [isHoveringNerd, setIsHoveringNerd] = useState(false);
  const { md } = useActiveBreakpoint();

  useEffect(() => {
    if (mergeEstimate === undefined) {
      return undefined;
    }

    const id = setInterval(() => {
      setTimeLeft(getTimeLeft(mergeEstimate.estimatedDateTime));
    }, 1000);

    return () => clearInterval(id);
  }, [mergeEstimate]);

  const mergeEstimateFormatted = pipe(
    mergeEstimate,
    O.fromNullable,
    O.map((mergeEstimate) => mergeEstimate.estimatedDateTime),
    O.map(shiftDateTimeByTimeZone),
    O.map((dateTime) => DateFns.format(dateTime, "MMM d, haaa")),
    O.toUndefined,
  );

  return (
    <>
      <WidgetBackground>
        <div className="relative flex flex-col md:flex-row justify-between gap-y-8">
          <div className="flex flex-col gap-y-4">
            {/* Keeps the height of this widget equal to the adjacent one. */}
            <LabelText className="flex items-center min-h-[21px]">
              {`merge estimate—${mergeEstimateFormatted} UTC`}
            </LabelText>
            {DateFns.isPast(MERGE_TIMESTAMP_ESTIMATED) ? (
              <div className="flex gap-x-8 mx-auto items-center h-14">
                <Twemoji className="flex gap-x-2" imageClassName="h-10" wrapper>
                  🎉
                </Twemoji>
                <Twemoji className="flex gap-x-2" imageClassName="h-10" wrapper>
                  🦇🔊🐼
                </Twemoji>
                <Twemoji className="flex gap-x-2" imageClassName="h-10" wrapper>
                  🎉
                </Twemoji>
              </div>
            ) : (
              <div className="flex gap-x-4 md:gap-x-8 mx-auto ">
                <div className="flex flex-col items-center gap-y-2 w-[44px]">
                  <TextRoboto className="text-4xl">
                    {timeLeft?.days ?? 0}
                  </TextRoboto>
                  <LabelText>{timeLeft?.days === 1 ? "day" : "days"}</LabelText>
                </div>
                <div className="flex flex-col items-center gap-y-2 w-[44px]">
                  <TextRoboto className="text-4xl">
                    {timeLeft?.hours ?? 0}
                  </TextRoboto>
                  <LabelText>
                    {timeLeft?.hours === 1 ? "hour" : "hours"}
                  </LabelText>
                </div>
                <div className="flex flex-col items-center gap-y-2 w-[44px]">
                  <TextRoboto className="text-4xl">
                    {timeLeft?.minutes ?? 0}
                  </TextRoboto>
                  <LabelText>
                    {timeLeft?.minutes === 1 ? "min" : "mins"}
                  </LabelText>
                </div>
                <div className="flex flex-col items-center gap-y-2 w-[44px]">
                  <TextRoboto className="text-4xl">
                    {timeLeft?.seconds ?? 0}
                  </TextRoboto>
                  <LabelText>
                    {timeLeft?.seconds === 1 ? "sec" : "secs"}
                  </LabelText>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-y-4">
            <div
              className="flex items-center [&_.tooltip]:hover:block pr-8 md:pr-0 cursor-pointer md:justify-end"
              onMouseEnter={() => setIsHoveringNerd(true)}
              onMouseLeave={() => setIsHoveringNerd(false)}
            >
              <LabelText>blocks to ttd</LabelText>
              <img
                alt="an emoji of a nerd"
                className={`ml-2 select-none ${isHoveringNerd ? "hidden" : ""}`}
                src={`/nerd-coloroff.svg`}
              />
              <img
                alt="an colored emoji of a nerd"
                className={`ml-2 select-none ${isHoveringNerd ? "" : "hidden"}`}
                src={`/nerd-coloron.svg`}
              />
              <div
                className={`
                  tooltip hidden absolute
                  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                  w-[calc(100% + 96px)] max-w-xs
                  whitespace-nowrap
                  z-10
                `}
              >
                <MergeEstimateTooltip
                  fancyFormulaFormatting={md}
                  latestBlockDifficulty={mergeEstimate?.difficulty}
                  totalDifficulty={mergeEstimate?.totalDifficulty}
                />
              </div>
            </div>
            <div className="flex flex-col gap-y-2 md:items-center">
              <TextRoboto className="text-4xl">
                <CountUp
                  separator=","
                  end={mergeEstimate?.blocksLeft ?? 0}
                  preserveValue
                />
              </TextRoboto>
              <LabelText className="hidden md:block">blocks</LabelText>
            </div>
          </div>
        </div>
      </WidgetBackground>
    </>
  );
};

export default MergeEstimateWidget;
