import { addMinutes, format } from "date-fns";
import type { TooltipFormatterCallbackFunction } from "highcharts";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsAnnotations from "highcharts/modules/annotations";
import _last from "lodash/last";
import _merge from "lodash/merge";
import type { FC } from "react";
import { useMemo } from "react";
import type { MergeStatus } from "../../api/merge-status";
import { useMergeStatus } from "../../api/merge-status";
import type { SupplyAtTime } from "../../api/supply-since-merge";
import { useSupplySinceMerge } from "../../api/supply-since-merge";
import colors from "../../colors";
import { MERGE_TIMESTAMP } from "../../eth-constants";
import {
  formatPercentTwoDecimals,
  formatTwoDigit,
  formatZeroDecimals,
} from "../../format";
import { posIssuancePerDay, powIssuancePerDay } from "../../static-ether-data";
import type { SupplyPoint } from "../Dashboard/SupplySection";
import SimulateProofOfWork from "../SimulateProofOfWork";
import SinceMergeIndicator from "../SinceMergeIndicator";
import LabelText from "../TextsNext/LabelText";
import UpdatedAgo from "../UpdatedAgo";
import WidgetErrorBoundary from "../WidgetErrorBoundary";
import { WidgetBackground } from "../WidgetSubcomponents";

// Somehow resolves an error thrown by the annotation lib
if (typeof window !== "undefined") {
  // Initialize highchats annotations module (only on browser, doesn't work on server)
  highchartsAnnotations(Highcharts);
}

const SUPPLY_SINCE_MERGE_SERIES_ID = "supply-since-merge-series";
const SUPPLY_SINCE_MERGE_POW_SERIES_ID = "supply-since-merge-pow-series";
const BITCOIN_SUPPLY_ID = "bitcoin-supply-since-merge-series";

const BITCOIN_SUPPLY_AT_MERGE = 19_152_350;
const POW_ISSUANCE_PER_DAY = powIssuancePerDay - posIssuancePerDay;
const SLOTS_PER_DAY = 24 * 60 * 5;

const baseOptions: Highcharts.Options = {
  accessibility: { enabled: false },
  chart: {
    marginLeft: 0,
    marginRight: 64,
    marginTop: 10,
    backgroundColor: "transparent",
    showAxes: false,
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
          states: { hover: { fill: "#343C56" } },
        },
      },
    },
  },
  title: undefined,
  yAxis: {
    title: { text: undefined },
    labels: {
      enabled: true,
    },
    gridLineWidth: 0,
  },
  xAxis: {
    type: "datetime",
    lineWidth: 0,
    labels: {
      style: { color: colors.slateus400 },
      enabled: false,
    },
    tickWidth: 0,
    minPadding: 0.04,
    maxPadding: 0.04,
  },
  legend: {
    enabled: true,
    useHTML: true,
    symbolWidth: 0,
    labelFormatter: function () {
      const color =
        this.index === 0
          ? "bg-[#62A2F3]"
          : this.index === 1
          ? "bg-[#FF891D]"
          : "bg-[#DEE2F1]";
      return `
        <div class="flex flex-row items-center gap-x-2">
          <div class="w-2 h-2 ${color} rounded-full"></div>
          <div class="font-roboto font-normal text-slateus-400 text-xs">
            ${this.name}
          </div>
        </div>
      `;
    },
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
      events: {
        legendItemClick: function () {
          return false;
        },
      },
      marker: {
        lineColor: "white",
        radius: 3,
        symbol: "circle",
      },
    },
  },
};

type PointMap = Record<number, number>;

