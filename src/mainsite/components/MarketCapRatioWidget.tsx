import { format } from "date-fns";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsAnnotations from "highcharts/modules/annotations";
import _merge from "lodash/merge";
import type { FC } from "react";
import { useEffect, useMemo } from "react";
import colors from "../../colors";
import LabelText from "../../components/TextsNext/LabelText";
import WidgetErrorBoundary from "../../components/WidgetErrorBoundary";
import { WidgetBackground } from "../../components/WidgetSubcomponents";
import type { JsTimestamp } from "../../time";

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
      marker: {
        enabled: true,
        lineColor: "white",
        radius: 0.4,
        symbol: "circle",
      },
    },
  },
};

const makeBarrier = (barrier: number) => ({
  id: "barrier-plotline",
  color: colors.slateus500,
  width: 1,
  value: barrier,
  zIndex: 10,
  label: {
    x: 84,
    text: `${barrier?.toFixed(2)} Flippening`,
    useHTML: true,
    align: "right",
    formatter: () => `
      <div class="flex justify-end" title="flippening">
        <img
          class="w-[15px] h-[15px]"
          src="/peak-own.svg"
        />
      </div>
      <div class="flex text-sm">
        <div class="font-light text-white font-roboto">
          ${barrier?.toFixed(0)} %
        </div>
      </div>
    `,
  },
});

const getTooltipFormatter = (
  marketCapRatiosMap: Record<number, number>,
  exponentialGrowthCurveMap: Record<number, number>,
  barrier: number | undefined,
): Highcharts.TooltipFormatterCallbackFunction =>
  function () {
    const x = typeof this.x === "number" ? this.x : undefined;
    if (x === undefined || barrier === undefined) {
      return undefined;
    }

    const marketCapRatio = marketCapRatiosMap[x];
    const exponentialProjection = exponentialGrowthCurveMap[x];

    const dt = new Date(x);
    const formattedDate = format(dt, "iii MMM dd yyyy");

    return `
      <div class="p-4 rounded-lg border-2 font-roboto bg-slateus-700 border-slateus-400">
        <div class="text-right text-slateus-400">${formattedDate}</div>
        <div class="flex-col justify-end mt-2 text-white">
            <div>
            MarketCap Ratio: <span class=""> ${marketCapRatio?.toFixed(2)} </span> <span class="ml-1 font-roboto">%</div>
            </div>
            <div class="text-white"> 
            Exponential Projection: <span class=""> ${exponentialProjection.toFixed(2)} </span> <span class="ml-1 font-roboto">%</span>
            </div>
        </div>
      </div>
    `;
  };

type Props = {
  marketCapRatiosMap: Record<number, number>;
  marketCapRatiosSeries: MarketCapRatioPoint[] | undefined;
  maxMarketCap: number | undefined;
  exponentialGrowthCurveMap: Record<number, number>;
  exponentialGrowthCurveSeries: MarketCapRatioPoint[] | undefined;
  maxExponentialGrowthCurve: number | undefined;
};

const MarketCapRatiosWidget: FC<Props> = ({
  marketCapRatiosMap,
  marketCapRatiosSeries,
  maxMarketCap,
  exponentialGrowthCurveMap,
  exponentialGrowthCurveSeries,
  maxExponentialGrowthCurve,
}) => {
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

  const barrier = 100;

  const options = useMemo((): Highcharts.Options => {
    const min = marketCapRatiosSeries?.reduce(
      (min, point) => (point[1] < min ? point[1] : min),
      15,
    );

    return _merge({}, baseOptions, {
      yAxis: {
        id: "market-cap-ratios",
        min,
        plotLines: [barrier !== undefined ? makeBarrier(barrier) : undefined],
      },
      series: [
        {
          animation: false,
          id: "market-cap-ratios-over-area",
          name: "market-cap-ratios-over-area",
          type: "line",
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
          name: "exponential-growth-series",
          type: "line",
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
        formatter: getTooltipFormatter(
          marketCapRatiosMap,
          exponentialGrowthCurveMap,
          barrier,
        ),
      },
    } as Highcharts.Options);
  }, [
    maxMarketCap,
    marketCapRatiosMap,
    marketCapRatiosSeries,
    maxExponentialGrowthCurve,
    exponentialGrowthCurveSeries,
    exponentialGrowthCurveMap,
  ]);

  return (
    <WidgetErrorBoundary title={"market cap ratios"}>
      {/* We use the h-0 min-h-full trick to adopt the height of our sibling
      element. */}
      <WidgetBackground className="relative flex h-full min-h-[398px] w-full flex-col lg:h-0">
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 left-0 overflow-hidden rounded-lg">
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
            market cap ratios
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
            <HighchartsReact highcharts={Highcharts} options={options} />
          )}
        </div>
        <LabelText color="text-slateus-400 mt-2" className="text-right">
          live on <span className="text-slateus-200">ultrasound.money</span>
        </LabelText>
      </WidgetBackground>
    </WidgetErrorBoundary>
  );
};

export default MarketCapRatiosWidget;
