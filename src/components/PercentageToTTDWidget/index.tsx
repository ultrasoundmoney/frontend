import * as DateFns from "date-fns";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import _last from "lodash/last";
import type { FC } from "react";
import { useMemo } from "react";
import colors from "../../colors";
import * as Format from "../../format";
import LabelText from "../TextsNext/LabelText";
import WidgetErrorBoundary from "../WidgetErrorBoundary";
import { WidgetBackground } from "../WidgetSubcomponents";
import styles from "./PercentageToTTDGraph.module.scss";

type UnixTimestamp = number;
type Point = [UnixTimestamp, number];

const baseOptions: Highcharts.Options = {
  accessibility: { enabled: false },
  chart: {
    backgroundColor: "transparent",
    showAxes: false,
  },
  title: undefined,
  xAxis: {
    type: "datetime",
    tickInterval: 10 * 24 * 60 * 60 * 1000, // always use 1 year intervals
    min: 1659304800000,
    max: 1663624800000,
    lineWidth: 0,
    labels: { style: { color: colors.slateus200 } },
    tickWidth: 0,
  },
  yAxis: {
    min: 93,
    max: 100,
    // tickInterval: 20e6,
    title: { text: undefined },
    labels: { format: "{value}%", style: { color: colors.slateus200 } },
    gridLineWidth: 0,
  },
  legend: {
    enabled: false,
  },
  tooltip: {
    backgroundColor: "transparent",
    xDateFormat: "%Y-%m-%d",
    useHTML: true,
    borderWidth: 0,
    shadow: false,
  },
  credits: { enabled: false },
  plotOptions: {
    series: {
      // shadow: {
      //   color: "rgba(75, 144, 219, 0.2)",
      //   width: 15,
      // },
      marker: {
        enabled: false,
        lineColor: "white",
        fillColor: "#4B90DB",
        radius: 5,
        symbol: "circle",
      },
    },
  },
};

type Props = {
  difficultySeries: Point[];
  // A map used for fast-lookup of the Y in the series above by X.
  difficultyMap: Record<number, number>;
  difficultyProjectionSeries: Point[];
  // A map used for fast-lookup of the Y in the series above by X.
  difficultyProjectionMap: Record<number, number>;
};

const PercentageToTTDWidget: FC<Props> = ({
  difficultyMap,
  difficultyProjectionMap,
  difficultyProjectionSeries,
  difficultySeries,
}) => {
  console.log("rendering PercentageToTTDWidget");
  const options = useMemo(
    (): Highcharts.Options => ({
      ...baseOptions,
      ...({
        series: [
          {
            id: "difficulty-series",
            type: "line",
            data: difficultySeries,
            shadow: {
              color: "rgba(75, 144, 219, 0.2)",
              width: 15,
            },
            color: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 1,
                y2: 0,
              },
              stops: [
                [0, "#00FFFB"],
                [1, "#5487F4"],
              ],
            },
          },
          {
            id: "difficulty-projection-series",
            type: "line",
            dashStyle: "Dash",
            color: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 1,
                y2: 0,
              },
              stops: [
                [0, "#5487F4"],
                [1, "#6A54F4"],
              ],
            },
            data: [
              ...difficultyProjectionSeries,
              {
                x: _last(difficultyProjectionSeries)?.[0],
                y: _last(difficultyProjectionSeries)?.[1],
                marker: {
                  symbol: `url(/graph-dot-panda.svg)`,
                  enabled: true,
                },
              },
            ],
          },
          {
            id: "difficulty-projection-series-shadow",
            states: { hover: { enabled: false }, select: { enabled: false } },
            type: "line",
            color: {},
            shadow: {
              color: "rgba(75, 144, 219, 0.2)",
              width: 15,
            },
            data: difficultyProjectionSeries,
          },
        ],
        tooltip: {
          formatter: function () {
            const x = typeof this.x === "number" ? this.x : undefined;
            if (x === undefined) {
              return;
            }

            const total = difficultyMap[x] || difficultyProjectionMap[x];
            if (total === undefined) {
              return;
            }

            const dt = DateFns.fromUnixTime(x);
            const formattedDate = DateFns.format(dt, "LLL y");

            return `
            <div class="font-roboto font-light bg-slateus-700 p-4 rounded-lg border-2 border-slateus-200">
              <div class="text-blue-spindle">
                ${formattedDate}
              </div>
            <div class="text-white">
              ${Format.formatOneDecimal(
                total / 1e6,
              )}M <span class="text-blue-spindle">ETH</span>
              </div>
            </div>
            `;
          },
        },
      } as Highcharts.Options),
    }),
    [
      difficultyMap,
      difficultyProjectionMap,
      difficultyProjectionSeries,
      difficultySeries,
    ],
  );

  return (
    <WidgetErrorBoundary title="percentage to TTD">
      <WidgetBackground className="flex flex-col gap-y-8">
        <LabelText className="flex items-center min-h-[21px]">
          percentage to ttd
        </LabelText>
        <div
          className={`h-full flex justify-center select-none ${styles.percentageToTTDGraph}`}
        >
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </WidgetBackground>
    </WidgetErrorBoundary>
  );
};
export default PercentageToTTDWidget;
