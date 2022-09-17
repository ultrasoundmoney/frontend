import { addMinutes } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import type { TooltipFormatterCallbackFunction } from "highcharts";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsAnnotations from "highcharts/modules/annotations";
import _last from "lodash/last";
import _merge from "lodash/merge";
import type { FC } from "react";
import { useMemo } from "react";
import type { MergeStatus } from "../../api/merge-status";
import type { SupplyAtTime } from "../../api/supply-since-merge";
import { useSupplySinceMerge } from "../../api/supply-since-merge";
import colors from "../../colors";
import { MERGE_TIMESTAMP } from "../../eth-constants";
import { formatTwoDigit, formatZeroDecimals } from "../../format";
import { posIssuancePerDay, powIssuancePerDay } from "../../static-ether-data";
import type { SupplyPoint } from "../Dashboard/MergeSection";
import SimulateProofOfWork from "../SimulateProofOfWork";
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
    marginRight: 0,
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
      enabled: false,
    },
    gridLineWidth: 0,
    minPadding: 0.06,
    maxPadding: 0.06,
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
      <div class="font-inter font-light text-slateus-400 text-xs">
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
        enabled: false,
        lineColor: "white",
        fillColor: "#4B90DB",
        radius: 5,
        symbol: "circle",
      },
    },
  },
};

type PointMap = Record<number, number>;

const getTooltip = (
  supplySinceMergeMap: PointMap,
  supplySinceMergePowMap: PointMap,
  bitcoinSupplySeriesMap: PointMap,
  mergeStatus: MergeStatus,
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
    const formattedDate = formatInTimeZone(dt, "UTC", "MMM d, h:mmaa");

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
        ? "from-orange-400 to-yellow-500"
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
      <div class="text-slateus-200">${title}</div>
      <div class="text-slateus-400">${formattedDate}</div>
      <div class="flex flex-col items-end">
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
type Props = {
  mergeStatus: MergeStatus;
  simulateProofOfWork: boolean;
  onSimulateProofOfWork: () => void;
};

const SupplySinceMergeWidget: FC<Props> = ({
  mergeStatus,
  simulateProofOfWork,
  onSimulateProofOfWork,
}) => {
  const supplySinceMerge = useSupplySinceMerge();

  const pointFromSupplyAtTime = (supplyAtTime: SupplyAtTime): SupplyPoint => [
    new Date(supplyAtTime.timestamp).getTime(),
    supplyAtTime.supply,
  ];

  const supplySinceMergeSeries = useMemo(
    () =>
      supplySinceMerge === undefined
        ? undefined
        : supplySinceMerge.supply_by_minute.map(
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
        : supplySinceMerge.supply_by_minute.reduce(
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

  const supplyPowMax =
    supplySinceMergePowSeries === undefined
      ? undefined
      : _last(supplySinceMergePowSeries)?.[1];

  const supplyMin = useMemo(
    () =>
      supplySinceMergeSeries === undefined
        ? undefined
        : supplySinceMergeSeries.reduce((pointA, pointB) =>
            pointA[1] < pointB[1] ? pointA : pointB,
          )[1],
    [supplySinceMergeSeries],
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
    const lastPoint = _last(supplySinceMergeSeries);
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
        max: simulateProofOfWork ? undefined : supplyPosMax,
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
            lastPoint !== undefined && supplySinceMergeSeries !== undefined
              ? [
                  ...supplySinceMergeSeries,
                  {
                    x: lastPoint?.[0],
                    y: lastPoint?.[1],
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
          id: BITCOIN_SUPPLY_ID,
          type: "line",
          color: simulateProofOfWork ? "#FF891D" : "transparent",
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
          id: SUPPLY_SINCE_MERGE_POW_SERIES_ID,
          showInLegend: simulateProofOfWork,
          type: "line",
          dashStyle: "Dash",
          name: "ETH (PoW)",
          // color: simulateProofOfWork ? colors.slateus400 : "transparent",
          color: simulateProofOfWork ? colors.slateus100 : "transparent",
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
          enableMouseTracking: false,
          states: { hover: { enabled: false } },
          data: supplySinceMergePowSeries,
          showInLegend: false,
          color: "transparent",
          shadow: {
            color: simulateProofOfWork ? colors.slateus100 : "transparent",
            width: 15,
            opacity: 0.02,
          },
        },
      ],
      tooltip: {
        backgroundColor: "transparent",
        useHTML: true,
        borderWidth: 0,
        shadow: false,
        formatter: getTooltip(
          supplySinceMergeMap,
          supplySinceMergePowMap,
          bitcoinSupplySeriesMap,
          mergeStatus,
        ),
      },
    } as Highcharts.Options);
  }, [
    supplySinceMergeSeries,
    supplySinceMergePowSeries,
    bitcoinSupplySeries,
    simulateProofOfWork,
    supplyPosMax,
    mergeStatus,
  ]);

  return (
    <WidgetErrorBoundary title="supply since merge">
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
        {/* Align min-h with emoji widget title on the left */}
        <LabelText className="flex items-center min-h-[21px]">
          supply since merge
        </LabelText>
        <div
          // flex-grow fixes bug where highcharts doesn't take full width.
          className={`
            w-full h-full mt-4
            flex justify-center
            select-none
            overflow-hidden
            [&>div]:flex-grow
          `}
        >
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-4 justify-between">
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
