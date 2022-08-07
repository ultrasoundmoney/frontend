import * as DateFns from "date-fns";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import _ from "lodash";
import { FC, useEffect, useRef, useState } from "react";
import colors from "../../colors";
import * as Format from "../../format";
import { NEA } from "../../fp";
import { formatDate } from "../../utils/metric-utils";
import styles from "./EquilibriumGraph.module.scss";

export type Point = [number, number];

const baseOptions: Highcharts.Options = {
  accessibility: { enabled: false },
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
    plotLines: [
      {
        id: "equilibrium",
        color: colors.spindle,
        label: {
          align: "right",
          text: "EQUILIBRIUM",
          style: { color: colors.spindle },
          y: 18,
          x: 1,
        },
        width: 2,
        zIndex: 10,
      },
      {
        id: "staking",
        color: colors.spindle,
        label: {
          align: "right",
          text: "STAKING",
          style: { color: colors.spindle },
          y: 18,
          x: 1,
        },
        width: 2,
        zIndex: 10,
      },
    ],
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
  width,
}) => {
  const isRendering = useRef(true);
  const [options, setOptions] = useState<Highcharts.Options>(() =>
    _.merge({}, baseOptions, {
      chart: {
        events: {
          render: function () {
            isRendering.current = false;
          },
        },
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
              <td class="text-white">${Format.formatOneDecimal(
                total / 1e6,
              )}M <span class="text-blue-spindle">ETH</span></td>
            </tr></tbody></table>`;

          return `<div class="tt-root">${header}${table}</div>`;
        },
      },
      series: [
        {
          id: "supply-series",
          type: "spline",
          data: [
            ...supplyEquilibriumSeries,
            {
              x: _.last(supplyEquilibriumSeries)?.[0],
              y: _.last(supplyEquilibriumSeries)?.[1],
              marker: {
                symbol: `url(/dot_supply_graph.svg)`,
                enabled: true,
              },
            },
          ],
        },
      ],
      yAxis: {
        plotLines: [
          { id: "equilibrium", value: supplyEquilibrium },
          { id: "staking", value: staking },
        ],
      },
    } as Highcharts.Options),
  );

  useEffect(() => {
    const nextOptions: Highcharts.Options = {
      chart: {
        width,
        height,
      },
    };
    setOptions((currentOptions) => _.merge({}, currentOptions, nextOptions));
  }, [height, width]);

  useEffect(() => {
    const nextOptions: Highcharts.Options = {
      series: [
        {
          id: "supply-series",
          type: "spline",
          data: [
            ...supplyEquilibriumSeries,
            {
              x: _.last(supplyEquilibriumSeries)?.[0],
              y: _.last(supplyEquilibriumSeries)?.[1],
              marker: {
                symbol: `url(/dot_supply_graph.svg)`,
                enabled: true,
              },
            },
          ],
        },
      ],
      yAxis: {
        plotLines: [
          {
            value: supplyEquilibrium,
          },
          {
            value: staking,
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
              <td class="text-white">${Format.formatOneDecimal(
                total / 1e6,
              )}M <span class="text-blue-spindle">ETH</span></td>
            </tr></tbody></table>`;

          return `<div class="tt-root">${header}${table}</div>`;
        },
      },
    };

    if (!isRendering.current) {
      isRendering.current = true;
      setOptions((currentOptions) => _.merge({}, currentOptions, nextOptions));
    }
  }, [
    staking,
    supplyEquilibrium,
    supplyEquilibriumMap,
    supplyEquilibriumSeries,
  ]);

  return (
    <div className={`${styles.equilibriumChart}`}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
export default EquilibriumGraph;
