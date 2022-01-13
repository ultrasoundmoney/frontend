import * as DateFns from "date-fns";
import { FC, useEffect, useState } from "react";
import CountUp from "react-countup";
import Skeleton from "react-loading-skeleton";
import { BurnRecord, useFeeData } from "../api";
import * as Format from "../format";
import { flow, O, OAlt } from "../fp";
import { TimeFrameNext } from "../time_frames";
import { useActiveBreakpoint } from "../utils/use-active-breakpoint";
import { Unit } from "./ComingSoon/CurrencyControl";
import { AmountUnitSpace } from "./Spacing";
import SpanMoji from "./SpanMoji";
import { WidgetBackground, WidgetTitle } from "./WidgetBits";

const formatBlockNumber = flow(
  O.fromPredicate((unknown): unknown is number => typeof unknown === "number"),
  O.map(Format.formatNoDigit),
  O.map((str) => `#${str}`),
  O.toUndefined
);

const getBlockPageLink = flow(
  OAlt.numberFromUnknown,
  O.map((num) => `https://etherscan.io/block/${num}`),
  O.toUndefined
);

const BurnRecordAmount: FC<{ amount: number | undefined; unit: Unit }> = ({
  amount,
  unit,
}) => (
  <div className="font-roboto  text-2xl md:text-3xl">
    <span className={"text-white"}>
      {amount === undefined ? (
        <Skeleton inline={true} width="4rem" />
      ) : (
        <CountUp
          start={0}
          end={unit === "eth" ? Format.ethFromWei(amount) : amount / 1000}
          preserveValue={true}
          separator=","
          decimals={unit === "eth" ? 2 : 1}
          duration={0.8}
          suffix={unit === "eth" ? undefined : "K"}
        />
      )}
    </span>
    <AmountUnitSpace />
    <span className="text-blue-spindle font-extralight">ETH</span>
  </div>
);

const emojiMap = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

const Age: FC<{ minedAt: Date | undefined }> = ({ minedAt }) => {
  const [age, setAge] = useState<string | undefined>();

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
    <span className="font-inter font-light text-white md:text-lg">
      {age || <Skeleton inline={true} width="6rem" />}
      {" ago"}
    </span>
  );
};

type Props = {
  onClickTimeFrame: () => void;
  timeFrame: TimeFrameNext;
};

const BurnRecords: FC<Props> = ({ onClickTimeFrame, timeFrame }) => {
  const burnRecords = useFeeData()?.burnRecords;
  const { lg } = useActiveBreakpoint();

  const timeFrameRecords =
    burnRecords === undefined
      ? (new Array(10).fill({}) as Partial<BurnRecord>[])
      : burnRecords[timeFrame];

  return (
    <WidgetBackground>
      <WidgetTitle
        onClickTimeFrame={onClickTimeFrame}
        timeFrame={timeFrame}
        title="burn records"
      />
      <div
        className="flex flex-col gap-y-6 mt-3 -mr-3 overflow-y-auto leaderboard-scroller"
        // Custom height to fit three records on desktop and mobile.
        style={{ height: lg ? "16rem" : "15rem" }}
      >
        {timeFrameRecords.map((record, index) => (
          <div
            className="flex flex-col gap-y-1 pr-2"
            key={record.blockNumber || index}
          >
            <div className="flex justify-between w-full">
              <BurnRecordAmount amount={record.baseFeeSum} unit="eth" />
              <SpanMoji
                className="text-2xl md:text-3xl"
                emoji={emojiMap[index]}
              />
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
              <Age minedAt={record.minedAt} />
            </div>
          </div>
        ))}
      </div>
    </WidgetBackground>
  );
};

export default BurnRecords;
