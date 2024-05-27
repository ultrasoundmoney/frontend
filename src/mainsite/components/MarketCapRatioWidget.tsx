import { format } from "date-fns";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsAnnotations from "highcharts/modules/annotations";
import _merge from "lodash/merge";
import type { FC, RefObject } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import colors from "../../colors";
import LabelText from "../../components/TextsNext/LabelText";
import WidgetErrorBoundary from "../../components/WidgetErrorBoundary";
import { WidgetBackground } from "../../components/WidgetSubcomponents";
import { getFormattedDays } from "./TimeFrameIndicator";
import type { JsTimestamp } from "../../time";
import _first from "lodash/first";
import { formatDate } from "../utils/metric-utils";
import { formatOneDecimal } from "../../format";
import styles from "./MarketCapRatioWidget.module.scss";
import { COLORS } from "../utils/chart-defaults";
import ICOTimeFrameIndicator from "./ICOTimeFrameIndicator";

export type MarketCapRatioPoint = [JsTimestamp, number];

// Somehow resolves an error thrown by the annotation lib
if (typeof window !== "undefined") {
  // Initialize highchats annotations module (only on browser, doesn't work on server)
  highchartsAnnotations(Highcharts);
}

const WEDGE_COLOR = "#3B88C3";

const reduceToWeeklyData = (dailyData: MarketCapRatioPoint[] | undefined) => {
  if (dailyData === undefined) {
    return undefined;
  }
  const WEEKDAY = 1;
  const dataLength = dailyData.length;
  const weeklyProjections = dailyData.filter(
    (e, i) => i === dataLength - 1 || new Date(e[0]).getDay() === WEEKDAY,
  );
  return weeklyProjections;
};

const baseOptions: Highcharts.Options = {
  accessibility: { enabled: false },
  chart: {
    height: 600,
    style: {
      color: colors.slateus400,
      fontFamily: "Roboto Mono",
      fontSize: "12px",
      fontWeight: "300",
    },
    backgroundColor: "transparent",
    showAxes: false,
    marginRight: 0,
    marginLeft: 40,
    marginTop: 14,
  },
  title: undefined,
  legend: {
    enabled: true,
    useHTML: true,
    symbolWidth: 0,
    labelFormatter: function () {
      const color =
        this.visible === false
          ? "bg-slateus-400 opacity-60"
          : this.index === 0
          ? "bg-[#2476A9]"
          : `bg-[#3B88C3]`;
      return `
        <div class="flex flex-row gap-x-2 items-center z-50">
          <div class="w-2 h-2 ${color} rounded-full"></div>
          <div class="
            text-xs font-normal font-roboto text-slateus-200
            ${this.visible ? "" : "opacity-60"}
          ">
            ${this.name}
          </div>
        </div>
      `;
    },
  },
  xAxis: {
    showEmpty: true,
    type: "datetime",
    lineWidth: 0,
    minPadding: 0,
    maxPadding: 0.03,
    tickInterval: 365.25 * 24 * 3600 * 1000, // always use 1 year intervals
    tickLength: 0,
    labels: {
      style: {
        color: colors.slateus400,
        fontFamily: "Roboto Mono",
        fontSize: "12px",
        fontWeight: "300",
      },
    },
  },
  yAxis: {
    id: "market-cap-ratios",
    labels: {
      x: -5,
      format: "{value}%",
      style: {
        color: colors.slateus400,
        fontFamily: "Roboto Mono",
        fontSize: "12px",
        fontWeight: "300",
      },
    },
    // In 1, 10, 100 in log10
    tickPositions: [0, 1, 2],
    endOnTick: false,
    startOnTick: false,
    gridLineWidth: 0,
    type: "logarithmic",
    title: undefined,
    min: 0.3,
  },
  tooltip: {
    backgroundColor: "transparent",
    borderWidth: 0,
    shadow: false,
    useHTML: true,
  },
  credits: { enabled: false },
  plotOptions: {
    series: {
      animation: {
        duration: 300,
      },
    },
  },
};

const makeBarrier = (barrier: number) => ({
  id: "barrier-plotline",
  color: WEDGE_COLOR,
  dashStyle: "Solid",
  width: 2,
  value: barrier,
  zIndex: -1,
});

type Props = {
  marketCapsMap: Record<number, { ethMarketcap: number; btcMarketcap: number }>;
  marketCapRatiosSeries: MarketCapRatioPoint[] | undefined;
  maxMarketCap: number | undefined;
  exponentialGrowthCurveSeries: MarketCapRatioPoint[] | undefined;
  maxExponentialGrowthCurve: number | undefined;
};

interface HighchartsRef {
  chart: Highcharts.Chart;
  container: RefObject<HTMLDivElement>;
}

