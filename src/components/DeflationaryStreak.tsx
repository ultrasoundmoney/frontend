import * as DateFns from "date-fns";
import type { FC} from "react";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import Skeleton from "react-loading-skeleton";
import type {
  DeflationaryStreakMode} from "../api/grouped-analysis-1";
import {
  useGroupedAnalysis1,
} from "../api/grouped-analysis-1";
import { NEA } from "../fp";
import { AmountUnitSpace } from "./Spacing";
import SpanMoji from "./SpanMoji";
import { TextRoboto } from "./Texts";
import { WidgetBackground, WidgetTitle } from "./WidgetSubcomponents";

const getStreakKey = (simulateMerge: boolean): DeflationaryStreakMode =>
  simulateMerge ? "postMerge" : "preMerge";

const DeflationaryStreak: FC<{ simulateMerge: boolean }> = ({
  simulateMerge,
}) => {
  const [timeElapsed, setTimeElapsed] = useState<string>();
  const streakKey = getStreakKey(simulateMerge);
  const deflationaryStreak =
    useGroupedAnalysis1()?.deflationaryStreak[streakKey];
  const latestBlocks = useGroupedAnalysis1()?.latestBlockFees;

  useEffect(() => {
    if (deflationaryStreak == undefined || latestBlocks === undefined) {
      return;
    }

    const lastBlock = NEA.head(latestBlocks);

    setTimeElapsed(
      DateFns.formatDistanceStrict(
        DateFns.parseISO(lastBlock.minedAt),
        DateFns.parseISO(deflationaryStreak.startedOn),
      ),
    );
  }, [deflationaryStreak, latestBlocks]);

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
              <SpanMoji
                className="flex items-center gap-x-1 ml-4"
                imageClassName="h-8"
                emoji="🦇🔊"
              />
            </>
          ) : (
            <>
              <TextRoboto>0 blocks</TextRoboto>
            </>
          )}
        </div>
        <span className="font-inter text-blue-spindle text-xs md:text-sm font-extralight">
          {deflationaryStreak == null ? (
            "awaiting deflationary block"
          ) : (
            <>
              spanning
              <span className="text-white ml-1">
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
