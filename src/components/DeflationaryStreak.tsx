import * as DateFns from "date-fns";
import type { FC } from "react";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import Skeleton from "react-loading-skeleton";
import {
  decodeGroupedAnalysis1,
  useGroupedAnalysis1,
} from "../api/grouped-analysis-1";
import { AmountUnitSpace } from "./Spacing";
import { BaseText } from "./Texts";
import { WidgetBackground, WidgetTitle } from "./WidgetSubcomponents";
import batSvg from "../assets/bat-own.svg";
import speakerSvg from "../assets/speaker-own.svg";
import barrierSvg from "../assets/barrier-own.svg";
import type { StaticImageData } from "next/image";
import Image from "next/image";

const UltraSoundBarrier = () => (
  <div className="inline-flex gap-x-1">
    <div className="h-4 w-4">
      <Image alt="bat emoji" src={batSvg as StaticImageData} />
    </div>
    <div className="h-4 w-4">
      <Image alt="speaker emoji" src={speakerSvg as StaticImageData} />
    </div>
    <div className="h-4 w-4">
      <Image alt="barrier emoji" src={barrierSvg as StaticImageData} />
    </div>
  </div>
);

const DeflationaryStreak: FC = () => {
  const [timeElapsed, setTimeElapsed] = useState<string>();
  const groupedAnalysis1F = useGroupedAnalysis1();
  const groupedAnalysis1 = decodeGroupedAnalysis1(groupedAnalysis1F);

  const deflationaryStreak = groupedAnalysis1?.deflationaryStreak.postMerge;
  const latestBlocks = groupedAnalysis1?.latestBlockFees;

  useEffect(() => {
    if (deflationaryStreak == undefined || latestBlocks === undefined) {
      return;
    }

    const lastBlock = latestBlocks[0];

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
        <div className="flex items-center gap-x-2">
          <WidgetTitle className="mt-1">streak above</WidgetTitle>
          <UltraSoundBarrier />
        </div>
        <div
          className={`
            flex items-center
            text-2xl md:text-4xl lg:text-3xl xl:text-4xl
          `}
        >
          {deflationaryStreak != undefined ? (
            <>
              <BaseText font="font-roboto">
                <CountUp
                  decimals={0}
                  duration={0.8}
                  end={deflationaryStreak.count}
                  preserveValue
                  separator=","
                  suffix={deflationaryStreak.count === 1 ? " block" : " blocks"}
                />
                <AmountUnitSpace />
              </BaseText>
            </>
          ) : (
            <BaseText font="font-roboto">0 blocks</BaseText>
          )}
        </div>
        <span className="font-inter text-xs font-extralight text-blue-spindle md:text-sm">
          {deflationaryStreak == null ? (
            "awaiting ultra sound block"
          ) : (
            <>
              spanning
              <span className="ml-1 text-white">
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
