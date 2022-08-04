import * as DateFns from "date-fns";
import Highcharts, { Axis } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import _ from "lodash";
import { FC, useMemo } from "react";
import colors from "../../colors";
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
    events: {
      redraw: function () {
        const yAxis0 = this.yAxis[0] as Highcharts.Axis & {
          plotLinesAndBands: { svgElem: { element: SVGElement } }[];
        };

        yAxis0.plotLinesAndBands.forEach(function (lineOrBand) {
          const svg = lineOrBand.svgElem.element;
          const d = svg.getAttribute("d");
          if (d === null) {
            return;
          }
          const dArr = d.split(" ");
          const widthReduction = 200;

          const newStartX = Number(dArr[1]) + widthReduction;
          dArr[1] = String(newStartX);

          svg.setAttribute("d", dArr.join(" "));
        });
      },
    },
  },
  title: undefined,
  xAxis: {
    type: "datetime",
    tickInterval: 365.25 * 24 * 3600 * 1000, // always use 1 year intervals
    lineWidth: 0,
    labels: { enabled: false },
    tickWidth: 0,
  },
  yAxis: {
    min: 10e6,
    max: 200e6,
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
          y1: 0,
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
  supplyEquilibrium: number;
  widthMin?: number;
  widthMax?: number;
  staking: number;
  height: number;
  width: number;
};

const EquilibriumGraph: FC<Props> = ({
  height,
  supplyEquilibriumMap,
  supplyEquilibrium,
  supplyEquilibriumSeries,
  staking,
  widthMax = 0,
  widthMin = 0,
  width,
}) => {
  const options = useMemo((): Highcharts.Options => {
    const nextOptions: Highcharts.Options = {
      chart: { width: width, height },
      series: [
        {
          type: "spline",
          data: [
            ...supplyEquilibriumSeries.slice(
              supplyEquilibriumSeries.length - 200,
            ),
            //end point
            {
              x: supplyEquilibriumSeries[supplyEquilibriumSeries.length - 1][0],
              y: supplyEquilibriumSeries[supplyEquilibriumSeries.length - 1][1],
              marker: {
                symbol: `url(/dot_supply_graph.svg)`,
                enabled: true,
              },
            },
          ],
          dashStyle: "Dash",
        },
        {
          type: "spline",
          data: [
            ...supplyEquilibriumSeries.slice(
              0,
              supplyEquilibriumSeries.length - 200,
            ),
          ],
        },
      ],
      yAxis: {
        plotLines: [
          {
            color: colors.spindle,
            label: {
              align: "right",
              text: "EQUILIBRIUM",
              style: { color: colors.spindle },
              y: 18,
              x: 1,
            },
            value: supplyEquilibrium,
            width: 2,
          },
          {
            color: colors.spindle,
            label: {
              align: "right",
              text: "STAKING",
              style: { color: colors.spindle },
              y: 18,
              x: 1,
            },
            value: staking,
            width: 2,
          },
        ],
      },
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
    staking,
    supplyEquilibrium,
    supplyEquilibriumMap,
    supplyEquilibriumSeries,
    width,
  ]);

  return (
    <div className={`${styles.equilibriumChart}`}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
export default EquilibriumGraph;
