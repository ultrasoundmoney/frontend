import * as DateFns from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import JSBI from "jsbi";
import type { FC } from "react";
import { useContext, useEffect, useState } from "react";
import CountUp from "react-countup";
import { EthSupply, getEthSupplyImprecise } from "../../api/eth-supply";
import type { MergeEstimate } from "../../api/merge-estimate";
import { MergeStatus } from "../../api/merge-status";
import { getDateTimeFromSlot } from "../../beacon-time";
import { TOTAL_TERMINAL_DIFFICULTY } from "../../eth-constants";
import { FeatureFlagsContext } from "../../feature-flags";
import { formatTwoDigit } from "../../format";
import Nerd from "../Nerd";
import { TextRoboto } from "../Texts";
import LabelText from "../TextsNext/LabelText";
import QuantifyText from "../TextsNext/QuantifyText";
import SkeletonText from "../TextsNext/SkeletonText";
import Twemoji from "../Twemoji";
import UpdatedAgo from "../UpdatedAgo";
import WidgetErrorBoundary from "../WidgetErrorBoundary";
import { WidgetBackground } from "../WidgetSubcomponents";
import MergeEstimateTooltip from "./MergeEstimateTooltip";

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

const Celebration = () => (
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
);

const getIsMergePast = (mergeEstimate: MergeEstimate) =>
  Number(mergeEstimate.totalDifficulty) / 1e12 >= TOTAL_TERMINAL_DIFFICULTY;

const Countdown: FC<{ mergeEstimate: MergeEstimate }> = ({ mergeEstimate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>();
  const featureFlags = useContext(FeatureFlagsContext);

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

const MergeEstimateWidget: FC<Props> = ({
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
  const supplyDelta =
    mergeStatus.status === "pending"
      ? undefined
      : JSBI.toNumber(ethSupplySum) / 1e18 - mergeStatus.supply;

  return (
    <WidgetErrorBoundary title="merge estimate">
      <WidgetBackground>
        <div
          className={`relative flex flex-col gap-x-2 ${
            mergeStatus.status === "pending"
              ? "gap-y-8 justify-between md:flex-row"
              : "gap-y-4"
          }`}
        >
          <div className="flex flex-col gap-y-4">
            {mergeStatus.status === "pending" ? (
              <>
                <div className="flex items-center min-h-[21px] ">
                  <LabelText>merge:</LabelText>
                  {mergeEstimateFormatted && (
                    <LabelText className="font-normal ml-1 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-500">{`${mergeEstimateFormatted} UTC`}</LabelText>
                  )}
                </div>
                <Countdown mergeEstimate={mergeEstimate} />
              </>
            ) : (
              <LabelText>supply change since merge</LabelText>
            )}
          </div>
          {mergeStatus.status === "pending" ? (
            <div className="flex flex-col gap-y-4">
              <div
                className={`
                flex items-center
                md:justify-end
                cursor-pointer
                [&_.gray-nerd]:hover:opacity-0
                [&_.color-nerd]:active:brightness-75
              `}
                onClick={() => setShowNerdTooltip(true)}
              >
                <LabelText className="truncate">wen TTD</LabelText>
                <Nerd />
                <div
                  className={`
                  tooltip ${showNerdTooltip ? "block" : "hidden"} fixed
                  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                  w-[calc(100% + 96px)]
                  whitespace-nowrap
                  cursor-auto
                  z-30
                `}
                >
                  <MergeEstimateTooltip
                    latestBlockDifficulty={mergeEstimate?.difficulty}
                    onClickClose={() => setShowNerdTooltip(false)}
                    totalDifficulty={mergeEstimate?.totalDifficulty}
                    totalTerminalDifficulty={TOTAL_TERMINAL_DIFFICULTY}
                  />
                </div>
              </div>
              <div className="flex md:justify-end">
                <div className="flex flex-col gap-y-2 items-center">
                  <TextRoboto className="text-[1.7rem] min-h-[40.8px]">
                    <CountUp
                      separator=","
                      end={blocksToTTD}
                      suffix={blocksToTTDSuffix ? "K" : ""}
                      preserveValue
                    />
                  </TextRoboto>
                  <LabelText className="text-slateus-400">blocks</LabelText>
                </div>
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}
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

export default MergeEstimateWidget;
