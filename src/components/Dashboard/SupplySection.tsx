import dynamic from "next/dynamic";
import type { FC } from "react";
import { useCallback, useState } from "react";
import SupplyChange from "../SupplyChange";
import BasicErrorBoundary from "../BasicErrorBoundary";
import type { EthNumber } from "../../eth-units";
import type { JsTimestamp } from "../../time";
import CurrentSupplyWidget from "../CurrentSupplyWidget";
import GaugeWidget from "../GaugeWidget";
import type { TimeFrameNext } from "../../time-frames";
import { getNextTimeFrame } from "../../time-frames";
const EthSupplyWidget = dynamic(() => import("../EthSupplyWidget"));
export type SupplyPoint = [JsTimestamp, EthNumber];

const SupplySection: FC = () => {
  const [simulateProofOfWork, setSimulateProofOfWork] = useState(false);
  const [timeFrame, setTimeFrame] = useState<TimeFrameNext>("d1");

  const handleSetTimeFrame = useCallback(setTimeFrame, [setTimeFrame]);

  const handleSimulateProofOfWork = useCallback(() => {
    setSimulateProofOfWork((simulateProofOfWork) => !simulateProofOfWork);
  }, []);

  const handleClickTimeFrame = useCallback(() => {
    setTimeFrame((timeFrame) => getNextTimeFrame(timeFrame));
  }, []);

  return (
    <BasicErrorBoundary>
      <div
        className="mt-16 mb-32 flex flex-col gap-y-4 xs:px-4 md:px-16"
        id="merge"
      >
        <div className="mt-16 flex flex-col gap-x-4 gap-y-4 lg:flex-row">
          <div className="flex flex-col gap-y-4 lg:w-1/2">
            <SupplyChange
              simulateProofOfWork={simulateProofOfWork}
              onSimulateProofOfWork={handleSimulateProofOfWork}
            />
            <CurrentSupplyWidget />
          </div>
          <div className="flex lg:w-1/2">
            <EthSupplyWidget
              simulateProofOfWork={simulateProofOfWork}
              onSimulateProofOfWork={handleSimulateProofOfWork}
            />
          </div>
        </div>
        <GaugeWidget
          onClickTimeFrame={handleClickTimeFrame}
          onSimulateProofOfWork={handleSimulateProofOfWork}
          onSetTimeFrame={handleSetTimeFrame}
          simulateProofOfWork={simulateProofOfWork}
          timeFrame={timeFrame}
        />
      </div>
    </BasicErrorBoundary>
  );
};

export default SupplySection;
