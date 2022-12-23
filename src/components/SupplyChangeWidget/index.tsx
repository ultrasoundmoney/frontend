import type { FC } from "react";
import CountUp from "react-countup";
import { formatTwoDigitsSigned } from "../../format";
import { powIssuancePerDay } from "../../static-ether-data";
import type { LimitedTimeFrameWithMerge } from "../Dashboard/SupplyDashboard";
import SimulateProofOfWork from "../SimulateProofOfWork";
import SinceMergeIndicator from "../SinceMergeIndicator";
import { BaseText } from "../Texts";
import LabelText from "../TextsNext/LabelText";
import SkeletonText from "../TextsNext/SkeletonText";
import UpdatedAgo from "../UpdatedAgo";
import WidgetErrorBoundary from "../WidgetErrorBoundary";
import { WidgetBackground } from "../WidgetSubcomponents";
import { useSupplyChanges } from "../../api/supply-changes";
import JSBI from "jsbi";
import { WEI_PER_ETH } from "../../eth-units";

type Props = {
  onClickTimeFrame: () => void;
  onSimulateProofOfWork: () => void;
  simulateProofOfWork: boolean;
  timeFrame: LimitedTimeFrameWithMerge;
  posIssuancePerDay: number;
};

const SLOTS_PER_DAY = 24 * 60 * 5;

const SupplyChange: FC<Props> = ({
  timeFrame,
  simulateProofOfWork,
  onClickTimeFrame,
  onSimulateProofOfWork,
  posIssuancePerDay,
}) => {
  // To compare proof of stake issuance to proof of work issuance we offer a
  // "simulate proof of work" toggle. However, we only have a supply series under
  // proof of stake. Already including proof of stake issuance. Adding proof of
  // work issuance would mean "simulated proof of work" is really what supply
  // would look like if there was both proof of work _and_ proof of stake
  // issuance. To make the comparison apples to apples we subtract an estimated
  // proof of stake issuance to show the supply as if there were _only_ proof of
  // work issuance. A possible improvement would be to drop this ad-hoc solution
  // and have the backend return separate series.
  const powMinPosIssuancePerDay = powIssuancePerDay - posIssuancePerDay;
  const supplyChanges = useSupplyChanges();
  const supplyChangesTimeFrame = supplyChanges[timeFrame] ?? undefined;

  const simulatedPowIssuanceSinceMerge =
    supplyChangesTimeFrame === undefined
      ? undefined
      : ((supplyChangesTimeFrame.to_slot - supplyChangesTimeFrame.from_slot) *
          powMinPosIssuancePerDay) /
        SLOTS_PER_DAY;

  const supplyChange =
    supplyChangesTimeFrame === undefined
      ? undefined
      : JSBI.subtract(
          JSBI.BigInt(supplyChangesTimeFrame.to_supply),
          JSBI.BigInt(supplyChangesTimeFrame.from_supply),
        );

  const supplyDelta =
    supplyChange === undefined || simulatedPowIssuanceSinceMerge === undefined
      ? undefined
      : simulateProofOfWork
      ? JSBI.toNumber(supplyChange) / WEI_PER_ETH +
        simulatedPowIssuanceSinceMerge
      : JSBI.toNumber(supplyChange) / WEI_PER_ETH;

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
                    <CountUp
                      preserveValue
                      end={supplyDelta ?? 0}
                      separator=","
                      decimals={2}
                      duration={0.8}
                      formattingFn={formatTwoDigitsSigned}
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
            <UpdatedAgo updatedAt={supplyChanges.timestamp} />
            <SimulateProofOfWork
              checked={simulateProofOfWork}
              onToggle={onSimulateProofOfWork}
              tooltipText="simulate what the supply change would look like under proof-of-work issuance"
            />
          </div>
        </div>
      </WidgetBackground>
    </WidgetErrorBoundary>
  );
};

export default SupplyChange;
