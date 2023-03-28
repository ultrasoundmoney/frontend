import type { StaticImageData } from "next/image";
import Image from "next/image";
import type { FC } from "react";
import { useMemo } from "react";
import CountUp from "react-countup";
import dropSvg from "../../../assets/droplet-own.svg";
import fireSvg from "../../../assets/fire-own.svg";
import LabelText from "../../../components/TextsNext/LabelText";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import SkeletonText from "../../../components/TextsNext/SkeletonText";
import WidgetErrorBoundary from "../../../components/WidgetErrorBoundary";
import { WidgetBackground } from "../../../components/WidgetSubcomponents";
import type { Unit } from "../../../denomination";
import { formatTwoDecimalsSigned } from "../../../format";
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
): O.Option<number> =>
  pipe(
    supplyChanges,
    O.map((supplyChanges) =>
      pipe(
        supplyChanges[timeFrame],
        (supplyChange) =>
          simulateProofOfWork ? supplyChange.delta.pow : supplyChange.delta.pos,
        (delta) => delta.eth,
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
            burnSums[timeFrame].sum.eth,
            timeFrame,
          ),
        ),
      ),
    [averageEthPrice, burnSums, supplySeriesCollections, timeFrame],
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
          <div className="flex flex-col gap-x-4 gap-y-4 justify-between sm:flex-row md:flex-col xl:flex-row">
            <QuantifyText
              color={`
                text-transparent bg-gradient-to-r bg-clip-text
                ${gradientFromDelta(delta)}
              `}
              size="text-2xl sm:text-3xl"
              lineHeight="leading-8"
              unitPostfix="ETH"
              unitPostfixColor="text-slateus-200"
              unitPostfixMargin="ml-1 sm:ml-2"
            >
              {pipe(
                delta,
                O.match(
                  () => <SkeletonText width="7rem" />,
                  (delta) => (
                    <CountUp
                      decimals={2}
                      duration={0.8}
                      end={delta}
                      formattingFn={formatTwoDecimalsSigned}
                      preserveValue
                      separator=","
                    />
                  ),
                ),
              )}
            </QuantifyText>
            <div className="flex flex-col items-start md:items-end lg:items-start xl:items-end w-fit">
              <div className="flex gap-x-2">
                {/* Image component complains that its height doesn't match its width when it's not wrapped in a div */}
                <div>
                  <Image
                    alt="drop icon signifying issued ETH"
                    height={15}
                    priority
                    src={dropSvg as StaticImageData}
                    width={15}
                  />
                </div>
                <QuantifyText
                  size="text-xs"
                  unitPostfix={"ETH"}
                  unitPostfixColor="text-slateus-200"
                >
                  {pipe(
                    supplyChanges,
                    O.match(
                      () => <SkeletonText width="4rem" />,
                      (supplyChanges) => (
                        <CountUp
                          decimals={2}
                          duration={0.8}
                          end={
                            supplyChanges[timeFrame].issued[
                              simulateProofOfWork ? "pow" : "pos"
                            ].eth
                          }
                          preserveValue
                          separator=","
                        />
                      ),
                    ),
                  )}
                </QuantifyText>
              </div>
              <div className="flex gap-x-2 justify-between w-full">
                {/* Image component complains that its height doesn't match its width when it's not wrapped in a div */}
                <div>
                  <Image
                    alt="fire icon signifying burned ETH"
                    height={15}
                    priority
                    src={fireSvg as StaticImageData}
                    width={15}
                  />
                </div>
                <QuantifyText
                  size="text-xs"
                  unitPostfix="ETH"
                  unitPostfixColor="text-slateus-200"
                >
                  {pipe(
                    supplyChanges,
                    O.match(
                      () => <SkeletonText width="4rem" />,
                      (supplyChanges) => (
                        <CountUp
                          decimals={2}
                          duration={0.8}
                          end={supplyChanges[timeFrame].burned.eth}
                          preserveValue
                          separator=","
                        />
                      ),
                    ),
                  )}
                </QuantifyText>
              </div>
            </div>
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
