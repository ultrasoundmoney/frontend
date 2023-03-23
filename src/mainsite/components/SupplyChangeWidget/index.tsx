import type { FC } from "react";
import { useMemo } from "react";
import CountUp from "react-countup";
import LabelText from "../../../components/TextsNext/LabelText";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import SkeletonText from "../../../components/TextsNext/SkeletonText";
import WidgetErrorBoundary from "../../../components/WidgetErrorBoundary";
import { WidgetBackground } from "../../../components/WidgetSubcomponents";
import type { Unit } from "../../../denomination";
import { formatTwoDigitsSigned, formatZeroDigitsSigned } from "../../../format";
import { O, pipe } from "../../../fp";
import type { DateTimeString } from "../../../time";
import { useAverageEthPrice } from "../../api/average-eth-price";
import { useBurnSums } from "../../api/burn-sums";
import type { SupplyChangesPerTimeFrame } from "../../api/supply-changes";
import { supplyChangesFromCollections } from "../../api/supply-changes";
import { useSupplySeriesCollections } from "../../api/supply-over-time";
import type { TimeFrame } from "../../time-frames";
import SimulateProofOfWork from "../SimulateProofOfWork";
import TimeFrameIndicator from "../TimeFrameIndicator";
import UpdatedAgo from "../UpdatedAgo";

const deltaFromChanges = (
  supplyChanges: O.Option<SupplyChangesPerTimeFrame>,
  timeFrame: TimeFrame,
  simulateProofOfWork: boolean,
  unit: Unit,
): O.Option<number> =>
  pipe(
    supplyChanges,
    O.map((supplyChanges) =>
      pipe(
        supplyChanges[timeFrame],
        (supplyChange) =>
          simulateProofOfWork ? supplyChange.delta.pow : supplyChange.delta.pos,
        (delta) =>
          unit === "eth"
            ? delta.eth
            : unit === "usd"
            ? delta.usd
            : (undefined as never),
      ),
    ),
  );

const gradientFromDelta = (delta: O.Option<number>): string =>
  pipe(
    delta,
    O.map((delta) => delta >= 0),
    O.getOrElse(() => false),
    (isPositiveSupplyDelta) =>
      isPositiveSupplyDelta
        ? "from-cyan-300 to-indigo-500"
        : "from-orange-400 to-yellow-300",
  );

const timestampFromChanges = (
  supplyChangesPerTimeFrame: O.Option<SupplyChangesPerTimeFrame>,
  timeFrame: TimeFrame,
): DateTimeString | undefined =>
  pipe(
    supplyChangesPerTimeFrame,
    O.map((supplyChanges) => supplyChanges[timeFrame]),
    O.map((supplyChanges) => supplyChanges.timestamp),
    O.toUndefined,
  );

type Props = {
  onClickTimeFrame: () => void;
  onSimulateProofOfWork: () => void;
  simulateProofOfWork: boolean;
  timeFrame: TimeFrame;
  unit: Unit;
};

const SupplyChange: FC<Props> = ({
  onClickTimeFrame,
  onSimulateProofOfWork,
  simulateProofOfWork,
  timeFrame,
  unit,
}) => {
  const burnSums = useBurnSums();
  const supplySeriesCollections = useSupplySeriesCollections();
  const averageEthPrice = useAverageEthPrice();
  const supplyChanges = useMemo(
    () =>
      pipe(
        supplySeriesCollections,
        O.map((collection) =>
          supplyChangesFromCollections(
            collection,
            averageEthPrice[timeFrame],
            burnSums[timeFrame].sum[unit],
            timeFrame,
          ),
        ),
      ),
    [averageEthPrice, burnSums, supplySeriesCollections, timeFrame, unit],
  );
  const delta = deltaFromChanges(
    supplyChanges,
    timeFrame,
    simulateProofOfWork,
    unit,
  );

  return (
    <WidgetErrorBoundary title="supply change">
      <WidgetBackground>
        <div className="flex relative flex-col gap-x-2 gap-y-4">
          <div className="flex justify-between">
            <LabelText>supply change</LabelText>
            <TimeFrameIndicator
              onClickTimeFrame={onClickTimeFrame}
              timeFrame={timeFrame}
            />
          </div>
          <div className="flex">
            <QuantifyText
              color={`
                text-transparent bg-gradient-to-r bg-clip-text
                ${gradientFromDelta(delta)}
              `}
              size="text-2xl md:text-3xl"
              unitPostfix={unit === "eth" ? "ETH" : "USD"}
              unitPostfixColor="text-slateus-200"
              unitPostfixMargin="ml-1 md:ml-2"
            >
              <SkeletonText width="7rem">
                {pipe(
                  delta,
                  O.match(
                    () => undefined,
                    (delta) => (
                      <CountUp
                        preserveValue
                        end={delta}
                        separator=","
                        decimals={2}
                        duration={0.8}
                        formattingFn={
                          unit === "eth"
                            ? formatTwoDigitsSigned
                            : unit === "usd"
                            ? formatZeroDigitsSigned
                            : (undefined as never)
                        }
                      />
                    ),
                  ),
                )}
              </SkeletonText>
            </QuantifyText>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-4 justify-between">
            <UpdatedAgo
              updatedAt={timestampFromChanges(supplyChanges, timeFrame)}
            />
            <SimulateProofOfWork
              checked={simulateProofOfWork}
              onToggle={onSimulateProofOfWork}
              tooltipText="Simulate the supply change with proof-of-work issuance."
            />
          </div>
        </div>
      </WidgetBackground>
    </WidgetErrorBoundary>
  );
};

export default SupplyChange;
