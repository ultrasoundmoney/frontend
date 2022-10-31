import type { FC } from "react";
import CountUp from "react-countup";
import { posIssuancePerDay, powIssuancePerDay } from "../../static-ether-data";
import SimulateProofOfWork from "../SimulateProofOfWork";
import { BaseText } from "../Texts";
import LabelText from "../TextsNext/LabelText";
import SkeletonText from "../TextsNext/SkeletonText";
import UpdatedAgo from "../UpdatedAgo";
import WidgetErrorBoundary from "../WidgetErrorBoundary";
import { WidgetBackground } from "../WidgetSubcomponents";
import SinceMergeIndicator from "../SinceMergeIndicator";
import type { TimeFrameWithMerge } from "../Dashboard/SupplySection";
import { useSupplyOverTime } from "../../api/supply-over-time";
import { differenceInSeconds } from "date-fns";

type Props = {
  onClickTimeFrame: () => void;
  onSimulateProofOfWork: () => void;
  simulateProofOfWork: boolean;
  timeFrame: TimeFrameWithMerge;
};

const POW_ISSUANCE_PER_DAY = powIssuancePerDay - posIssuancePerDay;
const SLOTS_PER_DAY = 24 * 60 * 5;

const SupplyChange: FC<Props> = ({
  timeFrame,
  simulateProofOfWork,
  onClickTimeFrame,
  onSimulateProofOfWork,
}) => {
  const supplyOverTime = useSupplyOverTime();
  const supplyOverTimeTimeFrame = supplyOverTime?.[timeFrame];

  const firstPoint = supplyOverTimeTimeFrame?.[0];
  const lastPoint =
    supplyOverTimeTimeFrame?.[supplyOverTimeTimeFrame.length - 1];

  const slotsSinceStart =
    lastPoint === undefined || firstPoint === undefined
      ? undefined
      : differenceInSeconds(
          new Date(lastPoint.timestamp),
          new Date(firstPoint.timestamp),
        ) / 12;

  const simulatedPowIssuanceSinceMerge =
    slotsSinceStart === undefined
      ? undefined
      : (slotsSinceStart * POW_ISSUANCE_PER_DAY) / SLOTS_PER_DAY;

  const supplyDelta =
    lastPoint === undefined ||
    firstPoint === undefined ||
    simulatedPowIssuanceSinceMerge === undefined
      ? undefined
      : simulateProofOfWork
      ? lastPoint.supply - firstPoint.supply + simulatedPowIssuanceSinceMerge
      : lastPoint.supply - firstPoint.supply;

  return (
    <WidgetErrorBoundary title="supply change">
      <WidgetBackground>
        <div className="relative flex flex-col gap-x-2 gap-y-4">
          <div className="flex justify-between">
            <LabelText>supply change</LabelText>
            <SinceMergeIndicator
              onClick={onClickTimeFrame}
              timeFrame={timeFrame}
            />
          </div>
          <div className="flex">
            <BaseText
              font="font-roboto"
              className={`
                bg-gradient-to-r bg-clip-text
                text-3xl text-transparent
                ${
                  supplyDelta !== undefined && supplyDelta >= 0
                    ? "from-cyan-300 to-indigo-500"
                    : "from-orange-400 to-yellow-300"
                }
              `}
            >
              <SkeletonText width="7rem">
                {supplyDelta === undefined ? undefined : (
                  <>
                    {supplyDelta >= 0 && "+"}
                    <CountUp
                      preserveValue
                      end={supplyDelta ?? 0}
                      separator=","
                      decimals={2}
                      duration={0.8}
                    />
                  </>
                )}
              </SkeletonText>
            </BaseText>
            <span className="ml-2 font-roboto text-3xl font-light text-slateus-400">
              ETH
            </span>
          </div>
          <div className="flex flex-wrap justify-between gap-x-4 gap-y-4">
            <UpdatedAgo updatedAt={supplyOverTime?.timestamp} />
            <SimulateProofOfWork
              checked={simulateProofOfWork}
              onToggle={onSimulateProofOfWork}
            />
          </div>
        </div>
      </WidgetBackground>
    </WidgetErrorBoundary>
  );
};

export default SupplyChange;
