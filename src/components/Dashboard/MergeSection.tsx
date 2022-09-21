import dynamic from "next/dynamic";
import type { FC } from "react";
import { useCallback, useState } from "react";
import SupplyChangeSinceMerge from "../SupplyChangeSinceMerge";
import TotalDifficultyProgressWidget from "../TotalDifficultyProgressWidget";
import BasicErrorBoundary from "../BasicErrorBoundary";
import type { EthNumber } from "../../eth-units";
import type { JsTimestamp } from "../../time";
const SupplySinceMergeWidget = dynamic(
  () => import("../SupplySinceMergeWidget"),
);
export type SupplyPoint = [JsTimestamp, EthNumber];

const MergeSection: FC = () => {
  const [simulateProofOfWork, setSimulateProofOfWork] = useState(false);

  const handleSimulateProofOfWork = useCallback(() => {
    setSimulateProofOfWork((simulateProofOfWork) => !simulateProofOfWork);
  }, []);

  return (
    <BasicErrorBoundary>
      <div
        className="mt-16 mb-32 flex flex-col gap-y-4 xs:px-4 md:px-16"
        id="merge"
      >
        <div className="flex flex-col lg:flex-row gap-x-4 gap-y-4 mt-16">
          <div className="flex flex-col gap-y-4 lg:w-1/2">
            <TotalDifficultyProgressWidget progress={1} />
            <SupplyChangeSinceMerge
              simulateProofOfWork={simulateProofOfWork}
              onSimulateProofOfWork={handleSimulateProofOfWork}
            />
          </div>
          <div className="flex lg:w-1/2">
            <SupplySinceMergeWidget
              simulateProofOfWork={simulateProofOfWork}
              onSimulateProofOfWork={handleSimulateProofOfWork}
            />
          </div>
        </div>
      </div>
    </BasicErrorBoundary>
  );
};

export default MergeSection;
