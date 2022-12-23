import dynamic from "next/dynamic";
import type { FC } from "react";
import { useCallback, useState } from "react";
import SupplyChange from "../SupplyChangeWidget";
import BasicErrorBoundary from "../BasicErrorBoundary";
import { EthNumber, usePosIssuancePerDay } from "../../eth-units";
import type { JsTimestamp } from "../../time";
import CurrentSupplyWidget from "../CurrentSupplyWidget";
import type { TimeFrameNext } from "../../time-frames";
import { useIssuanceEstimate } from "../../api/issuance-estimate";
export type SupplyPoint = [JsTimestamp, EthNumber];

const EthSupplyWidget = dynamic(() => import("../EthSupplyWidget"));
// On Safari SSR rendering the animated SVG gauge paths causes a hydration error.
const GaugeWidget = dynamic(() => import("../GaugeWidget"), { ssr: false });

const limitedTimeFramesWithMerge = [
  "m5",
  "h1",
  "d1",
  "d7",
  "d30",
  "since_merge",
] as const;
export type LimitedTimeFrameWithMerge =
  typeof limitedTimeFramesWithMerge[number];

const getNextTimeFrame = (
  timeFrame: LimitedTimeFrameWithMerge,
): LimitedTimeFrameWithMerge => {
  const nextIndex =
    (limitedTimeFramesWithMerge.indexOf(timeFrame) + 1) %
    limitedTimeFramesWithMerge.length;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return limitedTimeFramesWithMerge[nextIndex]!;
};

type Props = {
  onClickTimeFrame: () => void;
  onSetTimeFrame: (timeFrame: TimeFrameNext) => void;
  timeFrame: TimeFrameNext;
};

const SupplyDashboard: FC<Props> = ({
  timeFrame,
  onClickTimeFrame,
  onSetTimeFrame,
}) => {
  const posIssuancePerDay = usePosIssuancePerDay();
  const [simulateProofOfWork, setSimulateProofOfWork] = useState(false);
  const [supplyTimeFrame, setSupplyTimeFrame] =
    useState<LimitedTimeFrameWithMerge>("since_merge");

  const handleSimulateProofOfWork = useCallback(() => {
    setSimulateProofOfWork((simulateProofOfWork) => !simulateProofOfWork);
  }, []);

  const handleClickSupplyTimeFrame = useCallback(() => {
    setSupplyTimeFrame((timeFrame) => getNextTimeFrame(timeFrame));
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
              onClickTimeFrame={handleClickSupplyTimeFrame}
              timeFrame={supplyTimeFrame}
            />
          </div>
          <div className="flex flex-col gap-y-4 lg:w-1/2">
            <SupplyChange
              simulateProofOfWork={simulateProofOfWork}
              onSimulateProofOfWork={handleSimulateProofOfWork}
              onClickTimeFrame={handleClickSupplyTimeFrame}
              timeFrame={supplyTimeFrame}
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
