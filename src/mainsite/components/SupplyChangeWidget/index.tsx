import type { FC } from "react";
import { useMemo } from "react";
import CountUp from "react-countup";
import { BaseText } from "../../../components/Texts";
import LabelText from "../../../components/TextsNext/LabelText";
import SkeletonText from "../../../components/TextsNext/SkeletonText";
import WidgetErrorBoundary from "../../../components/WidgetErrorBoundary";
import { WidgetBackground } from "../../../components/WidgetSubcomponents";
import type { EthNumber } from "../../../eth-units";
import { formatTwoDigitsSigned } from "../../../format";
import { O, pipe } from "../../../fp";
import type { DateTimeString } from "../../../time";
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
): O.Option<EthNumber> =>
  pipe(
    supplyChanges,
    O.map((supplyChanges) =>
      pipe(supplyChanges[timeFrame], (delta) =>
        simulateProofOfWork ? delta.powDelta : delta.posDelta,
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
};

const SupplyChange: FC<Props> = ({
  onClickTimeFrame,
  onSimulateProofOfWork,
  simulateProofOfWork,
  timeFrame,
}) => {
  const supplySeriesCollections = useSupplySeriesCollections();
  const supplyChanges = useMemo(
    () => pipe(supplySeriesCollections, O.map(supplyChangesFromCollections)),
    [supplySeriesCollections],
  );
  const delta = deltaFromChanges(supplyChanges, timeFrame, simulateProofOfWork);

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
            <BaseText
              font="font-roboto"
              className={`
                bg-gradient-to-r bg-clip-text
                text-3xl text-transparent
                ${gradientFromDelta(delta)}
              `}
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
                        formattingFn={formatTwoDigitsSigned}
                      />
                    ),
                  ),
                )}
              </SkeletonText>
            </BaseText>
            <span className="ml-2 text-3xl font-light font-roboto text-slateus-400">
              ETH
            </span>
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
