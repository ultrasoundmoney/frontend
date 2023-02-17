import dynamic from "next/dynamic";
import type { FC } from "react";
import { useCallback, useState } from "react";
import SupplyChange from "../SupplyChangeWidget";
import BasicErrorBoundary from "../BasicErrorBoundary";
import type { EthNumber } from "../../eth-units";
import { usePosIssuancePerDay } from "../../eth-units";
import type { JsTimestamp } from "../../time";
import CurrentSupplyWidget from "../CurrentSupplyWidget";
import type { TimeFrame } from "../../time-frames";
export type SupplyPoint = [JsTimestamp, EthNumber];

const EthSupplyWidget = dynamic(() => import("../EthSupplyWidget"));
// On Safari SSR rendering the animated SVG gauge paths causes a hydration error.
const GaugeWidget = dynamic(() => import("../GaugeWidget"), { ssr: false });

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
  const posIssuancePerDay = usePosIssuancePerDay();
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
        <div className="mt-16 flex flex-col gap-x-4 gap-y-4 lg:flex-row">
          <div className="flex lg:w-1/2">
            <EthSupplyWidget
              simulateProofOfWork={simulateProofOfWork}
              onSimulateProofOfWork={handleSimulateProofOfWork}
              onClickTimeFrame={onClickTimeFrame}
              timeFrame={timeFrame}
            />
          </div>
          <div className="flex flex-col gap-y-4 lg:w-1/2">
            <SupplyChange
              simulateProofOfWork={simulateProofOfWork}
              onSimulateProofOfWork={handleSimulateProofOfWork}
              onClickTimeFrame={onClickTimeFrame}
              timeFrame={timeFrame}
              posIssuancePerDay={posIssuancePerDay}
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
        />
      </div>
    </BasicErrorBoundary>
  );
};

export default SupplyDashboard;
