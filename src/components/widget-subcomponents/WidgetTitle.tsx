import { FC } from "react";
import { TimeFrameNext } from "../../time_frames";
import TimeFrameIndicator from "./TimeFrameIndicator";

type Props = {
  align?: "right";
  onClickTimeFrame?: () => void;
  timeFrame?: TimeFrameNext;
  title: string;
};

const Title: FC<Props> = ({
  onClickTimeFrame,
  timeFrame,
  title,
}) => (
  <div className="flex items-center justify-between">
    <p className="font-inter font-light text-blue-spindle text-md uppercase">
      {title}
    </p>
    {timeFrame !== undefined && onClickTimeFrame !== undefined && (
      <TimeFrameIndicator
        onClickTimeFrame={onClickTimeFrame}
        timeFrame={timeFrame} />
    )}
  </div>
);

export default Title