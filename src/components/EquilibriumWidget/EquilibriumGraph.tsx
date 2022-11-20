import * as DateFns from "date-fns";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import _last from "lodash/last";
import merge from "lodash/merge";
import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import colors from "../../colors";
import * as Format from "../../format";
import { useActiveBreakpoint } from "../../utils/use-active-breakpoint";
import styles from "./EquilibriumGraph.module.scss";

type UnixTimestamp = number;
type Point = [UnixTimestamp, number];

const SUPPLY_MIN = 0;
const SUPPLY_MAX = 140e6;

const baseOptions: Highcharts.Options = {
  accessibility: { enabled: false },
  chart: {
    animation: false,
    backgroundColor: "transparent",
    showAxes: false,
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
    min: SUPPLY_MIN,
    max: SUPPLY_MAX,
    tickInterval: 20e6,
    title: { text: undefined },
    labels: { enabled: false },
    gridLineWidth: 0,
    plotLines: [
      {
        id: "equilibrium",
        color: colors.slateus200,
        label: {
          align: "right",
          text: "EQUILIBRIUM",
          style: { color: colors.slateus200 },
          y: 5,
          x: 20,
        },
        width: 2,
        zIndex: 10,
      },
      {
        id: "staking",
        color: colors.slateus200,
        label: {
          align: "right",
          text: "STAKING",
          style: { color: colors.slateus200 },
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
  supplyEquilibriumSeries: Point[];
  // A map used for fast-lookup of the Y in the series above by X.
  supplyEquilibriumMap: Record<number, number>;
  supplyEquilibrium: number;
  staking: number;
};

const EquilibriumGraph: FC<Props> = ({
  staking,
  supplyEquilibrium,
  supplyEquilibriumMap,
  supplyEquilibriumSeries,
}) => {
  const isRendering = useRef(true);
  const { lg, md, xl, xl2 } = useActiveBreakpoint();
  const width = xl2 ? 650 : xl ? 530 : lg ? 400 : md ? 570 : 280;
  const height = lg ? 320 : 200;
  const [options, setOptions] = useState<Highcharts.Options>(() =>
    merge({}, baseOptions, {
      chart: {
        events: {
          render: function () {
            isRendering.current = false;
          },
        },
      },
      series: [
        {
          id: "supply-series",
          type: "spline",
          data: [
            ...supplyEquilibriumSeries,
            {
              id: "equilibrium-final-point",
              x: _last(supplyEquilibriumSeries)?.[0],
              y: _last(supplyEquilibriumSeries)?.[1],
              marker: {
                symbol: `url(/dot_supply_graph.svg)`,
                enabled: true,
              },
            },
          ],
        },
      ],
    } as Highcharts.Options),
  );

  useEffect(() => {
    const nextOptions: Highcharts.Options = {
      chart: {
        width,
        height,
      },
      xAxis: {
        minPadding: 0.03,
      },
    };
    setOptions((currentOptions) => merge({}, currentOptions, nextOptions));
  }, [height, md, staking, supplyEquilibrium, width]);

  useEffect(() => {
    const lastPoint = _last(supplyEquilibriumSeries);
    if (lastPoint === undefined) {
      return;
    }

    const maxX = xl2
      ? DateFns.getUnixTime(
          DateFns.addYears(DateFns.fromUnixTime(lastPoint[0]), 80),
        )
      : xl
      ? DateFns.getUnixTime(
          DateFns.addYears(DateFns.fromUnixTime(lastPoint[0]), 100),
        )
      : lg
      ? DateFns.getUnixTime(
          DateFns.addYears(DateFns.fromUnixTime(lastPoint[0]), 140),
        )
      : md
      ? DateFns.getUnixTime(
          DateFns.addYears(DateFns.fromUnixTime(lastPoint[0]), 90),
        )
      : DateFns.getUnixTime(
          DateFns.addYears(DateFns.fromUnixTime(lastPoint[0]), 50),
        );

    const nextOptions: Highcharts.Options = {
      chart: {
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
              const widthReductionLeft = xl2
                ? 500
                : xl
                ? 380
                : lg
                ? 250
                : md
                ? 420
                : 230;
              const widthReductionRight = md ? 90 : 15;

              const newStartX = Number(dArr[1]) + widthReductionLeft;
              const newStopX = Number(dArr[4]) - widthReductionRight;
              dArr[1] = String(newStartX);
              dArr[4] = String(newStopX);

              svg.setAttribute("d", dArr.join(" "));
            });
          },
        },
      },
      series: [
        {
          id: "supply-series",
          type: "spline",
          // fillColor: {
          //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          //   linearGradient: [
          //     0,
          //     0,
          //     0,
          //     lg ? 280 : md ? 180 : 170,
          //   ] as unknown as Highcharts.LinearGradientColorObject,
          //   stops: [
          //     [0, "#5487F420"],
          //     [1, "#5487F400"],
          //   ],
          // },
          data: [
            ...supplyEquilibriumSeries,
            {
              x: _last(supplyEquilibriumSeries)?.[0],
              y: _last(supplyEquilibriumSeries)?.[1],
              marker: {
                symbol: `url(/dot_supply_graph.svg)`,
                enabled: true,
              },
            },
          ],
        },
      ],
      xAxis: {
        max: maxX,
      },
      yAxis: {
        max: Math.min(Math.max(SUPPLY_MAX, supplyEquilibrium), 600e6),
        plotLines: [
          {
            id: "equilibrium",
            value: supplyEquilibrium,
            label: {
              x: 10,
              text: md ? "EQUILIBRIUM" : "(A)",
            },
          },
          {
            id: "staking",
            value: staking,
            label: {
              x: md ? -19 : 10,
              y: 4,
              text: md ? "STAKING" : "(B)",
            },
          },
        ],
      },
      tooltip: {
        formatter: function () {
          const x = typeof this.x === "number" ? this.x : undefined;
          if (x === undefined) {
            return;
          }

          const total = supplyEquilibriumMap[x];
          if (total === undefined) {
            return;
          }

          const dt = DateFns.fromUnixTime(x);
          const formattedDate = DateFns.format(dt, "LLL y");

          return `
            <div class="font-roboto font-light bg-slateus-700 p-4 rounded-lg border-2 border-slateus-200">
              <div class="text-slateus-200">
                ${formattedDate}
              </div>
              <div class="text-white">
                ${Format.formatOneDecimal(
                  total / 1e6,
                )}M <span class="text-slateus-200">ETH</span>
              </div>
            </div>
          `;
        },
      },
    };

    if (!isRendering.current) {
      isRendering.current = true;
      setOptions((currentOptions) => merge({}, currentOptions, nextOptions));
    }
  }, [
    lg,
    md,
    staking,
    supplyEquilibrium,
    supplyEquilibriumMap,
    supplyEquilibriumSeries,
    xl,
    xl2,
  ]);

  return (
    <div
      className={`flex select-none justify-center ${styles.equilibriumChart}`}
    >
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
export default EquilibriumGraph;