const MarketCapRatiosWidget: FC<Props> = ({
  marketCapsMap,
  marketCapRatiosSeries,
  maxMarketCap,
  exponentialGrowthCurveSeries,
  maxExponentialGrowthCurve,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Setting lang has to happen before any chart render.
  useEffect(() => {
    if (Highcharts) {
      Highcharts.setOptions({
        lang: {
          resetZoomTitle: undefined,
        },
      });
    }
  }, []);

  const [marketCapVisible, setMarketCapVisible] = useState(true);
  const [projectionVisible, setProjectionVisible] = useState(true);

  const barrier = 1;
  const flippeningDataPoint =
    exponentialGrowthCurveSeries === undefined
      ? undefined
      : exponentialGrowthCurveSeries[exponentialGrowthCurveSeries.length - 1];
  const flippeningTimestamp =
    flippeningDataPoint === undefined ? undefined : flippeningDataPoint[0];

  const firstMarketCapRatio = marketCapRatiosSeries?.[0]?.[1];
  const firstMarketCapTimestamp = marketCapRatiosSeries?.[0]?.[0];

  marketCapRatiosSeries = reduceToWeeklyData(marketCapRatiosSeries);
  exponentialGrowthCurveSeries = reduceToWeeklyData(
    exponentialGrowthCurveSeries,
  );

  const lastMarketCapRatioTimestamp =
    marketCapRatiosSeries?.[marketCapRatiosSeries?.length - 1]?.[0];
  const futureExponentialGrowthSeries = exponentialGrowthCurveSeries?.filter(
    (e) => e[0] > (lastMarketCapRatioTimestamp ?? 0),
  );
  const pastExponentialGrowthSeries = exponentialGrowthCurveSeries?.filter(
    (e) => e[0] <= (lastMarketCapRatioTimestamp ?? 0),
  );

  const options = useMemo((): Highcharts.Options => {
    return _merge({}, baseOptions, {
      yAxis: {
        // Setting this to avoid change in y-axis scaling when the flippening date label comes in upon projectio visibility change
        max: 100,
        min: 0.3,
        plotLines: projectionVisible ? [makeBarrier(100)] : undefined,
      },
      xAxis: {
        min: firstMarketCapTimestamp,
        max: flippeningTimestamp,
        plotLines:
          projectionVisible && flippeningTimestamp !== undefined
            ? [
                {
                  value: flippeningTimestamp,
                  width: 1,
                  label: {
                    rotation: 0,
                    useHTML: true,
                    formatter: () => `
                        <div class="flex justify-start">
                            <div class="relative w-[30px] h-[30px] overflow-visible">
                                <img
                                class="w-[30px] h-[30px] hover:animate-dolphin-flip"
                                src="/dolphin.svg"
                                />
                            </div>
                        </div>
                    `,
                    verticalAlign: "bottom",
                    align: "right",
                    x: 0,
                    y: -64,
                  },
                  zIndex: 10,
                },
                {
                  value: flippeningTimestamp,
                  color: COLORS.PLOT_LINE,
                  width: 1,
                  label: {
                    rotation: 0,
                    formatter: () =>
                      `flippening?<br><b>${formatDate(
                        new Date(flippeningTimestamp),
                      )}</b><br>
                      <b>${getFormattedDays(
                        new Date(flippeningTimestamp),
                        new Date(),
                        false,
                      )} away</b>`,
                    verticalAlign: "bottom",
                    align: "right",
                    x: -6,
                    y: -34,
                  },
                  zIndex: 10,
                },
              ]
            : undefined,
      },
      series: [
        {
          animation: false,
          id: "market-cap-ratios-over-area",
          name: "marketcap ratio (ETH/BTC)",
          type: "line",
          visible: marketCapVisible,
          events: {
            legendItemClick: function () {
              setMarketCapVisible(!marketCapVisible);
            },
          },
          showInLegend: true,
          color: {
            linearGradient: {
              x1: 0,
              y1: 1,
              x2: 2,
              y2: 0,
            },
            stops: [
              [0, "#1FD0E1"],
              [1, "#6758F3"],
            ],
          },
          shadow: {
            color: "rgba(75, 144, 219, 0.2)",
            width: 15,
          },
          threshold: barrier,
          data:
            marketCapRatiosSeries === undefined
              ? undefined
              : [
                  ...marketCapRatiosSeries,
                  {
                    x: marketCapRatiosSeries[
                      marketCapRatiosSeries.length - 1
                    ]![0],
                    y: marketCapRatiosSeries[
                      marketCapRatiosSeries.length - 1
                    ]![1],
                    marker: {
                      symbol: `url(/dot_supply_graph.svg)`,
                      enabled: true,
                    },
                  },
                ],
          lineWidth: 2,
          states: {
            inactive: {
              enabled: false,
            },
          },
        },
        {
          id: "future-exponential-growth-series",
          name: "flippening wedge",
          color: WEDGE_COLOR,
          zIndex: -1,
          visible: projectionVisible,
          events: {
            legendItemClick: function () {
              setProjectionVisible(!projectionVisible);
            },
          },
          type: "line",
          fillOpacity: 0.25,
          showInLegend: true,
          threshold: barrier,
          data: futureExponentialGrowthSeries,
          lineWidth: 2,
          states: {
            inactive: {
              enabled: false,
            },
          },
        },
        {
          id: "past-exponential-growth-series",
          name: "flippening wedge",
          color: WEDGE_COLOR,
          zIndex: -1,
          visible: projectionVisible,
          marker: {
            enabled: false,
          },
          type: "line",
          fillOpacity: 0.25,
          showInLegend: false,
          enableMouseTracking: false,
          threshold: barrier,
          data: pastExponentialGrowthSeries,
          lineWidth: 2,
          states: {
            inactive: {
              enabled: false,
            },
          },
        },
      ],
      tooltip: {
        shared: false,
        backgroundColor: "transparent",
        padding: 0,
        valueDecimals: 0,
        xDateFormat: "%Y-%m-%d",
        useHTML: true,
        formatter: function () {
          const point = this.point;

          if (point === undefined) {
            return "";
          }

          const isProjected = point.series.userOptions.id?.includes(
            "exponential-growth-series",
          );

          const dt = new Date(this.x || 0);
          const header = `<div class="tt-header"><div class="tt-header-date text-slateus-200">${formatDate(
            dt,
          )}</div>${
            isProjected
              ? `<div class="tt-header-projected">(Projected)</div>`
              : ""
          }</div>`;

          let rows: string[] = [];
          if (point?.y != null && firstMarketCapRatio !== undefined) {
            const outPerformanceTodate = point.y / firstMarketCapRatio;
            const remainingOutPerformance = 100 / point.y;
            rows = [
              `<tr>
                <td>
                    <div class="tt-series text-right">
                    <div class="tt-series-name text-slate-300">flippening</div>
                    </div>
                </td>
                <td class="text-white text-right">${formatOneDecimal(
                  point.y || 0,
                )}%</td>
              </tr>`,
              `<tr w-full>
                <td>
                    <div class="tt-series">
                    <div class="tt-series-name text-slate-300">outperformance</div>
                    </div>
                </td>
                <td class="text-white text-right">${formatOneDecimal(
                  outPerformanceTodate,
                )}x</td>
              </tr>`,
              `<tr>
                <td>
                    <div class="tt-series">
                    <div class="tt-series-name text-slate-300">outperformance left</div>
                    </div>
                </td>
                <td class="text-white text-right">${formatOneDecimal(
                  remainingOutPerformance,
                )}x</td>
              </tr>`,
            ];
          }

          const table = `<table class="tooltip-table"><tbody>${rows.join(
            "",
          )}</tbody></table>`;
          return `
                <div class="relative z-10 w-60 rounded-lg border-2 font-roboto bg-slateus-700 border-slateus-400">
                    <div class="tt-root w-full">${header}${table}</div>
                </div>`;
        },
      },
    } as Highcharts.Options);
  }, [
    maxMarketCap,
    marketCapsMap,
    marketCapRatiosSeries,
    maxExponentialGrowthCurve,
    exponentialGrowthCurveSeries,
    projectionVisible,
    marketCapVisible,
  ]);

  return (
    <WidgetErrorBoundary title={"flippening"}>
      {/* We use the h-0 min-h-full trick to adopt the height of our sibling
      element. */}
      <WidgetBackground className="relative flex h-full min-h-[698px] w-full flex-col pb-0">
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 left-0 rounded-lg">
          <div
            // will-change-transform is critical for mobile performance of rendering the chart overlayed on this element.
            className={`
              absolute -top-40
              -left-56 h-full
              w-full
              opacity-[0.25]
              blur-[110px]
              will-change-transform
            `}
          >
            <div
              className={`
                absolute bottom-[3.0rem]
                -right-[1.0rem] h-2/5 w-3/5
                rounded-[35%]
                bg-[#0037FA]
              `}
            ></div>
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <LabelText className="flex min-h-[21px] items-center">
            flippening
          </LabelText>
          <ICOTimeFrameIndicator />
        </div>
        <div
          // flex-grow fixes bug where highcharts doesn't take full width.
          className={`
            mt-4 flex h-full
            w-full select-none
            justify-center
            overflow-hidden
            [&>div]:flex-grow
          `}
        >
          {marketCapRatiosSeries === undefined ? (
            <div className="flex h-[400px] items-center justify-center lg:h-full">
              <LabelText color="text-slateus-300">
                data not yet available
              </LabelText>
            </div>
          ) : (
            <div
              ref={containerRef}
              className={`${styles.marketCapChart} h-full w-full`}
            >
              <HighchartsReact highcharts={Highcharts} options={options} />
            </div>
          )}
        </div>
      </WidgetBackground>
    </WidgetErrorBoundary>
  );
};

export default MarketCapRatiosWidget;
