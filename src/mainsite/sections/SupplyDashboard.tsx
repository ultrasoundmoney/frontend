import dynamic from "next/dynamic";
import type { FC } from "react";
import { useCallback, useState } from "react";
import BasicErrorBoundary from "../../components/BasicErrorBoundary";
import type { Unit } from "../../denomination";
import type { EthNumber } from "../../eth-units";
import type { JsTimestamp } from "../../time";
import CurrentSupplyWidget from "../components/CurrentSupplyWidget";
import GaugeWidget from "../components/GaugeWidget";
import SupplyChange from "../components/SupplyChangeWidget";
import type { TimeFrame } from "../time-frames";

export type SupplyPoint = [JsTimestamp, EthNumber];

const EthSupplyWidget = dynamic(() => import("../components/EthSupplyWidget"));

type Props = {
  onClickTimeFrame: () => void;
  onSetTimeFrame: (timeFrame: TimeFrame) => void;
  timeFrame: TimeFrame;
};

const SupplyDashboard: FC<Props> = ({
  timeFrame,
  onClickTimeFrame,
  onSetTimeFrame,
}) => {
  const [simulateProofOfWork, setSimulateProofOfWork] = useState(false);
  const [unit, setUnit] = useState<Unit>("eth");

  const handleSimulateProofOfWork = useCallback(() => {
    setSimulateProofOfWork((simulateProofOfWork) => !simulateProofOfWork);
  }, []);

  const handleSetUnit = useCallback((unit: Unit) => {
    setUnit(unit);
  }, []);

  return (
    <BasicErrorBoundary>
      <div className="flex flex-col gap-y-4 mt-16 md:px-16 xs:px-4" id="merge">
        <div className="flex flex-col gap-x-4 gap-y-4 mt-16 lg:flex-row">
          <div className="flex lg:w-1/2">
            <EthSupplyWidget
              onClickTimeFrame={onClickTimeFrame}
              onSimulateProofOfWork={handleSimulateProofOfWork}
              simulateProofOfWork={simulateProofOfWork}
              timeFrame={timeFrame}
              unit={unit}
            />
          </div>
          <div className="flex flex-col gap-y-4 lg:w-1/2">
            <SupplyChange
              simulateProofOfWork={simulateProofOfWork}
              onSimulateProofOfWork={handleSimulateProofOfWork}
              onClickTimeFrame={onClickTimeFrame}
              timeFrame={timeFrame}
              unit={unit}
            />
            <CurrentSupplyWidget />
          </div>
        </div>
        <GaugeWidget
          onClickTimeFrame={onClickTimeFrame}
          onSimulateProofOfWork={handleSimulateProofOfWork}
          onSetTimeFrame={onSetTimeFrame}
          simulateProofOfWork={simulateProofOfWork}
          timeFrame={timeFrame}
          onSetUnit={handleSetUnit}
          unit={unit}
        />
      </div>
    </BasicErrorBoundary>
  );
};

export default SupplyDashboard;
