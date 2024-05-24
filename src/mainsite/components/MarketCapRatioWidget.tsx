import { format } from "date-fns";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsAnnotations from "highcharts/modules/annotations";
import _merge from "lodash/merge";
import type { FC } from "react";
import TranslationsContext from "../contexts/TranslationsContext";
import { useContext, useEffect, useMemo, useRef } from "react";
import colors from "../../colors";
import LabelText from "../../components/TextsNext/LabelText";
import WidgetErrorBoundary from "../../components/WidgetErrorBoundary";
import { WidgetBackground } from "../../components/WidgetSubcomponents";
import type { JsTimestamp } from "../../time";
import _first from "lodash/first";
import { formatDate } from "../utils/metric-utils";
import { formatOneDecimal } from "../../format";
import styles from "./MarketCapRatioWidget.module.scss";
import { COLORS, defaultOptions } from "../utils/chart-defaults";
import { warn } from "console";

export type MarketCapRatioPoint = [JsTimestamp, number];

// Somehow resolves an error thrown by the annotation lib
if (typeof window !== "undefined") {
  // Initialize highchats annotations module (only on browser, doesn't work on server)
  highchartsAnnotations(Highcharts);
}

const baseOptions: Highcharts.Options = {
  accessibility: { enabled: false },
  chart: {
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
  xAxis: {
    type: "datetime",
    lineWidth: 0,
    minPadding: 0,
    maxPadding: 0.03,
    tickInterval: 365.25 * 24 * 3600 * 1000, // always use 1 year intervals
    tickLength: 0,
  },
  yAxis: {
    endOnTick: false,
    gridLineWidth: 0,
    type: "logarithmic",
    labels: {
      style: {
        color: colors.slateus400,
        fontFamily: "Roboto Mono",
        fontSize: "12px",
        fontWeight: "300",
      },
    },
    title: undefined,
  },
  legend: {
    enabled: false,
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
  color: COLORS.PLOT_LINE,
  width: 1,
  value: barrier,
  zIndex: 10,
  label: {
    x: 50,
    useHTML: true,
    align: "right",
    verticalAlign: "middle",
    formatter: () => `
      <div class="flex justify-start" title="flippening">
          <div>
            <img
            class="w-[35px] h-[35px]"
            src="/dolphin.svg"
            />
        </div>
      </div>
    `,
  },
});

type Props = {
  marketCapsMap: Record<number, { ethMarketCap: number; btcMarketCap: number }>;
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
  const chartRef = useRef<HighchartsRef | null>(null);
  const t = useContext(TranslationsContext);

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

  const barrier = 1;
  const flippeningTimestamp =
    exponentialGrowthCurveSeries[exponentialGrowthCurveSeries.length - 1][0];

  const options = useMemo((): Highcharts.Options => {
    const min = marketCapRatiosSeries?.reduce(
      (min, point) => (point[1] < min ? point[1] : min),
      100,
    );

    console.log("min:", min);
    return _merge({}, baseOptions, {
      yAxis: {
        id: "market-cap-ratios",
        min,
        plotLines: [makeBarrier(100)],
        labels: {
          x: -5,
          format: "{value}%",
        },
      },
      xAxis: {
        max: flippeningTimestamp,
        plotLines: [
          flippeningTimestamp !== undefined
            ? {
                value: flippeningTimestamp,
                color: COLORS.PLOT_LINE,
                width: 0,
                label: {
                  rotation: 0,
                  text: formatDate(new Date(flippeningTimestamp)),
                  style: {
                    color: colors.white,
                    whiteSpace: "normal",
                    fontSize: "13px",
                    fontWeight: "bold",
                  },
                  verticalAlign: "top",
                  align: "right",
                  x: -5,
                },
                zIndex: 10,
              }
            : undefined,
        ],
      },
      legend: {
        // Usinga custom legend for more control over responsiveness
        enabled: true,
        itemStyle: {
          color: colors.slateus200,
        },
      },
      series: [
        {
          animation: false,
          id: "market-cap-ratios-over-area",
          name: "marketcap ratio (ETH/BTC)",
          type: "line",
          showInLegend: true,
          color: COLORS.SERIES[0],
          threshold: barrier,
          data: marketCapRatiosSeries,
          lineWidth: 3,
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
          type: "line",
          fillOpacity: 0.25,
          dashStyle: "Dash",
          showInLegend: true,
          threshold: barrier,
          data: exponentialGrowthCurveSeries,
          lineWidth: 3,
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
          let points = (this.points || []).slice(0);

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

          let rows = points.map(
            (p) =>
              `<tr>
                <td>
                    <div class="tt-series">
                    <div class="tt-series-color" style="background-color:${
                      p.series.userOptions.color
                    }"></div>
                    <div class="tt-series-name text-slate-300">${
                      p.series.name.split(" (")[0]
                    }</div>
                    </div>
                </td>
                <td class="text-white">${formatOneDecimal(p.y || 0)} %</td>
              </tr>`,
          );

          if (!isProjected) {
            console.log("First Point", firstPoint);
            const marketCaps = marketCapsMap[firstPoint.x];
            console.log("Market caps Map", marketCapsMap);
            console.log("Market caps", marketCaps);
            const marketCapRows = [
              `<tr>
                <td>
                    <div class="tt-series">
                    <div class="tt-series-name text-slate-300">ETH marketcap</div>
                    </div>
                </td>
                <td class="text-white">${formatOneDecimal(
                  (marketCaps?.ethMarketcap || 0) / 1e9,
                )} BN</td>
              </tr>`,
              `<tr>
                <td>
                    <div class="tt-series">
                    <div class="tt-series-name text-slate-300">BTC marketcap</div>
                    </div>
                </td>
                <td class="text-white">${formatOneDecimal(
                  (marketCaps?.btcMarketcap || 0) / 1e9,
                )} BN</td>
              </tr>`,
            ];
            rows = rows.concat(marketCapRows);
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
            <div ref={containerRef} className={styles.supplyChart}>
              <HighchartsReact highcharts={Highcharts} options={options} />
            </div>
          )}
        </div>
      </WidgetBackground>
    </WidgetErrorBoundary>
  );
};

export default MarketCapRatiosWidget;
