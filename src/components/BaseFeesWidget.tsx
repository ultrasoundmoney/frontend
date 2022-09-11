import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsAnnotations from "highcharts/modules/annotations";
import _merge from "lodash/merge";
import type { FC } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import colors from "../colors";
import type { Gwei } from "../eth-units";
import { formatBlockNumber } from "../format";
import type { BaseFeePoint } from "./Dashboard/SupplyGrowthSection";
import LabelText from "./TextsNext/LabelText";
import TimeFrameIndicator from "./TimeFrameIndicator";
import WidgetErrorBoundary from "./WidgetErrorBoundary";
import { WidgetBackground } from "./WidgetSubcomponents";

// Somehow resolves an error thrown by the annotation lib
if (typeof window !== "undefined") {
  // Initialize highchats annotations module (only on browser, doesn't work on server)
  highchartsAnnotations(Highcharts);
}

const baseOptions: Highcharts.Options = {
  accessibility: { enabled: false },
  chart: {
    resetZoomButton: {
      theme: {
        fill: colors.slateus600,
        style: {
          fontSize: "12",
          fontFamily: "Inter",
          fontWeight: "300",
          color: colors.white,
          textTransform: "lowercase"
          , border: `1px solid ${colors.slateus400}`
        },
        r: 4,
        zIndex: 20,
        states: { hover: { fill: "#343C56" } }
      }
    },
    zoomType: "x",
    backgroundColor: "transparent",
    showAxes: false,
    marginRight: 80,
    marginLeft: 28,
    marginTop: 14,
  },
  title: undefined,
  xAxis: {
    // type: "datetime",
    lineWidth: 0,
    labels: { enabled: false, style: { color: colors.slateus400 } },
    tickWidth: 0,
  },
  legend: {
    enabled: false,
  },
  tooltip: {
    backgroundColor: "transparent",
    useHTML: true,
    borderWidth: 4,
    shadow: false,
  },
  credits: { enabled: false },
  plotOptions: {
    series: {
      marker: {
        enabled: true,
        lineColor: "white",
        radius: 1,
        symbol: "circle",
      },
    },
  },
};

type Props = {
  barrier: Gwei | undefined;
  baseFeesSeries: BaseFeePoint[];
  baseFeesMap: Record<number, number>;
  max: number | undefined
};

const BaseFeesWidget: FC<Props> = ({
  barrier,
  baseFeesSeries,
  baseFeesMap,
  max,
}) => {
  // Setting lang has to happen before any chart render.
  useEffect(() => {
    if (Highcharts) {
      Highcharts.setOptions(
        {
          lang: {
            resetZoomTitle: undefined
          },
        }
      )
    }
  }, []);

  const options = useMemo(
    (): Highcharts.Options =>
      _merge(
        {},
        {
          ...baseOptions,
          ...({
            yAxis: {
              labels: {
                style: { color: colors.slateus400, fontFamily: "Roboto Mono" },
              },
              // min: barrier,
              // min: -(barrier ?? 0),
              // max: 60 - (barrier ?? 0),
              endOnTick: false,
              gridLineWidth: 0,
              plotLines: [
                {
                  color: colors.slateus500,
                  width: 1,
                  value: barrier,
                  zIndex: 10,
                  label: {
                    x: 76,
                    text: `${barrier?.toFixed(2)} Gwei 🦇🔊`,
                    useHTML: true,
                    align: "right",
                    formatter: () => `
                      <div class="flex -mt-0.5">
                        <div class="font-roboto font-light text-white">
                          ${barrier?.toFixed(1)}
                        </div>
                        <div class="font-roboto font-light text-slateus-400 ml-1">
                          Gwei
                        </div>
                      </div>
                      <div class="flex justify-center mt-1">
                        <img
                          alt="bat emoji, first-half of signifying 'ultra sound' gas barrier"
                          class="w-4 h-4"
                          src="/bat-own.svg"
                        />
                        <img
                          alt="speaker emoji, second-half of signifying 'ultra sound' gas barrier"
                          class="w-4 h-4 ml-1"
                          src="/speaker-own.svg"
                        />
                        <img
                          alt="speaker emoji, second-half of signifying 'ultra sound' gas barrier"
                          class="w-4 h-4 ml-1"
                          src="/barrier-own.svg"
                        />
                      </div>
                    `,
                  },
                },
              ],
            },
            series: [
              {
                id: "base-fees-over-area",
                type: "areaspline",
                yAxis: 0,
                threshold: barrier,
                data: baseFeesSeries.map(([time, value]) => [time, value]),
                lineWidth: 0,
                states: {
                  hover: {
                    lineWidthPlus: 0
                  }
                },
                color: "#E79800",
                fillColor: {
                  linearGradient: {
                    x1: 0,
                    y1: 1,
                    x2: 0,
                    y2: 0,
                  },
                  stops: [
                    [(barrier ?? 0) / (max ?? 1), "#EDDB3610"],
                    [1, "#E7980050"],
                  ],
                },
                negativeColor: colors.drop,
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
              },
            ],
            tooltip: {
              backgroundColor: "transparent",
              useHTML: true,
              borderWidth: 0,
              shadow: false,
              formatter: function() {
                const x = typeof this.x === "number" ? this.x : undefined;
                if (x === undefined) {
                  return undefined;
                }

                const total = baseFeesMap[x];
                if (total === undefined) {
                  return undefined;
                }

                const formattedDate = formatBlockNumber(x);

                return `
                <div class="font-roboto bg-slateus-700 p-4 rounded-lg border-2 border-slateus-200">
                <div class="text-blue-spindle">${formattedDate}</div>
                <div class="flex">
                <div class="text-white">
                ${total.toFixed(2)}
                </div>
                <div class="font-roboto font-light text-slateus-400 ml-1">Gwei</div>
                </div>
                </div>`;
              },
            },
          } as Highcharts.Options),
        },
      ),
    [barrier, baseFeesMap, baseFeesSeries],
  );

  return (
    <WidgetErrorBoundary title="base fees">
      <WidgetBackground className="relative w-full flex flex-col overflow-hidden h-[399px]">
        <div
          // will-change-transform is critical for mobile performance of rendering the chart overlayed on this element.
          className={`
            absolute -top-40 -right-0
            w-full h-full
            opacity-[0.25]
            blur-[110px]
            pointer-events-none
            will-change-transform
          `}
        >
          <div
            className={`
            absolute bottom-[3.0rem] -right-[1.0rem]
            w-3/5 h-2/5 rounded-[35%]
            bg-[#0037FA]
            pointer-events-none
          `}
          ></div>
        </div>
        <div className="flex justify-between items-baseline">
          <LabelText className="flex items-center min-h-[21px]">
            base fees
          </LabelText>
          <TimeFrameIndicator
            className="pointer-events-none"
            timeFrame="h1"
            onClickTimeFrame={() => undefined}
          />
        </div>
        <div
          // flex-grow fixes bug where highcharts doesn't take full width.
          className={`
            w-full mt-4 h-full
            flex justify-center
            select-none
            overflow-hidden
            [&>div]:flex-grow
          `}
        >
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
        <LabelText className="text-slateus-400 text-right">
          inspired by{" "}
          <a
            className="hover:underline"
            href="https://watchtheburn.com"
            rel="noreferrer"
            target="_blank"
          >
            watchtheburn.com
          </a>
        </LabelText>
      </WidgetBackground>
    </WidgetErrorBoundary>
  );
};

export default BaseFeesWidget;
