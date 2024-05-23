import { parseISO } from "date-fns";
import _maxBy from "lodash/maxBy";
import dynamic from "next/dynamic";
import type { FC } from "react";
import { useMemo } from "react";
import type { FlippeningDataPoint } from "../api/flippening-data";
import { useFlippeningData } from "../api/flippening-data";
import type { MarketCapRatioPoint } from "../components/MarketCapRatioWidget";
import Section from "../../components/Section";

const MarketCapRatioWidget = dynamic(
  () => import("../components/MarketCapRatioWidget"),
  {
    ssr: false,
  },
);

function generateExponentialGrowthData(
  startTimestamp: number,
  startValue: number,
  endTimestamp: number,
  endValue: number,
  targetValue = 1.0,
): [number, number][] {
  // Calculate the number of days between the start and end dates
  const daysBetween = (endTimestamp - startTimestamp) / (1000 * 3600 * 24);

  // Calculate the growth rate r
  const r = Math.log(endValue / startValue) / daysBetween;

  // Initialize the array to store the daily values
  const data: [number, number][] = [];

  // Generate the daily values until the target value is reached
  let currentTimestamp = startTimestamp;
  let currentValue = startValue;
  while (currentValue < targetValue) {
    data.push([currentTimestamp, currentValue * 100]);
    currentTimestamp += 1000 * 3600 * 24; // Increment the timestamp by one day in milliseconds
    currentValue =
      startValue *
      Math.exp(r * ((currentTimestamp - startTimestamp) / (1000 * 3600 * 24)));
  }

  // Ensure the target value is included as the last point
  data.push([currentTimestamp, currentValue * 100]);
  return data;
}

const pointsFromMarketCapRatiosOverTime = (
  baseFeesD1: FlippeningDataPoint[],
): MarketCapRatioPoint[] =>
  baseFeesD1.map(
    ({ marketcapRatio, t }) =>
      [t * 1000, marketcapRatio * 100] as MarketCapRatioPoint,
  );

const FlippeningSection: FC = () => {
  const flippeningData = useFlippeningData();

  const [marketCapRatiosSeries, max] = useMemo(() => {
    if (flippeningData === undefined) {
      return [undefined, undefined];
    }

    let series = pointsFromMarketCapRatiosOverTime(flippeningData);

    if (series !== undefined && series.length > 1) {
      const startingPoint = series[0];
      const endPoint = series[series.length - 1];
      if (startingPoint !== undefined && endPoint !== undefined) {
        let expontentialGrowthCurve = generateExponentialGrowthData(
          startingPoint[0],
          startingPoint[1] / 100,
          endPoint[0],
          endPoint[1] / 100,
        );
        expontentialGrowthCurve = expontentialGrowthCurve.filter(
          ([t, _v]) => t > endPoint[0] ?? Infinity,
        );
        series = series.concat(expontentialGrowthCurve);
      }
    }
    const max = _maxBy(series, (point) => point[1]);

    return [series, max];
  }, [flippeningData]);

  const marketCapRatiosMap =
    marketCapRatiosSeries === undefined
      ? undefined
      : Object.fromEntries(new Map(marketCapRatiosSeries).entries());

  return (
    <Section
      link="flippening"
      subtitle="the flippening is coming"
      title="flippening"
    >
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
