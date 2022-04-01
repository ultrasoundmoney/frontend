import * as DateFns from "date-fns";
import { FC, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { BurnRecord } from "../api/burn-records";
import { useGroupedStats1 } from "../api/grouped-stats-1";
import * as Format from "../format";
import { flow, O, OAlt } from "../fp";
import scrollbarStyles from "../styles/Scrollbar.module.scss";
import { TimeFrameNext } from "../time-frames";
import { useActiveBreakpoint } from "../utils/use-active-breakpoint";
import { MoneyAmountAnimated } from "./Amount";
import SpanMoji from "./SpanMoji";
import { TextInter } from "./Texts";
import { Group1Base } from "./widget-subcomponents";

const formatBlockNumber = flow(
  O.fromPredicate((unknown): unknown is number => typeof unknown === "number"),
  O.map(Format.formatNoDigit),
  O.map((str) => `#${str}`),
  O.toUndefined,
);

const getBlockPageLink = flow(
  OAlt.numberFromUnknown,
  O.map((num) => `https://etherscan.io/block/${num}`),
  O.toUndefined,
);

const emojiMap = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

const formatDistance = flow(
  (dt: Date | undefined) => dt,
  O.fromNullable,
  O.map(DateFns.formatDistanceToNowStrict),
  O.toUndefined,
);

const Age: FC<{ minedAt: Date | undefined }> = ({ minedAt }) => {
  const [age, setAge] = useState(formatDistance(minedAt));

  useEffect(() => {
    if (minedAt === undefined) {
      return;
    }

    setAge(DateFns.formatDistanceToNowStrict(minedAt));

    const intervalId = window.setInterval(() => {
      setAge(DateFns.formatDistanceToNowStrict(minedAt));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [minedAt]);

  return (
    <TextInter className="md:text-lg" skeletonWidth="6rem">
      {age === undefined ? undefined : `${age} ago`}
    </TextInter>
  );
};

type Props = {
  onClickTimeFrame: () => void;
  timeFrame: TimeFrameNext;
};

const BurnRecords: FC<Props> = ({ onClickTimeFrame, timeFrame }) => {
  const burnRecords = useGroupedStats1()?.burnRecords;
  const { lg } = useActiveBreakpoint();

  const timeFrameRecords =
    burnRecords === undefined
      ? (new Array(10).fill({}) as Partial<BurnRecord>[])
      : burnRecords[timeFrame];

  return (
    <Group1Base
      onClickTimeFrame={onClickTimeFrame}
      timeFrame={timeFrame}
      title="burn records"
    >
      <div
        className={`
          flex flex-col gap-y-6
          mt-4 -mr-3
          overflow-y-auto
          ${scrollbarStyles["styled-scrollbar"]}
        `}
        // Custom height to fit three records on desktop and mobile.
        style={{ height: lg ? "16rem" : "15rem" }}
      >
        {timeFrameRecords.map((record, index) => (
          <div
            className="flex flex-col gap-y-1 pr-2"
            key={record.blockNumber || index}
          >
            <div className="flex justify-between w-full">
              <MoneyAmountAnimated
                skeletonWidth="4rem"
                textClassName="text-2xl md:text-3xl"
                unit="eth"
                unitText="ETH"
              >
                {record.baseFeeSum}
              </MoneyAmountAnimated>
              <SpanMoji
                className="text-2xl md:text-3xl select-none"
                emoji={emojiMap[index]}
              />
            </div>
            <div className="flex justify-between">
              <a
                href={getBlockPageLink(record.blockNumber)}
                target="_blank"
                rel="noreferrer"
              >
                <span className="font-roboto font-light text-blue-shipcove md:text-lg hover:opacity-60 link-animation">
                  {formatBlockNumber(record.blockNumber) || (
                    <Skeleton width="8rem" />
                  )}
                </span>
              </a>
              <Age minedAt={record.minedAt} />
            </div>
          </div>
        ))}
      </div>
    </Group1Base>
  );
};

export default BurnRecords;
