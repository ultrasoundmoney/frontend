import * as DateFns from "date-fns";
import type { FC } from "react";
import { useContext, useEffect, useState } from "react";
import CountUp from "react-countup";
import Skeleton from "react-loading-skeleton";
import { useMergeEstimate } from "../../api/merge-estimate";
import { FeatureFlagsContext } from "../../feature-flags";
import { O, pipe } from "../../fp";
import { useActiveBreakpoint } from "../../utils/use-active-breakpoint";
import { LabelText, TextRoboto } from "../Texts";
import Twemoji from "../Twemoji";
import { WidgetBackground } from "../WidgetSubcomponents";
import MergeEstimateTooltip from "./MergeEstimateTooltip";
import Nerd from "./Nerd";

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

export const TOTAL_TERMINAL_DIFFICULTY = 58750000000;

const CountdownNumber: FC<{ children: number | undefined }> = ({
  children,
}) => (
  <TextRoboto className="text-[1.7rem]">
    {children !== undefined ? children : <Skeleton width="2rem"></Skeleton>}
  </TextRoboto>
);

const MergeEstimateWidget = () => {
  const mergeEstimate = useMergeEstimate();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>();
  const { md } = useActiveBreakpoint();
  const featureFlags = useContext(FeatureFlagsContext);
  const [showNerdTooltip, setShowNerdTooltip] = useState(false);

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
    O.map((dateTime) => DateFns.format(dateTime, "MMM d, ~haaa")),
    O.toUndefined,
  );

  // If we don't have data, show a zero.
  // If we have data and we're not dealing with the two column layout on a
  // smaller screen (lg && !xl), show the full number.
  // If we are dealing with the two column layout and are on a small screen,
  // shorten the number by truncating thousands.
  const blocksToTTD =
    mergeEstimate === undefined
      ? undefined
      : mergeEstimate.blocksLeft > 1000
      ? mergeEstimate.blocksLeft / 1e3
      : mergeEstimate.blocksLeft;
  const blocksToTTDSuffix =
    mergeEstimate === undefined
      ? false
      : mergeEstimate.blocksLeft > 1000
      ? true
      : false;

  return (
    <>
      <WidgetBackground>
        <div className="relative flex flex-col md:flex-row justify-between gap-y-8 gap-x-2">
          <div className="flex flex-col gap-y-4">
            {/* Keeps the height of this widget equal to the adjacent one. */}
            {mergeEstimate !== undefined ? (
              <LabelText className="flex items-center min-h-[21px]">
                {`merge${md ? " estimate" : ""}—${mergeEstimateFormatted} UTC`}
              </LabelText>
            ) : (
              <LabelText className="flex items-center min-h-[21px]">
                merge estimate
              </LabelText>
            )}
            {(mergeEstimate !== undefined &&
              Number(mergeEstimate.totalDifficulty) / 1e12 >=
                TOTAL_TERMINAL_DIFFICULTY) ||
            featureFlags.simulatePostMerge ? (
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
              <div className="flex gap-x-6 md:gap-x-7">
                <div className="flex flex-col items-center gap-y-2 ">
                  <CountdownNumber>{timeLeft?.days}</CountdownNumber>
                  <LabelText className="text-slateus-400">
                    {timeLeft?.days === 1 ? "day" : "days"}
                  </LabelText>
                </div>
                <div className="flex flex-col items-center gap-y-2 ">
                  <CountdownNumber>{timeLeft?.hours}</CountdownNumber>

                  <LabelText className="text-slateus-400">
                    {timeLeft?.hours === 1 ? "hour" : "hours"}
                  </LabelText>
                </div>
                <div className="flex flex-col items-center gap-y-2 ">
                  <CountdownNumber>{timeLeft?.minutes}</CountdownNumber>
                  <LabelText className="text-slateus-400">
                    {timeLeft?.minutes === 1 ? "min" : "mins"}
                  </LabelText>
                </div>
                <div className="flex flex-col items-center gap-y-2 ">
                  <CountdownNumber>{timeLeft?.seconds}</CountdownNumber>
                  <LabelText className="text-slateus-400">
                    {timeLeft?.seconds === 1 ? "sec" : "secs"}
                  </LabelText>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-y-4">
            <div
              className={`
                flex items-center
                md:justify-end
                cursor-pointer
                [&_.gray-nerd]:hover:opacity-0
                [&_.color-nerd]:active:brightness-75
              `}
              onClick={() => setShowNerdTooltip(true)}
            >
              <LabelText className="truncate">wen TTD</LabelText>
              <Nerd />
              <div
                className={`
                  tooltip ${showNerdTooltip ? "block" : "hidden"} absolute
                  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                  w-[calc(100% + 96px)] max-w-sm
                  whitespace-nowrap
                  cursor-auto
                  z-30
                `}
              >
                <MergeEstimateTooltip
                  latestBlockDifficulty={mergeEstimate?.difficulty}
                  onClickClose={() => setShowNerdTooltip(false)}
                  totalDifficulty={mergeEstimate?.totalDifficulty}
                  totalTerminalDifficulty={TOTAL_TERMINAL_DIFFICULTY}
                />
              </div>
            </div>
            <div className="flex md:justify-end">
              <div className="flex flex-col gap-y-2 items-center">
                <TextRoboto className="text-[1.7rem]">
                  {blocksToTTD !== undefined ? (
                    <CountUp
                      separator=","
                      end={blocksToTTD}
                      suffix={blocksToTTDSuffix ? "K" : ""}
                      preserveValue
                    />
                  ) : (
                    <Skeleton width="4rem"></Skeleton>
                  )}
                </TextRoboto>
                <LabelText className="text-slateus-400">blocks</LabelText>
              </div>
            </div>
          </div>
        </div>
      </WidgetBackground>
      <div
        className={`
          fixed top-0 left-0 bottom-0 right-0
          flex justify-center items-center
          z-20
          bg-slateus-700/60
          backdrop-blur-sm
          ${showNerdTooltip ? "" : "hidden"}
        `}
        onClick={() => setShowNerdTooltip(false)}
      ></div>
    </>
  );
};

export default MergeEstimateWidget;
