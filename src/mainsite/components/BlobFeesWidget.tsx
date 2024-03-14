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
import { gweiFromWei } from "../../format";
import type { WeiNumber } from "../../eth-units";
import type { JsTimestamp } from "../../time";
import TimeFrameIndicator from "../components/TimeFrameIndicator";
import type { TimeFrame } from "../time-frames";

const GWEI_FORMATTING_THRESHOLD = 100_000_000; // Threshold in wei above which to convert to / format as Gwei

export type BaseFeePoint = [JsTimestamp, WeiNumber];

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
    labels: { enabled: false, style: { color: colors.slateus400 } },
    tickWidth: 0,
  },
  yAxis: {
    endOnTick: false,
    gridLineWidth: 0,
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

const getTooltipFormatter = (
  baseFeesMap: Record<number, number>,
): Highcharts.TooltipFormatterCallbackFunction =>
  function () {
    const x = typeof this.x === "number" ? this.x : undefined;
    if (x === undefined) {
      return undefined;
    }

    const total = baseFeesMap[x];
    if (total === undefined) {
      return undefined;
    }

    const dt = new Date(x);
    const formattedDate = format(dt, "iii MMM dd yyyy");
    const formattedTime = format(dt, "HH:mm:ss 'UTC'x");

    const gradientCss = "from-orange-400 to-yellow-300";

    const displayTotal =
      total > GWEI_FORMATTING_THRESHOLD ? gweiFromWei(total).toFixed(2) : total;
    const displayUnit = total > GWEI_FORMATTING_THRESHOLD ? "Gwei" : "Wei";
    return `
      <div class="p-4 rounded-lg border-2 font-roboto bg-slateus-700 border-slateus-400">
        <div class="text-right text-slateus-400">${formattedDate}</div>
        <div class="text-right text-slateus-400">${formattedTime}</div>
        <div class="flex justify-end mt-2">
          <div class="bg-gradient-to-r bg-clip-text text-transparent ${gradientCss}">
            ${displayTotal}
          </div>
          <div class="ml-1 font-roboto text-slateus-400">${displayUnit}</div>
        </div>
      </div>
    `;
  };

type Props = {
  baseFeesMap: Record<number, number>;
  baseFeesSeries: BaseFeePoint[] | undefined;
  max: number | undefined;
  onClickTimeFrame: () => void;
  timeFrame: TimeFrame;
};

const BlobFeesWidget: FC<Props> = ({
  baseFeesMap,
  baseFeesSeries,
  max,
  onClickTimeFrame,
  timeFrame,
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

  const options = useMemo((): Highcharts.Options => {
    const min = baseFeesSeries?.reduce(
      (min, point) => (point[1] < min ? point[1] : min),
      15,
    );

    const startTimeStamp = baseFeesSeries[0][0];

    return _merge({}, baseOptions, {
      xAxis: {
          min: startTimeStamp
      },
      yAxis: {
        id: "base-fees",
        min,
      },
      series: [
        {
          animation: false,
          id: "base-fees-over-area",
          type: "areaspline",
          threshold: 0,
          data: baseFeesSeries?.filter(([_, value] ) => value > 0),
          color: colors.orange400,
          negativeColor: colors.orange400,
          lineWidth: 0,
          states: {
            hover: {
              lineWidthPlus: 0,
            },
          },
          negativeFillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              [0.2, "#5487F400"],
              [1, "#00FFFB10"],
            ],
          },
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 1,
              x2: 0,
              y2: 0,
            },
            stops: [
              [0 / (max ?? 1), "#EDDB3610"],
              [1, "#E7980050"],
            ],
          },
        },
      ],
      tooltip: {
        formatter: getTooltipFormatter(baseFeesMap),
      },
    } as Highcharts.Options);
  }, [max, baseFeesMap, baseFeesSeries]);

  return (
    <WidgetErrorBoundary title="blob fees">
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
            blob fees
          </LabelText>
          <TimeFrameIndicator
            timeFrame={timeFrame}
            onClickTimeFrame={onClickTimeFrame}
          />
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
          {baseFeesSeries === undefined ? (
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

export default BlobFeesWidget;
