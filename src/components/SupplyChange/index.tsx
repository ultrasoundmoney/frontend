import type { FC } from "react";
import CountUp from "react-countup";
import { useEthSupply } from "../../api/eth-supply";
import { getEthSupplyImprecise } from "../../api/eth-supply";
import { useMergeStatus } from "../../api/merge-status";
import { useSupplySinceMerge } from "../../api/supply-since-merge";
import { getDateTimeFromSlot } from "../../beacon-time";
import { MERGE_TIMESTAMP } from "../../eth-constants";
import { posIssuancePerDay, powIssuancePerDay } from "../../static-ether-data";
import SimulateProofOfWork from "../SimulateProofOfWork";
import { BaseText } from "../Texts";
import LabelText from "../TextsNext/LabelText";
import SkeletonText from "../TextsNext/SkeletonText";
import UpdatedAgo from "../UpdatedAgo";
import WidgetErrorBoundary from "../WidgetErrorBoundary";
import { WidgetBackground } from "../WidgetSubcomponents";
import SinceMergeIndicator from "../SinceMergeIndicator";

type Props = {
  simulateProofOfWork: boolean;
  onSimulateProofOfWork: () => void;
};

const POW_ISSUANCE_PER_DAY = powIssuancePerDay - posIssuancePerDay;
const SLOTS_PER_DAY = 24 * 60 * 5;

const SupplyChange: FC<Props> = ({
  simulateProofOfWork,
  onSimulateProofOfWork,
}) => {
  const ethSupply = useEthSupply();
  const mergeStatus = useMergeStatus();
  const supplySinceMerge = useSupplySinceMerge();
  const ethSupplyImprecise = getEthSupplyImprecise(ethSupply);

  const slotsSinceMerge =
    supplySinceMerge === undefined
      ? undefined
      : (new Date(supplySinceMerge?.timestamp).getTime() -
          MERGE_TIMESTAMP.getTime()) /
        1000 /
        12;

  const simulatedPowIssuanceSinceMerge =
    slotsSinceMerge === undefined
      ? undefined
      : (slotsSinceMerge * POW_ISSUANCE_PER_DAY) / SLOTS_PER_DAY;

  const supplyDelta = !simulateProofOfWork
    ? ethSupplyImprecise - mergeStatus.supply
    : simulatedPowIssuanceSinceMerge === undefined
    ? undefined
    : ethSupplyImprecise - mergeStatus.supply + simulatedPowIssuanceSinceMerge;

  return (
    <WidgetErrorBoundary title="supply change">
      <WidgetBackground>
        <div className="relative flex flex-col gap-x-2 gap-y-4">
          <div className="flex justify-between">
            <LabelText>supply change</LabelText>
            <SinceMergeIndicator />
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
                    : "from-orange-500 to-yellow-300"
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
            <UpdatedAgo
              updatedAt={getDateTimeFromSlot(
                ethSupply.beaconBalancesSum.slot,
              ).toISOString()}
            />
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
