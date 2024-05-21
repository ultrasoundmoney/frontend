import { parseISO } from "date-fns";
import _maxBy from "lodash/maxBy";
import dynamic from "next/dynamic";
import type { FC } from "react";
import { useMemo } from "react";
import type { BaseFeeAtTime } from "../api/base-fee-over-time";
import { useBaseFeeOverTime } from "../api/base-fee-over-time";
import { WEI_PER_GWEI } from "../../eth-units";
import type { TimeFrame } from "../time-frames";
import type { BaseFeePoint } from "../components/BaseFeesWidget";
import Section from "../../components/Section";
import type { OnClick } from "../../components/TimeFrameControl";

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

const FlippeningSection: FC<{
  timeFrame: TimeFrame;
  onClickTimeFrame: OnClick;
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
    <Section link="flippening" subtitle="the flippening is coming" title="flippening">
      <div className="flex w-full flex-col gap-y-4 gap-x-4 lg:flex-row">
        <div className="w-full">
          <BaseFeesWidget
            barrier={baseFeesOverTime?.barrier}
            baseFeesSeries={baseFeesSeries}
            baseFeesMap={baseFeesMap ?? {}}
            max={max?.[1]}
            timeFrame={timeFrame}
            onClickTimeFrame={onClickTimeFrame}
          />
        </div>
      </div>
    </Section>
  );
};

export default FlippeningSection;
