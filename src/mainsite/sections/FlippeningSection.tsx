import { parseISO } from "date-fns";
import _maxBy from "lodash/maxBy";
import dynamic from "next/dynamic";
import type { FC } from "react";
import { useMemo } from "react";
import type { FlippeningDataPoint } from "../api/flippening-data";
import { useFlippeningData } from "../api/flippening-data";
import { useMarketCaps } from "../api/market-caps";
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
  marketCapRatios: FlippeningDataPoint[],
  currentRatio: number,
): MarketCapRatioPoint[] => {
  const ratioSeries = marketCapRatios.map(
    ({ marketcapRatio, t }) =>
      [t * 1000, marketcapRatio * 100] as MarketCapRatioPoint,
  );
  const now = new Date();
  const utcYear = now.getUTCFullYear();
  const utcMonth = now.getUTCMonth();
  const utcDate = now.getUTCDate();
  const todayUTC = Date.UTC(utcYear, utcMonth, utcDate);

  const lastDatapoint = ratioSeries?.[ratioSeries.length - 1]?.[0];
  if (lastDatapoint !== undefined && lastDatapoint >= todayUTC) {
    ratioSeries.pop();
  }
  ratioSeries.push([todayUTC, currentRatio * 100]);

  return ratioSeries;
};

const FlippeningSection: FC = () => {
  const flippeningData = useFlippeningData();
  const marketCaps = useMarketCaps();

  const [
    marketCapRatiosSeries,
    exponentialGrowthCurveSeries,
    maxMarketCap,
    maxExponentialGrowthCurve,
  ] = useMemo(() => {
    if (flippeningData === undefined) {
      return [undefined, undefined];
    }

    const currentRatio =
      marketCaps === undefined
        ? undefined
        : marketCaps.ethMarketCap / marketCaps.btcMarketCap;
    const series = pointsFromMarketCapRatiosOverTime(
      flippeningData,
      currentRatio,
    );
    const maxMarketCap = _maxBy(series, (point) => point[1]);

    let expontentialGrowthCurve: MarketCapRatioPoint[] = [];
    if (series !== undefined && series.length > 1) {
      const startingPoint = series[0];
      const endPoint = series[series.length - 1];
      if (startingPoint !== undefined && endPoint !== undefined) {
        expontentialGrowthCurve = generateExponentialGrowthData(
          startingPoint[0],
          startingPoint[1] / 100,
          endPoint[0],
          endPoint[1] / 100,
        );
      }
    }
    const maxExponentialCurve = _maxBy(
      expontentialGrowthCurve,
      (point) => point[1],
    );

    return [series, expontentialGrowthCurve, maxMarketCap, maxExponentialCurve];
  }, [flippeningData]);

  const marketCapSeries = flippeningData?.map(
    ({ t, ethMarketcap, btcMarketcap }) => [
      t * 1000,
      { ethMarketcap, btcMarketcap },
    ],
  );
  const marketCapsMap:
    | Record<number, { ethMarketcap: number; btcMarketcap: number }>
    | undefined =
    marketCapSeries === undefined
      ? undefined
      : (Object.fromEntries(marketCapSeries) as Record<
          number,
          { ethMarketcap: number; btcMarketcap: number }
        >);
  return (
    <Section link="flippening" subtitle="it's happening™" title="flippening">
      <div className="flex w-full flex-col gap-y-4 gap-x-4 lg:flex-row">
        <div className="w-full">
          <MarketCapRatioWidget
            marketCapRatiosSeries={marketCapRatiosSeries}
            marketCapsMap={marketCapsMap ?? {}}
            maxMarketCap={maxMarketCap?.[1]}
            exponentialGrowthCurveSeries={exponentialGrowthCurveSeries}
            maxExponentialGrowthCurve={maxMarketCap?.[1]}
          />
        </div>
      </div>
    </Section>
  );
};

export default FlippeningSection;
