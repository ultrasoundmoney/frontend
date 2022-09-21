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
import { TextRoboto } from "../Texts";
import LabelText from "../TextsNext/LabelText";
import SkeletonText from "../TextsNext/SkeletonText";
import UpdatedAgo from "../UpdatedAgo";
import WidgetErrorBoundary from "../WidgetErrorBoundary";
import { WidgetBackground } from "../WidgetSubcomponents";

type Props = {
  simulateProofOfWork: boolean;
  onSimulateProofOfWork: () => void;
};

const POW_ISSUANCE_PER_DAY = powIssuancePerDay - posIssuancePerDay;
const SLOTS_PER_DAY = 24 * 60 * 5;

const SupplyChangeSinceMerge: FC<Props> = ({
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
    <WidgetErrorBoundary title="supply change since merge">
      <WidgetBackground>
        <div className={`relative flex flex-col gap-x-2 gap-y-4`}>
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
            </TextRoboto>
            <span className="font-roboto font-light text-3xl text-slateus-400 ml-2">
              ETH
            </span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-4 justify-between">
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

export default SupplyChangeSinceMerge;
