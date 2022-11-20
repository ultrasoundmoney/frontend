import flow from "lodash/flow";
import type { FC } from "react";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import type { BurnRecord } from "../api/burn-records";
import {
  decodeGroupedAnalysis1,
  useGroupedAnalysis1,
} from "../api/grouped-analysis-1";
import * as Format from "../format";
import scrollbarStyles from "../styles/Scrollbar.module.scss";
import type { TimeFrameNext } from "../time-frames";
import { timeFrameFromNext } from "../time-frames";
import { MoneyAmountAnimated } from "./Amount";
import SpanMoji from "./SpanMoji";
import { BaseText } from "./Texts";
import SkeletonText from "./TextsNext/SkeletonText";
import { BurnGroupBase } from "./WidgetSubcomponents";

const formatBlockNumber = (u: unknown): string | undefined =>
  typeof u !== "number"
    ? undefined
    : flow(Format.formatZeroDecimals, (str) => `#${str}`)(u);

const getBlockPageLink = (u: unknown): string | undefined =>
  typeof u === undefined ? undefined : `https://etherscan.io/block/${u}`;

const emojiMap = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

const Age: FC<{ minedAt: Date | undefined }> = ({ minedAt }) => {
  const [age, setAge] = useState<string>();

  useEffect(() => {
    if (minedAt === undefined) {
      return;
    }

    const now = new Date();
    const intervalId = window.setInterval(() => {
      setAge(Format.formatDistance(now, minedAt) ?? "??");
    }, 500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [minedAt]);

  return (
    <BaseText font="font-inter" size="text-base md:text-lg">
      <SkeletonText width="6rem">
        {age === undefined ? undefined : (
          <>
            <BaseText font="font-roboto">{age}</BaseText>
            {" ago"}
          </>
        )}
      </SkeletonText>
    </BaseText>
  );
};

type Props = {
  onClickTimeFrame: () => void;
  timeFrame: TimeFrameNext;
};

const BurnRecords: FC<Props> = ({ onClickTimeFrame, timeFrame }) => {
  const groupedAnalysis1F = useGroupedAnalysis1();
  const groupedAnalysis1 = decodeGroupedAnalysis1(groupedAnalysis1F);
  const burnRecords = groupedAnalysis1?.burnRecords;
  const timeFrameRecords =
    burnRecords === undefined
      ? (new Array(10).fill({}) as Partial<BurnRecord>[])
      : burnRecords[timeFrameFromNext(timeFrame)];

  return (
    <BurnGroupBase
      onClickTimeFrame={onClickTimeFrame}
      timeFrame={timeFrame}
      title="burn records"
    >
      <div
        className={`
          mt-4 -mr-3 flex
          h-60 flex-col
          gap-y-6
          overflow-y-auto md:h-64
          ${scrollbarStyles["styled-scrollbar-vertical"]}
          ${scrollbarStyles["styled-scrollbar"]}
        `}
      >
        {timeFrameRecords.map((record, index) => (
          <div
            className="flex flex-col gap-y-1 pr-2"
            key={record.blockNumber || index}
          >
            <div className="flex w-full justify-between">
              <MoneyAmountAnimated
                size="text-2xl md:text-3xl"
                skeletonWidth="4rem"
                unit="eth"
                unitText="ETH"
              >
                {record.baseFeeSum}
              </MoneyAmountAnimated>
              <SpanMoji
                className="select-none text-2xl md:text-3xl"
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                emoji={emojiMap[index]!}
              />
            </div>
            <div className="flex justify-between">
              <a
                href={getBlockPageLink(record.blockNumber)}
                target="_blank"
                rel="noreferrer"
              >
                <span className="link-animation font-roboto font-light text-slateus-400 hover:opacity-60 md:text-lg">
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
    </BurnGroupBase>
  );
};

export default BurnRecords;
