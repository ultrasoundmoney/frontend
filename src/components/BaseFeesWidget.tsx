import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsAnnotations from "highcharts/modules/annotations";
import _merge from "lodash/merge";
import type { FC } from "react";
import { useMemo } from "react";
import colors from "../colors";
import { Gwei } from "../eth-units";
import { formatBlockNumber } from "../format";
import type { BaseFeePoint } from "./Dashboard/SupplyGrowthSection";
import LabelText from "./TextsNext/LabelText";
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
    backgroundColor: "transparent",
    showAxes: false,
    marginRight: 80,
    marginLeft: 28,
  },
  title: undefined,
  xAxis: {
    // type: "datetime",
    lineWidth: 0,
    labels: { enabled: false, style: { color: colors.slateus400 } },
    tickWidth: 0,
  },
  yAxis: {},
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
        // fillColor: "#4B90DB",
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
};

const BaseFeesWidget: FC<Props> = ({
  barrier,
  baseFeesSeries: baseFeesSeriesOver,
  baseFeesMap,
}) => {
  const options = useMemo((): Highcharts.Options => {
    return _merge(
      {},
      {
        ...baseOptions,
        ...({
          yAxis: {
            plotLines: [
              {
                color: colors.slateus400,
                width: 1,
                value: barrier, // Need to set this probably as a var.
                zIndex: 10,
                label: {
                  x: 76,
                  text: `${barrier?.toFixed(2)} Gwei 🦇🔊`,
                  useHTML: true,
                  align: "right",
                  formatter: () =>
                    `
                      <div class="flex">
                        <div class="font-roboto font-light text-white">
                          ${barrier?.toFixed(2)}
                        </div>
                        <div class="font-roboto font-light text-slateus-400 ml-1">
                          Gwei
                        </div>
                      </div>
                      <div class="flex justify-center">
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
                      </div>
                    `,
                },
              },
            ],
            gridLineWidth: 0,
            labels: {
              style: { color: colors.slateus400, fontFamily: "Roboto Mono" },
            },
            title: { text: undefined },
          },
          series: [
            {
              id: "base-fees-over",
              type: "scatter",
              data: baseFeesSeriesOver,
              color: colors.fireOrange,
              threshold: barrier,
              negativeColor: colors.drop,
              // color: {
              //   linearGradient: {
              //     x1: 0,
              //     y1: 0,
              //     x2: 1,
              //     y2: 0,
              //   },
              //   stops: [
              //     [0, "#00FFFB"],
              //     [1, "#5487F4"],
              //   ],
              // },
            },
            // {
            //   id: "base-fees-over-area",
            //   type: "area",
            //   data: baseFeesSeriesOver,
            //   // color: colors.fireOrange,
            //   fillOpacity: 0.05,
            //   lineWidth: 0,
            //   color: {
            //     linearGradient: {
            //       x1: 0,
            //       y1: 0,
            //       x2: 1,
            //       y2: 0,
            //     },
            //     stops: [
            //       [0, "#E79800"],
            //       [1, "#EDDB36"],
            //     ],
            //   },
            //   opacity: 0.2,
            // },
            // {
            //   id: "base-fees-under",
            //   type: "scatter",
            //   data: baseFeesSeriesUnder,
            //   color: colors.drop,
            //   // shadow: {
            //   //   color: "rgba(75, 144, 219, 0.2)",
            //   //   width: 15,
            //   // },
            //   // color: {
            //   //   linearGradient: {
            //   //     x1: 0,
            //   //     y1: 0,
            //   //     x2: 1,
            //   //     y2: 0,
            //   //   },
            //   //   stops: [
            //   //     [0, "#00FFFB"],
            //   //     [1, "#5487F4"],
            //   //   ],
            //   // },
            // },
          ],
          tooltip: {
            backgroundColor: "transparent",
            useHTML: true,
            borderWidth: 0,
            shadow: false,
            formatter: function () {
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
    );
  }, [barrier, baseFeesMap, baseFeesSeriesOver]);

  return (
    <WidgetErrorBoundary title="base fees">
      <WidgetBackground className="relative w-full flex flex-col overflow-hidden">
        <div
          // will-change-transform is critical for mobile performance of rendering the chart overlayed on this element.
          className={`
            absolute -top-40 -right-0
            w-full h-full
            opacity-[0.20]
            blur-[120px]
            pointer-events-none
            will-change-transform
          `}
        >
          <div
            className={`
            absolute lg:bottom-[3.0rem] lg:-right-[1.0rem]
            w-4/5 h-3/5 rounded-[35%]
            bg-[#0037FA]
            pointer-events-none
          `}
          ></div>
        </div>
        <LabelText className="flex items-center min-h-[21px]">
          base fees
        </LabelText>
        <div
          // flex-grow fixes bug where highcharts doesn't take full width.
          className={`
            w-full h-64 mt-4
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
