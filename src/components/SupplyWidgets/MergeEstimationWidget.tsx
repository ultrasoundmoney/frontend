// import * as DateFns from "date-fns";
// import { useContext } from "react";
// import Skeleton from "react-loading-skeleton";
// import { FeatureFlagsContext } from "../../feature-flags";
// import { pipe } from "../../fp";
// import { MoneyAmount } from "../Amount";
import { LabelText, StatusText, TextRoboto } from "../Texts";
import { WidgetBackground } from "../WidgetSubcomponents";
// import PreciseEth from "./PreciseEth";
import * as DateFns from "date-fns";
import { useEffect, useState } from "react";
import Twemoji from "../Twemoji";

const MERGE_TIMESTAMP_ESTIMATED = new Date("2022-09-15T12:00:00Z");

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const getTimeLeft = () => ({
  days: DateFns.differenceInDays(MERGE_TIMESTAMP_ESTIMATED, new Date()),
  hours: DateFns.differenceInHours(MERGE_TIMESTAMP_ESTIMATED, new Date()) % 24,
  minutes:
    DateFns.differenceInMinutes(MERGE_TIMESTAMP_ESTIMATED, new Date()) % 60,
  seconds:
    DateFns.differenceInSeconds(MERGE_TIMESTAMP_ESTIMATED, new Date()) % 60,
});

const MergeEstimateWidget = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>();

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return (
    <WidgetBackground>
      <div className="flex flex-col gap-y-4">
        {/* Keeps the height of this widget equal to the adjacent one. */}
        <LabelText className="flex items-center min-h-[21px]">
          merge estimate
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
          <div className="flex gap-x-4 md:gap-x-12 lg:gap-x-8 mx-auto ">
            <div className="flex flex-col items-center gap-y-2">
              <TextRoboto className="text-2xl">
                {timeLeft?.days ?? 0}
              </TextRoboto>
              <LabelText>days</LabelText>
            </div>
            <div className="flex flex-col items-center gap-y-2">
              <TextRoboto className="text-2xl">
                {timeLeft?.hours ?? 0}
              </TextRoboto>
              <LabelText>hours</LabelText>
            </div>
            <div className="flex flex-col items-center gap-y-2">
              <TextRoboto className="text-2xl">
                {timeLeft?.minutes ?? 0}
              </TextRoboto>
              <LabelText className="truncate">minutes</LabelText>
            </div>
            <div className="flex flex-col items-center gap-y-2">
              <TextRoboto className="text-2xl">
                {timeLeft?.seconds ?? 0}
              </TextRoboto>
              <LabelText className="truncate">seconds</LabelText>
            </div>
          </div>
        )}
        <StatusText className="">
          on{" "}
          <span className="text-white">
            {DateFns.format(MERGE_TIMESTAMP_ESTIMATED, "MMMM d")}
          </span>
        </StatusText>
      </div>
    </WidgetBackground>
  );
};

export default MergeEstimateWidget;
