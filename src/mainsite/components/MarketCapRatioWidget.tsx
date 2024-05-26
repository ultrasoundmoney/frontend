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
import type { JsTimestamp } from "../../time";
import _first from "lodash/first";
import { formatDate } from "../utils/metric-utils";
import { formatOneDecimal } from "../../format";
import styles from "./TwoYearProjection/TwoYearProjectionChart.module.scss";
import { COLORS } from "../utils/chart-defaults";
import ICOTimeFrameIndicator from "./ICOTimeFrameIndicator";

export type MarketCapRatioPoint = [JsTimestamp, number];

// Somehow resolves an error thrown by the annotation lib
if (typeof window !== "undefined") {
  // Initialize highchats annotations module (only on browser, doesn't work on server)
  highchartsAnnotations(Highcharts);
}

const baseOptions: Highcharts.Options = {
  accessibility: { enabled: false },
  chart: {
    style: {
      color: colors.slateus400,
      fontFamily: "Roboto Mono",
      fontSize: "12px",
      fontWeight: "300",
    },
    zooming: {
      type: "x",
      resetButton: {
        position: {
          x: 0,
          y: 10,
        },
        theme: {
          fill: colors.slateus600,
          style: {
            opacity: 0.8,
            fontSize: "12",
            fontFamily: "Inter",
            fontWeight: "300",
            color: colors.white,
            textTransform: "lowercase",
            border: `1px solid ${colors.slateus400}`,
          },
          r: 4,
          zIndex: 20,
          states: { hover: { fill: "#343C56" } },
        },
      },
    },
    backgroundColor: "transparent",
    showAxes: false,
    marginRight: 84,
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
          : `bg-[${this.color}]`;
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
    type: "datetime",
    lineWidth: 0,
    minPadding: 0,
    maxPadding: 0.03,
    tickInterval: 365.25 * 24 * 3600 * 1000, // always use 1 year intervals
    tickLength: 0,
  },
  yAxis: {
    id: "market-cap-ratios",
    labels: {
      x: -5,
      format: "{value}%",
    },
    endOnTick: false,
    gridLineWidth: 0,
    type: "logarithmic",
    title: undefined,
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

const makeBarrier = (barrier: number, isProjectionVisible: boolean) => ({
  id: "barrier-plotline",
  color: isProjectionVisible ? COLORS.SERIES[5] : COLORS.PLOT_LINE,
  dashStyle: isProjectionVisible ? "Solid" : "Dash",
  width: 2,
  value: barrier,
  zIndex: 10,
  label: isProjectionVisible
    ? {
        x: 30,
        useHTML: true,
        align: "right",
        verticalAlign: "middle",
        formatter: () => `
        <div class="flex justify-start" title="flippening">
            <div>
                <img
                class="w-[30px] h-[30px] hover:animate-reverse-spin"
                src="/dolphin.svg"
                />
            </div>
        </div>
        `,
      }
    : undefined,
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

  const lastMarketCapSeriesTimestamp =
    marketCapRatiosSeries?.[marketCapRatiosSeries.length - 1]?.[0];

  const options = useMemo((): Highcharts.Options => {
    const min = marketCapRatiosSeries?.reduce(
      (min, point) => (point[1] < min ? point[1] : min),
      100,
    );

    return _merge({}, baseOptions, {
      yAxis: {
        min,
        // Setting this to avoid change in y-axis scaling when the flippening date label comes in upon projectio visibility change
        max: 135,
        plotLines: [makeBarrier(100, projectionVisible)],
      },
      xAxis: {
        max: projectionVisible
          ? flippeningTimestamp
          : lastMarketCapSeriesTimestamp,
        plotLines: [
          flippeningTimestamp !== undefined
            ? {
                value: flippeningTimestamp,
                color: COLORS.PLOT_LINE,
                width: 0,
                label: {
                  rotation: 0,
                  text: formatDate(new Date(flippeningTimestamp)),
                  verticalAlign: "top",
                  align: "right",
                  x: -5,
                  y: -1,
                },
                zIndex: 10,
              }
            : undefined,
        ],
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
            hover: {
              lineWidthPlus: 0,
            },
          },
        },
        {
          id: "exponential-growth-series",
          name: "projection",
          color: COLORS.SERIES[5],
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
          data: exponentialGrowthCurveSeries,
          lineWidth: 2,
          states: {
            hover: {
              lineWidthPlus: 0,
            },
          },
        },
      ],
      tooltip: {
        shared: true,
        backgroundColor: "transparent",
        padding: 0,
        valueDecimals: 0,
        xDateFormat: "%Y-%m-%d",
        useHTML: true,
        formatter: function () {
          const points = (this.points || []).slice(0);

          const firstPoint = _first(points);

          if (firstPoint === undefined) {
            return "";
          }

          const isProjected = firstPoint.series.userOptions.id?.includes(
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

          const p = points[0];

          let rows: string[] = [];
          if (
            p?.y != null &&
            firstMarketCapRatio !== undefined
          ) {
            const outPerformanceTodate = p.y / firstMarketCapRatio;
            const remainingOutPerformance = 100 / p.y;
            rows = [
              `<tr>
                <td>
                    <div class="tt-series">
                    <div class="tt-series-name text-slate-300">marketcap ratio</div>
                    </div>
                </td>
                <td class="text-white">${formatOneDecimal(p.y || 0)}%</td>
              </tr>`,
              `<tr>
                <td>
                    <div class="tt-series">
                    <div class="tt-series-name text-slate-300">outperformance to date</div>
                    </div>
                </td>
                <td class="text-white">${formatOneDecimal(
                  outPerformanceTodate,
                )}x</td>
              </tr>`,
              `<tr>
                <td>
                    <div class="tt-series">
                    <div class="tt-series-name text-slate-300">remaining outperformance</div>
                    </div>
                </td>
                <td class="text-white">${formatOneDecimal(
                  remainingOutPerformance,
                )}x</td>
              </tr>`,
            ];
          }

          const table = `<table><tbody>${rows.join("")}</tbody></table>`;
          return `<div class="tt-root">${header}${table}</div>`;
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
    <WidgetErrorBoundary title={"flippening progress"}>
      {/* We use the h-0 min-h-full trick to adopt the height of our sibling
      element. */}
      <WidgetBackground className="relative flex h-full w-full flex-col">
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
            flippening progress
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
            <div ref={containerRef} className={`${styles.supplyChart}`}>
              <HighchartsReact highcharts={Highcharts} options={options} />
            </div>
          )}
        </div>
      </WidgetBackground>
    </WidgetErrorBoundary>
  );
};

export default MarketCapRatiosWidget;
