import dynamic from "next/dynamic";
import type { FC} from "react";
import { useCallback, useState } from "react";
import { Suspense } from "react";
import type { MergeEstimate } from "../../api/merge-estimate";
import SupplyChangeSinceMerge from "../SupplyChangeSinceMerge";
import TotalDifficultyProgressWidget from "../TotalDifficultyProgressWidget";
import BasicErrorBoundary from "../BasicErrorBoundary";
import type { MergeStatus } from "../../api/merge-status";
import type { EthNumber } from "../../eth-units";
import type { EthSupply } from "../../api/eth-supply";
import type { JsTimestamp } from "../../time";
const SupplySinceMergeWidget = dynamic(
  () => import("../SupplySinceMergeWidget"),
);
export type SupplyPoint = [JsTimestamp, EthNumber];

type Props = {
  ethSupply: EthSupply;
  mergeEstimate: MergeEstimate;
  mergeStatus: MergeStatus;
};

const MergeSection: FC<Props> = ({ ethSupply, mergeEstimate, mergeStatus }) => {
  const [simulatePreMerge, setSimulatePreMerge] = useState(false);

  const handleSimulatePreMerge = useCallback(() => {
    setSimulatePreMerge((simulatePreMerge) => !simulatePreMerge);
  }, []);

  return (
    <BasicErrorBoundary>
      <Suspense>
        <div
          className="mt-16 mb-32 flex flex-col gap-y-4 xs:px-4 md:px-16"
          id="merge"
        >
          <div className="flex flex-col lg:flex-row gap-x-4 gap-y-4 mt-16">
            <div className="flex flex-col gap-y-4 md:w-1/2">
              <TotalDifficultyProgressWidget
                mergeStatus={mergeStatus}
                mergeEstimate={mergeEstimate}
                progress={1}
              />
              <SupplyChangeSinceMerge
                ethSupply={ethSupply}
                mergeEstimate={mergeEstimate}
                mergeStatus={mergeStatus}
                simulatePreMerge={simulatePreMerge}
                onSimulatePreMerge={handleSimulatePreMerge}
              />
            </div>
            <div className="flex md:w-1/2">
              <SupplySinceMergeWidget
                mergeStatus={mergeStatus}
                simulatePreMerge={simulatePreMerge}
                onSimulatePreMerge={handleSimulatePreMerge}
              />
            </div>
          </div>
        </div>
      </Suspense>
    </BasicErrorBoundary>
  );
};

export default MergeSection;
