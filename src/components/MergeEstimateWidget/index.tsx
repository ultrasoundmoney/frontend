import * as DateFns from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import type { FC } from "react";
import { useContext, useEffect, useState } from "react";
import CountUp from "react-countup";
import type { MergeEstimate } from "../../api/merge-estimate";
import { TOTAL_TERMINAL_DIFFICULTY } from "../../eth-constants";
import { FeatureFlagsContext } from "../../feature-flags";
import Nerd from "../Nerd";
import { TextRoboto } from "../Texts";
import LabelText from "../TextsNext/LabelText";
import SkeletonText from "../TextsNext/SkeletonText";
import Twemoji from "../Twemoji";
import WidgetErrorBoundary from "../WidgetErrorBoundary";
import { WidgetBackground } from "../WidgetSubcomponents";
import MergeEstimateTooltip from "./MergeEstimateTooltip";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const getTimeLeft = (now: Date, estimatedDateTime: Date) => ({
  days: DateFns.differenceInDays(estimatedDateTime, now),
  hours: DateFns.differenceInHours(estimatedDateTime, now) % 24,
  minutes: DateFns.differenceInMinutes(estimatedDateTime, now) % 60,
  seconds: DateFns.differenceInSeconds(estimatedDateTime, now) % 60,
});

const CountdownNumber: FC<{ children: number | undefined }> = ({
  children,
}) => (
  <TextRoboto className="text-[1.7rem]">
    <SkeletonText width="2rem">{children}</SkeletonText>
  </TextRoboto>
);

const Celebration = () => (
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
);

const Countdown: FC<{ mergeEstimate: MergeEstimate }> = ({ mergeEstimate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>();
  const featureFlags = useContext(FeatureFlagsContext);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(
        getTimeLeft(
          new Date(),
          DateFns.parseISO(mergeEstimate.estimatedDateTime),
        ),
      );
    }, 1000);

    return () => clearInterval(id);
  }, [mergeEstimate]);

  useEffect(() => {
    setTimeLeft(
      getTimeLeft(
        new Date(),
        DateFns.parseISO(mergeEstimate.estimatedDateTime),
      ),
    );
  }, [mergeEstimate.estimatedDateTime]);

  return Number(mergeEstimate.totalDifficulty) / 1e12 >=
    TOTAL_TERMINAL_DIFFICULTY || featureFlags.simulatePostMerge ? (
    <Celebration />
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
  );
};

type Props = {
  mergeEstimate: MergeEstimate;
};

const MergeEstimateWidget: FC<Props> = ({ mergeEstimate }) => {
  const [showNerdTooltip, setShowNerdTooltip] = useState(false);
  const [mergeEstimateFormatted, setMergeEstimateFormatted] =
    useState<string>();

  useEffect(() => {
    setMergeEstimateFormatted(
      formatInTimeZone(mergeEstimate.estimatedDateTime, "UTC", "MMM d, ~haaa"),
    );
  }, [mergeEstimate.estimatedDateTime]);

  // If we don't have data, show a zero.
  // If we have data and we're not dealing with the two column layout on a
  // smaller screen (lg && !xl), show the full number.
  // If we are dealing with the two column layout and are on a small screen,
  // shorten the number by truncating thousands.
  const blocksToTTD =
    mergeEstimate.blocksLeft > 1000
      ? mergeEstimate.blocksLeft / 1e3
      : mergeEstimate.blocksLeft;
  const blocksToTTDSuffix = mergeEstimate.blocksLeft > 1000 ? true : false;

  return (
    <WidgetErrorBoundary title="merge estimate">
      <WidgetBackground>
        <div className="relative flex flex-col md:flex-row justify-between gap-y-8 gap-x-2">
          <div className="flex flex-col gap-y-4">
            {/* Keeps the height of this widget equal to the adjacent one. */}
            {
              <div className="flex items-center min-h-[21px] ">
                <LabelText>merge</LabelText>
                <LabelText className="hidden md:inline">
                  &nbsp;estimate
                </LabelText>
                <LabelText className="hidden md:inline">:</LabelText>
                {mergeEstimateFormatted && (
                  <LabelText className="ml-1 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-500">{`${mergeEstimateFormatted} UTC`}</LabelText>
                )}
              </div>
            }
            <Countdown mergeEstimate={mergeEstimate} />
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
                  tooltip ${showNerdTooltip ? "block" : "hidden"} fixed
                  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                  w-[calc(100% + 96px)]
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
                <TextRoboto className="text-[1.7rem] min-h-[40.8px]">
                  <CountUp
                    separator=","
                    end={blocksToTTD}
                    suffix={blocksToTTDSuffix ? "K" : ""}
                    preserveValue
                  />
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
    </WidgetErrorBoundary>
  );
};

export default MergeEstimateWidget;
