import * as DateFns from "date-fns";
import { FC, useEffect, useState } from "react";
import CountUp from "react-countup";
import Skeleton from "react-loading-skeleton";
import {
  DeflationaryStreakMode,
  useGroupedStats1,
} from "../api/grouped-stats-1";
import { AmountUnitSpace } from "./Spacing";
import SpanMoji from "./SpanMoji";
import { TextRoboto } from "./Texts";
import { WidgetBackground, WidgetTitle } from "./widget-subcomponents";

const getStreakKey = (simulateMerge: boolean): DeflationaryStreakMode =>
  simulateMerge ? "postMerge" : "preMerge";

const DeflationaryStreak: FC<{ simulateMerge: boolean }> = ({
  simulateMerge,
}) => {
  const [timeElapsed, setTimeElapsed] = useState<string>();
  const streakKey = getStreakKey(simulateMerge);
  const deflationaryStreak = useGroupedStats1()?.deflationaryStreak[streakKey];

  useEffect(() => {
    if (deflationaryStreak == undefined) {
      return;
    }

    setTimeElapsed(
      DateFns.formatDistanceToNowStrict(
        DateFns.parseISO(deflationaryStreak.from),
      ),
    );

    const intervalId = window.setInterval(() => {
      setTimeElapsed(
        DateFns.formatDistanceToNowStrict(
          DateFns.parseISO(deflationaryStreak.from),
        ),
      );
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [deflationaryStreak]);

  return (
    <WidgetBackground>
      <div className="flex flex-col gap-y-2">
        <WidgetTitle>deflationary streak</WidgetTitle>
        <div
          className={`
            flex items-center
            text-2xl md:text-4xl lg:text-3xl xl:text-4xl
          `}
        >
          {deflationaryStreak != undefined ? (
            <>
              <TextRoboto>
                <CountUp
                  decimals={0}
                  duration={0.8}
                  end={deflationaryStreak.count}
                  preserveValue={true}
                  separator=","
                  suffix={deflationaryStreak.count === 1 ? " block" : " blocks"}
                />
                <AmountUnitSpace />
              </TextRoboto>
              <SpanMoji className="ml-4 md:ml-8" emoji="🦇🔊" />
            </>
          ) : (
            <TextRoboto>0 blocks</TextRoboto>
          )}
        </div>
        <span className="font-inter text-blue-spindle text-xs md:text-sm font-extralight">
          {deflationaryStreak == null ? (
            "awaiting deflationary block"
          ) : (
            <>
              spanning
              <span className="font-roboto text-white font-light ml-1 [word-spacing:-4px]">
                {timeElapsed || <Skeleton inline={true} width="2rem" />}
              </span>
            </>
          )}
        </span>
      </div>
    </WidgetBackground>
  );
};

export default DeflationaryStreak;
