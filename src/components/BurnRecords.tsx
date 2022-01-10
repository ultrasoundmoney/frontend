import * as DateFns from "date-fns";
import { FC } from "react";
import Skeleton from "react-loading-skeleton";
import { BurnRecord, useBurnRecords } from "../api";
import * as Format from "../format";
import { flow, O, OAlt } from "../fp";
import { timeFrameFromNext, TimeFrameNext } from "../time_frames";
import { AmountUnitSpace } from "./Spacing";
import SpanMoji from "./SpanMoji";
import { WidgetBackground, WidgetTitle } from "./WidgetBits";

type Props = {
  onClickTimeFrame: () => void;
  timeFrame: TimeFrameNext;
};

const formatBurnRecordAmount = flow(
  O.fromPredicate((unknown): unknown is number => typeof unknown === "number"),
  O.map(Format.ethFromWei),
  O.map(Format.formatTwoDigit),
  O.toUndefined
);

const formatBlockNumber = flow(
  O.fromPredicate((unknown): unknown is number => typeof unknown === "number"),
  O.map(Format.formatNoDigit),
  O.map((str) => `#${str}`),
  O.toUndefined
);

const formatAge = flow(
  O.fromPredicate((unknown): unknown is Date => unknown instanceof Date),
  O.map(DateFns.formatDistanceToNowStrict),
  O.toUndefined
);

const getBlockPageLink = flow(
  OAlt.numberFromUnknown,
  O.map((num) => `https://etherscan.io/block/${num}`),
  O.toUndefined
);

const BurnRecordAmount: FC<{ amount: number | undefined }> = ({ amount }) => (
  <div className="font-roboto  text-2xl md:text-3xl">
    <span className={"text-white"}>
      {formatBurnRecordAmount(amount) || (
        <Skeleton inline={true} width="4rem" />
      )}
    </span>
    <AmountUnitSpace />
    <span className="text-blue-spindle font-extralight">ETH</span>
  </div>
);

const BurnRecords: FC<Props> = ({ onClickTimeFrame, timeFrame }) => {
  const burnRecords = useBurnRecords();

  const timeFrameRecords =
    burnRecords === undefined
      ? (new Array(10).fill({}) as Partial<BurnRecord>[])
      : burnRecords.records[timeFrame];

  return (
    <WidgetBackground>
      <WidgetTitle
        onClickTimeFrame={onClickTimeFrame}
        timeFrame={timeFrameFromNext[timeFrame]}
        title="burn records"
      />
      <div className="flex flex-col gap-y-6 h-64 mt-3 -mr-4 overflow-y-auto leaderboard-scroller">
        {timeFrameRecords.map((record, index) => (
          <div
            className="flex flex-col gap-y-2 pr-2"
            key={record.blockNumber || index}
          >
            <div className="flex justify-between w-full">
              <BurnRecordAmount amount={record.baseFeeSum} />
              {index === 0 ? (
                <SpanMoji className="text-2xl md:text-3xl" emoji="🥇" />
              ) : index === 1 ? (
                <SpanMoji className="text-2xl md:text-3xl" emoji="🥈" />
              ) : index === 2 ? (
                <SpanMoji className="text-2xl md:text-3xl" emoji="🥉" />
              ) : (
                <div></div>
              )}
            </div>
            <div className="flex justify-between">
              <a
                href={getBlockPageLink(record.blockNumber)}
                target="_blank"
                rel="noreferrer"
              >
                <span className="font-roboto text-blue-shipcove md:text-lg hover:opacity-60 link-animation">
                  {formatBlockNumber(record.blockNumber) || (
                    <Skeleton width="8rem" />
                  )}
                </span>
              </a>
              <span className="font-inter font-light text-white md:text-lg">
                {formatAge(record.minedAt) || <Skeleton width="6rem" />} ago
              </span>
            </div>
          </div>
        ))}
      </div>
    </WidgetBackground>
  );
};

export default BurnRecords;
