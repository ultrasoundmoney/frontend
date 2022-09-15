import * as DateFns from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import JSBI from "jsbi";
import type { FC } from "react";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import type { EthSupply } from "../../api/eth-supply";
import type { MergeEstimate } from "../../api/merge-estimate";
import type { MergeStatus } from "../../api/merge-status";
import { getDateTimeFromSlot } from "../../beacon-time";
import { TOTAL_TERMINAL_DIFFICULTY } from "../../eth-constants";
import { TextRoboto } from "../Texts";
import LabelText from "../TextsNext/LabelText";
import SkeletonText from "../TextsNext/SkeletonText";
import UpdatedAgo from "../UpdatedAgo";
import WidgetErrorBoundary from "../WidgetErrorBoundary";
import { WidgetBackground } from "../WidgetSubcomponents";

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

const Countdown: FC<{ mergeEstimate: MergeEstimate }> = ({ mergeEstimate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>();

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

  return (
    <div className="flex gap-x-4">
      <div className="flex flex-col items-center gap-y-2 w-[40px]">
        <CountdownNumber>{timeLeft?.days}</CountdownNumber>
        <LabelText className="text-slateus-400">
          {timeLeft?.days === 1 ? "day" : "days"}
        </LabelText>
      </div>
      <div className="flex flex-col items-center gap-y-2 w-[40px]">
        <CountdownNumber>{timeLeft?.hours}</CountdownNumber>

        <LabelText className="text-slateus-400">
          {timeLeft?.hours === 1 ? "hour" : "hours"}
        </LabelText>
      </div>
      <div className="flex flex-col items-center gap-y-2 w-[40px]">
        <CountdownNumber>{timeLeft?.minutes}</CountdownNumber>
        <LabelText className="text-slateus-400">
          {timeLeft?.minutes === 1 ? "min" : "mins"}
        </LabelText>
      </div>
      <div className="flex flex-col items-center gap-y-2 w-[40px]">
        <CountdownNumber>{timeLeft?.seconds}</CountdownNumber>
        <LabelText className="text-slateus-400">
          {timeLeft?.seconds === 1 ? "sec" : "secs"}
        </LabelText>
      </div>
    </div>
  );
};

type Props = {
  ethSupply: EthSupply;
  mergeEstimate: MergeEstimate;
  mergeStatus: MergeStatus;
};

const SupplyChangeSinceMerge: FC<Props> = ({
  ethSupply,
  mergeEstimate,
  mergeStatus,
}) => {
  const [showNerdTooltip, setShowNerdTooltip] = useState(false);
  const [mergeEstimateFormatted, setMergeEstimateFormatted] =
    useState<string>();

  useEffect(() => {
    setMergeEstimateFormatted(
      formatInTimeZone(
        mergeEstimate.estimatedDateTime,
        "UTC",
        "~MMM d, h:mmaa",
      ),
    );
  }, [mergeEstimate.estimatedDateTime]);

  // If we don't have data, show a zero.
  // If we have data and we're not dealing with the two column layout on a
  // smaller screen (lg && !xl), show the full number.
  // If we are dealing with the two column layout and are on a small screen,
  // shorten the number by truncating thousands.
  const precisionBarrier = 100000;
  const blocksToTTD =
    mergeEstimate.blocksLeft > precisionBarrier
      ? mergeEstimate.blocksLeft / 1e3
      : mergeEstimate.blocksLeft;
  const blocksToTTDSuffix = mergeEstimate.blocksLeft > precisionBarrier;

  const ethSupplySum = JSBI.subtract(
    JSBI.add(
      ethSupply.executionBalancesSum.balancesSum,
      ethSupply.beaconBalancesSum.balancesSum,
    ),
    ethSupply.beaconDepositsSum.depositsSum,
  );
  const supplyDelta = JSBI.toNumber(ethSupplySum) / 1e18 - mergeStatus.supply;

  return (
    <WidgetErrorBoundary title="merge estimate">
      <WidgetBackground>
        <div className={`relative flex flex-col gap-x-2 "gap-y-4"`}>
          <div className="flex flex-col gap-y-4">
            <LabelText>supply change since merge</LabelText>
          </div>
          <div className="flex">
            <TextRoboto
              className={`
                text-3xl text-transparent
                bg-clip-text bg-gradient-to-r
                ${
                  supplyDelta !== undefined && supplyDelta >= 0
                    ? "from-cyan-300 to-indigo-500"
                    : "from-orange-500 to-yellow-300"
                }
              `}
            >
              {supplyDelta !== undefined && supplyDelta >= 0 && "+"}
              <CountUp
                preserveValue
                end={supplyDelta ?? 0}
                separator=","
                decimals={2}
              />
            </TextRoboto>
            <span className="font-roboto font-light text-3xl text-slateus-400 ml-2">
              ETH
            </span>
          </div>
          <UpdatedAgo
            updatedAt={getDateTimeFromSlot(
              ethSupply.beaconBalancesSum.slot,
            ).toISOString()}
          />
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

export default SupplyChangeSinceMerge;