const getTooltip = (
  bitcoinSupplySeriesMap: PointMap,
  mergeStatus: MergeStatus,
  simulateProofOfWork: boolean,
  supplySinceMergeMap: PointMap,
  supplySinceMergePowMap: PointMap,
): TooltipFormatterCallbackFunction =>
  function () {
    const x = typeof this.x === "number" ? this.x : undefined;
    if (x === undefined) {
      return undefined;
    }

    const type =
      this.series.userOptions.id === SUPPLY_SINCE_MERGE_SERIES_ID
        ? "pos"
        : this.series.userOptions.id === SUPPLY_SINCE_MERGE_POW_SERIES_ID
        ? "pow"
        : "bitcoin";

    // Hack in showing the right graphs' points.
    const pointMap =
      type === "pos"
        ? supplySinceMergeMap
        : type === "pow"
        ? supplySinceMergePowMap
        : bitcoinSupplySeriesMap;

    const total =
      type === "bitcoin"
        ? (pointMap[x] / mergeStatus.supply) * BITCOIN_SUPPLY_AT_MERGE
        : pointMap[x];
    if (total === undefined) {
      return undefined;
    }

    const dt = new Date(x);
    const formattedDate = format(dt, "iii MMM dd");
    const formattedTime = format(dt, "HH:mm:ss 'UTC'x");

    let supplyDelta = undefined;
    if (x >= new Date(mergeStatus.timestamp).getTime()) {
      if (this.series.userOptions.id === BITCOIN_SUPPLY_ID) {
        supplyDelta = total - BITCOIN_SUPPLY_AT_MERGE;
      } else {
        supplyDelta = total - mergeStatus.supply;
      }
    }

    const supplyDeltaFormatted =
      supplyDelta !== undefined ? formatTwoDigit(supplyDelta) : undefined;

    const gradientCss =
      supplyDelta !== undefined && supplyDelta <= 0
        ? "from-orange-400 to-yellow-300"
        : "from-cyan-300 to-indigo-500";

    const title =
      this.series.userOptions.id === SUPPLY_SINCE_MERGE_SERIES_ID
        ? "ETH"
        : this.series.userOptions.id === SUPPLY_SINCE_MERGE_POW_SERIES_ID
        ? "ETH (PoW)"
        : "BTC";

    const unit = type === "bitcoin" ? "BTC" : "ETH";

    return `
    <div class="font-roboto bg-slateus-700 p-4 rounded-lg border-2 border-slateus-200">
      ${
        !simulateProofOfWork
          ? ""
          : `<div class="mb-2 text-slateus-400">${title}</div>`
      }
      <div class="text-slateus-400 text-right">${formattedDate}</div>
      <div class="text-slateus-400 text-right">${formattedTime}</div>
      <div class="flex flex-col items-end mt-2">
        <div class="text-white">
          ${formatTwoDigit(total)}
          <span class="text-slateus-400"> ${unit}</span>
        </div>
        <div class="
          ${supplyDelta === undefined ? "hidden" : ""}
          text-transparent bg-clip-text bg-gradient-to-r ${gradientCss}
        ">
          ${
            supplyDelta !== undefined && supplyDelta >= 0 ? "+" : ""
          }${supplyDeltaFormatted}
          <span class="text-slateus-400"> ${unit}</span>
        </div>
      </div>
    </div>
  `;
  };

const makeIssuanceLabel = (
  mostRecentSupply: number,
  supplyAtTheMerge: number,
  millisecondsSinceMerge: number,
) =>
  function () {
    const daysSinceMerge = millisecondsSinceMerge / 1000 / 60 / 60 / 24;
    const value =
      (((mostRecentSupply - supplyAtTheMerge) / daysSinceMerge) * 365.25) /
      supplyAtTheMerge;
    const formatted = formatPercentTwoDecimals(value);
    return `
      <div class="flex flex-row items-center gap-x-2">
        <div class="w-2 h-2 rounded-full"></div>
        <div class="font-roboto font-light text-slateus-400 text-xs">
          <span class="text-white">+${formatted}</span>/y
        </div>
      </div>
    `;
  };

const btcSupplyFromEthProjection = (ethProjection: number, ethSupply: number) =>
  (ethProjection / ethSupply) * BITCOIN_SUPPLY_AT_MERGE;

type Props = {
  simulateProofOfWork: boolean;
  onSimulateProofOfWork: () => void;
};

