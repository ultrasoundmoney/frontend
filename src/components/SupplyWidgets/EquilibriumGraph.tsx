import * as DateFns from "date-fns";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import _ from "lodash";
import { FC, useMemo } from "react";
import { formatOneDigit } from "../../format";
import { NEA } from "../../fp";
import { formatDate } from "../../utils/metric-utils";
import styles from "./EquilibriumGraph.module.scss";

export type Point = [number, number];

const defaultOptions: Highcharts.Options = {
  chart: {
    animation: false,
    backgroundColor: "transparent",
    showAxes: false,
  },
  title: undefined,
  xAxis: {
    type: "datetime",
    minPadding: 0.43,
    maxPadding: 0.5,
    tickInterval: 365.25 * 24 * 3600 * 1000, // always use 1 year intervals
    lineWidth: 0,
    labels: { enabled: false },
    tickWidth: 0,
  },
  yAxis: {
    min: 0,
    max: 160e6,
    tickInterval: 20e6,
    title: { text: undefined },
    labels: { enabled: false },
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
      color: {
        linearGradient: {
          x1: 0,
          y1: 1,
          x2: 1,
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
      marker: {
        lineColor: "white",
        fillColor: "#4B90DB",
        radius: 5,
        symbol: "circle",
      },
    },
  },
};

type Props = {
  supplyEquilibriumSeries: NEA.NonEmptyArray<Point>;
  // A map used for fast-lookup of the Y in the series above by X.
  supplyEquilibriumMap: Record<number, number>;
  widthMin?: number;
  widthMax?: number;
  height: number;
};
const EquilibriumGraph: FC<Props> = ({
  height,
  supplyEquilibriumMap,
  supplyEquilibriumSeries,
  widthMax = 0.7,
  widthMin = 0.65,
}) => {
  const options = useMemo((): Highcharts.Options => {
    const nextOptions: Highcharts.Options = {
      chart: { height },
      xAxis: {
        maxPadding: widthMax,
        minPadding: widthMin,
      },
      series: [
        {
          type: "spline",
          data: [
            ...supplyEquilibriumSeries,
            //end point
            {
              x: NEA.last(supplyEquilibriumSeries)[0],
              y: NEA.last(supplyEquilibriumSeries)[1],
              marker: {
                symbol: `url(/dot_supply_graph.svg)`,
                enabled: true,
              },
            },
          ],
        },
      ],
      tooltip: {
        formatter: function () {
          const x = typeof this.x === "number" ? this.x : undefined;
          if (x === undefined) {
            return;
          }

          const dt = DateFns.fromUnixTime(x);
          const header = `<div class="tt-header"><div class="tt-header-date text-blue-spindle">${formatDate(
            dt,
          )}</div></div>`;

          const total = supplyEquilibriumMap[x];
          if (total === undefined) {
            return;
          }

          const table = `<table><tbody><tr class="tt-total-row">
              <td class="text-white">${formatOneDigit(
                total / 1e6,
              )}M <span class="text-blue-spindle">ETH</span></td>
            </tr></tbody></table>`;

          return `<div class="tt-root">${header}${table}</div>`;
        },
      },
    };

    return _.merge({}, defaultOptions, nextOptions);
  }, [
    height,
    supplyEquilibriumMap,
    supplyEquilibriumSeries,
    widthMax,
    widthMin,
  ]);

  return (
    <div className={`${styles.equilibriumChart}`}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
export default EquilibriumGraph;
