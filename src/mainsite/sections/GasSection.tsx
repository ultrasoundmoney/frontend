import { parseISO } from "date-fns";
import _maxBy from "lodash/maxBy";
import dynamic from "next/dynamic";
import type { FC } from "react";
import { useMemo } from "react";
import type { BaseFeeAtTime } from "../api/base-fee-over-time";
import { useBaseFeeOverTime } from "../api/base-fee-over-time";
import { WEI_PER_GWEI } from "../../eth-units";
import type { TimeFrame } from "../time-frames";
import BasicErrorBoundary from "../../components/BasicErrorBoundary";
import SectionDivider from "../../components/SectionDivider";
import type { BaseFeePoint } from "../components/BaseFeesWidget";

const BaseFeesWidget = dynamic(() => import("../components/BaseFeesWidget"), {
  ssr: false,
});
const GasMarketWidget = dynamic(() => import("../components/GasMarketWidget"), {
  ssr: false,
});
const GasStreakWidget = dynamic(() => import("../components/GasStreakWidget"), {
  ssr: false,
});

const pointsFromBaseFeesOverTime = (
  baseFeesD1: BaseFeeAtTime[],
): BaseFeePoint[] =>
  baseFeesD1.map(
    ({ wei, timestamp }) =>
      [parseISO(timestamp).getTime(), wei / WEI_PER_GWEI] as BaseFeePoint,
  );

const GasSection: FC<{
  timeFrame: TimeFrame;
  onClickTimeFrame: () => void;
}> = ({ timeFrame, onClickTimeFrame }) => {
  const baseFeesOverTime = useBaseFeeOverTime();

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
            <div className="w-full lg:w-1/2">
              <BaseFeesWidget
                barrier={baseFeesOverTime?.barrier}
                baseFeesSeries={baseFeesSeries}
                baseFeesMap={baseFeesMap ?? {}}
                max={max?.[1]}
                timeFrame={timeFrame}
                onClickTimeFrame={onClickTimeFrame}
              />
            </div>
            <div className="flex h-min w-full flex-col gap-y-4 lg:w-1/2">
              <GasMarketWidget
                timeFrame={timeFrame}
                onClickTimeFrame={onClickTimeFrame}
              />
              <GasStreakWidget />
            </div>
          </div>
        </div>
      </div>
    </BasicErrorBoundary>
  );
};

export default GasSection;
