import { parseISO } from "date-fns";
import _maxBy from "lodash/maxBy";
import dynamic from "next/dynamic";
import type { FC } from "react";
import { useMemo } from "react";
import type { FlippeningDataPoint } from "../api/flippening-data";
import { useFlippeningData } from "../api/flippening-data";
import type { MarketcapRatioPoint } from "../components/MarketCapRatioWidget";
import Section from "../../components/Section";

const MarketCapRatioWidget = dynamic(() => import("../components/MarketCapRatioWidget"), {
  ssr: false,
});


const pointsFromMarketCapRatiosOverTime = (
  baseFeesD1: FlippeningDataPoint[],
): MarketCapRatioPoint[] =>
  baseFeesD1.map(
    ({ marketcapRatio, t }) =>
      [t*1000, marketcapRatio*100] as MarketCapRatioPoint,
  );

const FlippeningSection: FC = () => {
  const flippeningData = useFlippeningData();

  const [marketCapRatiosSeries, max] = useMemo(() => {
    if (flippeningData === undefined) {
      return [undefined, undefined];
    }

    const series = pointsFromMarketCapRatiosOverTime(flippeningData);
    const max = _maxBy(series, (point) => point[1]);

    return [series, max];
  }, [flippeningData]);

  const marketCapRatiosMap =
    marketCapRatiosSeries === undefined
      ? undefined
      : Object.fromEntries(new Map(marketCapRatiosSeries).entries());

  return (
    <Section link="flippening" subtitle="the flippening is coming" title="flippening">
      <div className="flex w-full flex-col gap-y-4 gap-x-4 lg:flex-row">
        <div className="w-full">
          <MarketCapRatioWidget
            marketCapRatiosSeries={marketCapRatiosSeries}
            marketCapRatiosMap={marketCapRatiosMap ?? {}}
            max={max?.[1]}
          />
        </div>
      </div>
    </Section>
  );
};

export default FlippeningSection;
