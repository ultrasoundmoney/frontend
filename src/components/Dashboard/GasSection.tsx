import _maxBy from "lodash/maxBy";
import type { FC } from "react";
import { useCallback, useMemo, useState } from "react";
import type { BaseFeeAtTime } from "../../api/base-fee-over-time";
import { useBaseFeeOverTime } from "../../api/base-fee-over-time";
import type { Gwei } from "../../eth-units";
import { WEI_PER_GWEI } from "../../eth-units";
import type { JsTimestamp } from "../../time";
import type { TimeFrameNext } from "../../time-frames";
import { getNextTimeFrame } from "../../time-frames";
import BaseFeesWidget from "../BaseFeesWidget";
import BasicErrorBoundary from "../BasicErrorBoundary";
import GasStreakWidget from "../GasStreakWidget";
import GasMarketWidget from "../GasMarketWidget";
import SectionDivider from "../SectionDivider";
import { parseISO } from "date-fns";

export type BaseFeePoint = [JsTimestamp, Gwei];

const pointsFromBaseFeesOverTime = (
  baseFeesD1: BaseFeeAtTime[],
): BaseFeePoint[] =>
  baseFeesD1.map(
    ({ wei, timestamp }) =>
      [parseISO(timestamp).getTime(), wei / WEI_PER_GWEI] as BaseFeePoint,
  );

const GasSection: FC = () => {
  const baseFeesOverTime = useBaseFeeOverTime();
  const [timeFrame, setTimeFrame] = useState<TimeFrameNext>("d1");

  const handleClickTimeFrame = useCallback(() => {
    setTimeFrame((timeFrame) => getNextTimeFrame(timeFrame));
  }, []);

  const [baseFeesSeries, max] = useMemo(() => {
    if (baseFeesOverTime === undefined) {
      return [undefined, undefined];
    }

    const baseFeesOverTimeTimeFrame = baseFeesOverTime[timeFrame] ?? undefined;
    const series =
      baseFeesOverTimeTimeFrame === undefined
        ? undefined
        : pointsFromBaseFeesOverTime(baseFeesOverTimeTimeFrame);

    const max = _maxBy(series, (point) => point[1]);

    return [series, max];
  }, [baseFeesOverTime, timeFrame]);

  const baseFeesMap =
    baseFeesSeries === undefined
      ? undefined
      : Object.fromEntries(new Map(baseFeesSeries).entries());

  return (
    <BasicErrorBoundary>
      <div id="gas" className="mt-16">
        <SectionDivider link="gas" subtitle="gas is the new oil" title="gas" />
        <div className="flex flex-col gap-4 xs:px-4 md:px-16">
          <div className="flex flex-col gap-y-4 gap-x-4 lg:flex-row">
            <div className="flex h-min w-full flex-col gap-y-4 lg:w-1/2">
              <GasMarketWidget
                timeFrame={timeFrame}
                onClickTimeFrame={handleClickTimeFrame}
              />
              <GasStreakWidget />
            </div>
            <div className="w-full lg:w-1/2">
              <BaseFeesWidget
                barrier={baseFeesOverTime?.barrier}
                baseFeesSeries={baseFeesSeries}
                baseFeesMap={baseFeesMap ?? {}}
                max={max?.[1]}
                timeFrame={timeFrame}
                onClickTimeFrame={handleClickTimeFrame}
              />
            </div>
          </div>
        </div>
      </div>
    </BasicErrorBoundary>
  );
};

export default GasSection;
