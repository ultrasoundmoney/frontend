import dynamic from "next/dynamic";
import type { FC } from "react";
import { useCallback, useState } from "react";
import SupplyChange from "../SupplyChangeWidget";
import BasicErrorBoundary from "../BasicErrorBoundary";
import type { EthNumber } from "../../eth-units";
import type { JsTimestamp } from "../../time";
import CurrentSupplyWidget from "../CurrentSupplyWidget";
import GaugeWidget from "../GaugeWidget";
import type { TimeFrame } from "../../time-frames";
export type SupplyPoint = [JsTimestamp, EthNumber];

const EthSupplyWidget = dynamic(() => import("../EthSupplyWidget"));

const timeFramesWithMerge = [
  "m5",
  "h1",
  "d1",
  "d7",
  "d30",
  "since_merge",
] as const;
export type TimeFrameWithMerge = typeof timeFramesWithMerge[number];

const getNextTimeFrame = (
  timeFrame: TimeFrameWithMerge,
): TimeFrameWithMerge => {
  const nextIndex =
    (timeFramesWithMerge.indexOf(timeFrame) + 1) % timeFramesWithMerge.length;

  return timeFramesWithMerge[nextIndex];
};

type Props = {
  onClickTimeFrame: () => void;
  onSetTimeFrame: (timeFrame: TimeFrame) => void;
  timeFrame: TimeFrame;
};

const SupplySection: FC<Props> = ({
  timeFrame,
  onClickTimeFrame,
  onSetTimeFrame,
}) => {
  const [simulateProofOfWork, setSimulateProofOfWork] = useState(false);
  const [supplyTimeFrame, setSupplyTimeFrame] =
    useState<TimeFrameWithMerge>("since_merge");

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

export default SupplySection;
