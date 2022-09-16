import type { FC } from "react";
import CountUp from "react-countup";
import type { EthSupply } from "../../api/eth-supply";
import { getEthSupplyImprecise } from "../../api/eth-supply";
import type { MergeEstimate } from "../../api/merge-estimate";
import type { MergeStatus } from "../../api/merge-status";
import { useSupplySinceMerge } from "../../api/supply-since-merge";
import { getDateTimeFromSlot } from "../../beacon-time";
import { MERGE_TIMESTAMP } from "../../eth-constants";
import SimulatePreMerge from "../SimulatePreMerge";
import { TextRoboto } from "../Texts";
import LabelText from "../TextsNext/LabelText";
import SkeletonText from "../TextsNext/SkeletonText";
import UpdatedAgo from "../UpdatedAgo";
import WidgetErrorBoundary from "../WidgetErrorBoundary";
import { WidgetBackground } from "../WidgetSubcomponents";

type Props = {
  ethSupply: EthSupply;
  mergeEstimate: MergeEstimate;
  mergeStatus: MergeStatus;
  simulatePreMerge: boolean;
  onSimulatePreMerge: () => void;
};

const SupplyChangeSinceMerge: FC<Props> = ({
  ethSupply,
  mergeStatus,
  simulatePreMerge,
  onSimulatePreMerge,
}) => {
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
    slotsSinceMerge === undefined ? undefined : slotsSinceMerge * 1.875;

  const supplyDelta = !simulatePreMerge
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
            <SimulatePreMerge
              checked={simulatePreMerge}
              onToggle={onSimulatePreMerge}
            ></SimulatePreMerge>
          </div>
        </div>
      </WidgetBackground>
    </WidgetErrorBoundary>
  );
};

export default SupplyChangeSinceMerge;
