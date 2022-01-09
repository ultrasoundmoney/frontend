import * as DateFns from "date-fns";
import { FC } from "react";
import { useBurnRecords } from "../api";
import * as Format from "../format";
import { timeFrameFromNext, TimeFrameNext } from "../time_frames";
import { AmountUnitSpace } from "./Spacing";
import SpanMoji from "./SpanMoji";
import { WidgetBackground, WidgetTitle } from "./WidgetBits";

type Props = {
  onClickTimeFrame: () => void;
  timeFrame: TimeFrameNext;
};

const BurnRecordAmount: FC<{ children: number }> = ({ children }) => (
  <div className="font-roboto  text-2xl md:text-3xl">
    <span className={"text-white"}>
      {Format.formatTwoDigit(Format.ethFromWei(children))}
    </span>
    <AmountUnitSpace />
    <span className="text-blue-spindle font-extralight">ETH</span>
  </div>
);

const BurnRecords: FC<Props> = ({ onClickTimeFrame, timeFrame }) => {
  const burnRecords = useBurnRecords();

  const timeFrameRecords =
    burnRecords === undefined ? undefined : burnRecords.records[timeFrame];

  return (
    <WidgetBackground>
      <WidgetTitle
        onClickTimeFrame={onClickTimeFrame}
        timeFrame={timeFrameFromNext[timeFrame]}
        title="burn records"
      />

      {timeFrameRecords === undefined ? (
        <div>loading...</div>
      ) : (
        <div className="flex flex-col gap-y-6 h-64 mt-3 -mr-4 overflow-y-auto leaderboard-scroller">
          {timeFrameRecords.map((record, index) => (
            <div
              className="flex flex-col gap-y-2 pr-2"
              key={record.blockNumber}
            >
              <div className="flex justify-between w-full">
                <BurnRecordAmount>{record.baseFeeSum}</BurnRecordAmount>
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
                  href={`https://etherscan.io/block/${record.blockNumber}`}
                  target="_blank"
                  rel="noopener"
                >
                  <span className="font-roboto text-blue-shipcove md:text-lg hover:opacity-60 link-animation">
                    #{Format.formatNoDigit(record.blockNumber)}
                  </span>
                </a>
                <span className="font-inter font-light text-white md:text-lg">
                  {DateFns.formatDistanceToNow(record.minedAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </WidgetBackground>
  );
};

export default BurnRecords;