const SupplySinceMergeWidget: FC<Props> = ({
  simulateProofOfWork,
  onSimulateProofOfWork,
}) => {
  const mergeStatus = useMergeStatus();
  const supplySinceMerge = useSupplySinceMerge();

  const pointFromSupplyAtTime = (supplyAtTime: SupplyAtTime): SupplyPoint => [
    new Date(supplyAtTime.timestamp).getTime(),
    supplyAtTime.supply,
  ];

  const supplySinceMergeSeries = useMemo(
    () =>
      supplySinceMerge === undefined
        ? undefined
        : supplySinceMerge.supply_by_hour.map(
            (point): SupplyPoint => [
              new Date(point.timestamp).getTime(),
              point.supply,
            ],
          ),
    [supplySinceMerge],
  );

  const supplySinceMergePowSeries = useMemo(
    () =>
      supplySinceMerge === undefined
        ? undefined
        : supplySinceMerge.supply_by_hour.reduce(
            (points: SupplyPoint[], point) => {
              const timestamp = new Date(point.timestamp).getTime();

              if (timestamp <= MERGE_TIMESTAMP.getTime()) {
                return points;
              }

              const lastPoint = _last(points);
              if (lastPoint === undefined) {
                return [pointFromSupplyAtTime(point)];
              }

              const slotsSinceMerge =
                (new Date(point.timestamp).getTime() -
                  MERGE_TIMESTAMP.getTime()) /
                1000 /
                12;

              const simulatedPowIssuanceSinceMerge =
                (slotsSinceMerge * POW_ISSUANCE_PER_DAY) / SLOTS_PER_DAY;

              const nextSupply = point.supply + simulatedPowIssuanceSinceMerge;

              const nextPoint: SupplyPoint = [timestamp, nextSupply];

              return [...points, nextPoint];
            },
            [],
          ),
    [supplySinceMerge],
  );

  const supplyPosMax = useMemo(
    () =>
      supplySinceMergeSeries === undefined
        ? undefined
        : supplySinceMergeSeries.reduce((pointA, pointB) =>
            pointA[1] > pointB[1] ? pointA : pointB,
          )[1],
    [supplySinceMergeSeries],
  );

  const supplyPosMin = useMemo(
    () =>
      supplySinceMergeSeries === undefined
        ? undefined
        : supplySinceMergeSeries.reduce((pointA, pointB) =>
            pointA[1] < pointB[1] ? pointA : pointB,
          )[1],
    [supplySinceMergeSeries],
  );

  const supplyPowMax = useMemo(
    () =>
      supplySinceMergePowSeries === undefined
        ? undefined
        : supplySinceMergePowSeries.reduce((pointA, pointB) =>
            pointA[1] > pointB[1] ? pointA : pointB,
          )[1],
    [supplySinceMergePowSeries],
  );

  const bitcoinSupplySeries = useMemo(() => {
    if (supplySinceMergeSeries === undefined) {
      return undefined;
    }

    const last = supplySinceMergeSeries[supplySinceMergeSeries.length - 1];
    const points = [];
    let timestamp = supplySinceMergeSeries[0][0];
    const supplyBeforeMerge =
      ((MERGE_TIMESTAMP.getTime() - timestamp) / 1000 / 60 / 10) * 6.25;
    let bitcoinSupply = BITCOIN_SUPPLY_AT_MERGE - supplyBeforeMerge;
    while (timestamp < last[0]) {
      const bitcoinSupplyRescaled =
        (bitcoinSupply / BITCOIN_SUPPLY_AT_MERGE) * mergeStatus.supply;

      points.push([timestamp, bitcoinSupplyRescaled] as SupplyPoint);

      bitcoinSupply = bitcoinSupply + 6.25;
      timestamp = addMinutes(timestamp, 10).getTime();
    }

    return points;
  }, [mergeStatus, supplySinceMergeSeries]);

  const options = useMemo((): Highcharts.Options => {
    const lastPointPos = _last(supplySinceMergeSeries);
    const lastPointBtc = _last(bitcoinSupplySeries);
    const lastPointPow = _last(supplySinceMergePowSeries);

    const supplySinceMergeMap = Object.fromEntries(
      new Map(supplySinceMergeSeries ?? []).entries(),
    );

    const supplySinceMergePowMap = Object.fromEntries(
      new Map(supplySinceMergePowSeries ?? []).entries(),
    );

    const bitcoinSupplySeriesMap = Object.fromEntries(
      new Map(bitcoinSupplySeries ?? []).entries(),
    );

    return _merge({}, baseOptions, {
      legend: {
        enabled: simulateProofOfWork,
      },
      yAxis: {
        endOnTick: false,
        alignTicks: false,
        startOnTick: false,
        min:
          supplyPosMin === undefined || supplyPowMax === undefined
            ? undefined
            : simulateProofOfWork
            ? supplyPosMin - (supplyPowMax - supplyPosMin) * 0.15
            : undefined,
        max:
          supplyPosMin === undefined || supplyPosMax === undefined
            ? undefined
            : !simulateProofOfWork
            ? supplyPosMax + (supplyPosMax - supplyPosMin) * 0.15
            : undefined,
        plotLines: [
          {
            id: "merge-supply",
            value: mergeStatus.supply,
            color: colors.slateus400,
            width: 1,
            label: {
              x: 32,
              y: 4,
              style: { color: colors.slateus400 },
            },
          },
          {
            id: "bitcoin-issuance",
            value: lastPointBtc === undefined ? undefined : lastPointBtc[1],
            width: 0,
            label: {
              style: {
                fontSize: "12",
                fontFamily: "Roboto mono",
                fontWeight: "300",
                color: colors.slateus400,
              },
              align: "right",
              x: 64,
              y: 2,
              useHTML: true,
              formatter:
                lastPointBtc === undefined
                  ? undefined
                  : makeIssuanceLabel(
                      btcSupplyFromEthProjection(
                        lastPointBtc[1],
                        mergeStatus.supply,
                      ),
                      BITCOIN_SUPPLY_AT_MERGE,
                      lastPointBtc[0] - MERGE_TIMESTAMP.getTime(),
                    ),
            },
          },
          {
            id: "eth-issuance-pos",
            value: lastPointPos === undefined ? undefined : lastPointPos[1],
            width: 0,
            label: {
              style: {
                fontSize: "12",
                fontFamily: "Roboto mono",
                fontWeight: "300",
                color: colors.slateus400,
              },
              align: "right",
              x: 64,
              y: 2,
              useHTML: true,
              formatter:
                lastPointPos === undefined
                  ? undefined
                  : makeIssuanceLabel(
                      lastPointPos[1],
                      mergeStatus.supply,
                      lastPointPos[0] - MERGE_TIMESTAMP.getTime(),
                    ),
            },
          },
          {
            id: "eth-issuance-pow",
            value: lastPointPow === undefined ? undefined : lastPointPow[1],
            width: 0,
            label: {
              style: {
                fontSize: "12",
                fontFamily: "Roboto mono",
                fontWeight: "300",
                color: colors.slateus400,
              },
              align: "right",
              x: 64,
              y: 2,
              useHTML: true,
              formatter:
                lastPointPow === undefined
                  ? undefined
                  : makeIssuanceLabel(
                      lastPointPow[1],
                      mergeStatus.supply,
                      lastPointPow[0] - MERGE_TIMESTAMP.getTime(),
                    ),
            },
          },
        ],
      },
      xAxis: {
        plotLines: [
          {
            id: "merge-plotline",
            value: MERGE_TIMESTAMP.getTime(),
            color: colors.slateus400,
            width: 1,
            label: {
              x: 10,
              y: 54,
              style: { color: colors.slateus400 },
              align: "center",
              useHTML: true,
              formatter: () => `
                <div class="flex">
                  <div class="font-roboto font-light text-slateus-300">
                  #${formatZeroDecimals(mergeStatus.block_number)}
                  </div>
                  <img
                    class="w-4 h-4 ml-2"
                    src="/panda-own.svg"
                  />
                </div>
              `,
            },
          },
        ],
      },
      series: [
        {
          id: SUPPLY_SINCE_MERGE_SERIES_ID,
          type: "line",
          name: "ETH",
          data:
            lastPointPos !== undefined && supplySinceMergeSeries !== undefined
              ? [
                  ...supplySinceMergeSeries,
                  {
                    x: lastPointPos?.[0],
                    y: lastPointPos?.[1],
                    marker: {
                      id: "supply-by-minute-final-point",
                      symbol: `url(/graph-dot-blue.svg)`,
                      enabled: true,
                    },
                  },
                ]
              : undefined,
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
          color: simulateProofOfWork ? "#FF891D" : "transparent",
          enableMouseTracking: simulateProofOfWork,
          id: BITCOIN_SUPPLY_ID,
          type: "line",
          shadow: {
            color: simulateProofOfWork ? "#FF891D33" : "transparent",
            width: 15,
          },
          data:
            bitcoinSupplySeries === undefined
              ? undefined
              : [
                  ...bitcoinSupplySeries,
                  {
                    x: lastPointBtc?.[0],
                    y: lastPointBtc?.[1],
                    marker: {
                      id: "bitcoin-supply-final-point",
                      symbol: `url(/graph-dot-bitcoin.svg)`,
                      enabled: true,
                    },
                  },
                ],
          name: "BTC",
          showInLegend: simulateProofOfWork,
        },
        {
          color: simulateProofOfWork ? colors.slateus100 : "transparent",
          dashStyle: "Dash",
          enableMouseTracking: simulateProofOfWork,
          id: SUPPLY_SINCE_MERGE_POW_SERIES_ID,
          name: "ETH (PoW)",
          showInLegend: simulateProofOfWork,
          type: "line",
          data:
            supplySinceMergePowSeries === undefined
              ? undefined
              : [
                  ...supplySinceMergePowSeries,
                  {
                    x: lastPointPow?.[0],
                    y: lastPointPow?.[1],
                    marker: {
                      id: "supply-by-minute-final-point",
                      symbol: `url(/graph-dot-white.svg)`,
                      enabled: true,
                    },
                  },
                ],
        },
        {
          color: "transparent",
          data: supplySinceMergePowSeries,
          enableMouseTracking: false,
          showInLegend: false,
          states: { hover: { enabled: false } },
          shadow: {
            color: simulateProofOfWork ? "#DEE2F133" : "transparent",
            width: 15,
          },
        },
      ],
      tooltip: {
        backgroundColor: "transparent",
        useHTML: true,
        borderWidth: 0,
        shadow: false,
        formatter: getTooltip(
          bitcoinSupplySeriesMap,
          mergeStatus,
          simulateProofOfWork,
          supplySinceMergeMap,
          supplySinceMergePowMap,
        ),
      },
    } as Highcharts.Options);
  }, [
    supplySinceMergeSeries,
    bitcoinSupplySeries,
    supplySinceMergePowSeries,
    simulateProofOfWork,
    supplyPosMin,
    supplyPowMax,
    supplyPosMax,
    mergeStatus,
  ]);

  return (
    <WidgetErrorBoundary title="eth supply">
      <WidgetBackground className="relative flex w-full flex-col overflow-hidden">
        <div
          // will-change-transform is critical for mobile performance of rendering the chart overlayed on this element.
          className={`
            pointer-events-none absolute -left-36
            -top-40 h-full
            w-full
            opacity-[0.20]
            blur-[120px]
            will-change-transform
          `}
        >
          <div
            className={`
            pointer-events-none absolute h-3/5
            w-4/5 rounded-[35%] bg-[#0037FA]
            lg:bottom-[3.0rem]
            lg:-right-[1.0rem]
          `}
          ></div>
        </div>
        <div className="flex justify-between">
          <LabelText className="flex items-center">eth supply</LabelText>
          <SinceMergeIndicator />
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
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-4">
          <UpdatedAgo updatedAt={supplySinceMerge?.timestamp} />
          <SimulateProofOfWork
            checked={simulateProofOfWork}
            onToggle={onSimulateProofOfWork}
          />
        </div>
      </WidgetBackground>
    </WidgetErrorBoundary>
  );
};

export default SupplySinceMergeWidget;
