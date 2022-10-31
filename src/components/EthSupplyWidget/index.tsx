import { addMinutes, differenceInSeconds, format } from "date-fns";
import type { FormatterCallbackFunction, Point } from "highcharts";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsAnnotations from "highcharts/modules/annotations";
import _last from "lodash/last";
import _merge from "lodash/merge";
import type { FC } from "react";
import { useMemo } from "react";
import type { SupplyAtTime } from "../../api/supply-over-time";
import { useSupplyOverTime } from "../../api/supply-over-time";
import colors from "../../colors";
import {
  formatPercentFiveDecimalsSigned,
  formatPercentThreeDecimalsSigned,
  formatTwoDigit,
  formatTwoDigitsSigned,
  formatZeroDecimals,
} from "../../format";
import {
  PARIS_BLOCK_NUMBER,
  PARIS_SUPPLY,
  PARIS_TIMESTAMP,
} from "../../hardforks/paris";
import { posIssuancePerDay, powIssuancePerDay } from "../../static-ether-data";
import type {
  SupplyPoint,
  TimeFrameWithMerge,
} from "../Dashboard/SupplySection";
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
    marginRight: 72,
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
  type: "pos" | "pow" | "bitcoin",
  pointMap: PointMap,
  simulateProofOfWork: boolean,
): FormatterCallbackFunction<Point> =>
  function () {
    const x = typeof this.x === "number" ? this.x : undefined;
    if (x === undefined) {
      return "";
    }

    const firstPoint = this.series.data[0];
    if (firstPoint === undefined) {
      return "";
    }
    const firstSupply = firstPoint.y;
    if (firstSupply === undefined) {
      return "";
    }
    const total =
      type === "bitcoin"
        ? (pointMap[x] / PARIS_SUPPLY) * BITCOIN_SUPPLY_AT_MERGE
        : pointMap[x];

    if (total === undefined) {
      return "";
    }

    const dt = new Date(x);
    const formattedDate = format(dt, "iii MMM dd");
    const formattedTime = format(dt, "HH:mm:ss 'UTC'x");

    let supplyDelta = undefined;
    if (this.series.userOptions.id === BITCOIN_SUPPLY_ID) {
      supplyDelta = total - BITCOIN_SUPPLY_AT_MERGE;
    } else {
      supplyDelta = total - firstSupply;
    }

    const supplyDeltaFormatted =
      supplyDelta !== undefined
        ? formatTwoDigitsSigned(supplyDelta)
        : undefined;

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

    const issuanceSupplyChangeFormatted =
      supplyDelta === undefined
        ? undefined
        : formatPercentFiveDecimalsSigned(supplyDelta / total);

    // z-10 does not work without adjusting position to !static.
    return `
      <div class="font-roboto bg-slateus-700 p-4 rounded-lg border-2 border-slateus-400 relative z-10">
        ${
          !simulateProofOfWork
            ? ""
            : `<div class="mb-2 text-slateus-200">${title}</div>`
        }
        <div class="text-slateus-400 text-right">${formattedDate}</div>
        <div class="text-slateus-400 text-right">${formattedTime}</div>
        <div class="flex flex-col items-end mt-2">
          <div class="text-white">
            ${formatTwoDigit(total)}
            <span class="text-slateus-400"> ${unit}</span>
          </div>
          <div class="
            text-transparent bg-clip-text bg-gradient-to-r
            ${gradientCss}
            ${supplyDelta === undefined ? "hidden" : ""}
          ">
            ${supplyDeltaFormatted}
            <span class="text-slateus-400"> ${unit}</span>
          </div>
          <div class="
            text-transparent bg-clip-text bg-gradient-to-r
            ${gradientCss}
            ${issuanceSupplyChangeFormatted === undefined ? "hidden" : ""}
          ">
            (${issuanceSupplyChangeFormatted})
          </div>
        </div>
      </div>
    `;
  };

const YEAR_IN_SECONDS = 365.25 * 24 * 60 * 60;

const getSupplyChangeLabel = (points: SupplyPoint[]) => () => {
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  const secondsDelta = differenceInSeconds(lastPoint[0], firstPoint[0]);
  const ethDelta = lastPoint[1] - firstPoint[1];
  const yearlyDelta = (ethDelta / secondsDelta) * YEAR_IN_SECONDS;
  const yearlySupplyDeltaPercent = formatPercentThreeDecimalsSigned(
    yearlyDelta / firstPoint[1],
  );

  return `
    <div class="flex flex-row items-center gap-x-2 select-text">
      <div class="w-2 h-2 rounded-full"></div>
      <div class="font-roboto font-normal text-slateus-400 text-xs">
        <span class="text-white">${yearlySupplyDeltaPercent}</span>/y
      </div>
    </div>
  `;
};

type Props = {
  onClickTimeFrame: () => void;
  onSimulateProofOfWork: () => void;
  simulateProofOfWork: boolean;
  timeFrame: TimeFrameWithMerge;
};

const SupplySinceMergeWidget: FC<Props> = ({
  onClickTimeFrame,
  onSimulateProofOfWork,
  simulateProofOfWork,
  timeFrame,
}) => {
  const supplyOverTime = useSupplyOverTime();
  const supplyOverTimeTimeFrame = supplyOverTime?.[timeFrame];
  const supplySinceMerge = supplyOverTime?.since_merge;

  const pointFromSupplyAtTime = (supplyAtTime: SupplyAtTime): SupplyPoint => [
    new Date(supplyAtTime.timestamp).getTime(),
    supplyAtTime.supply,
  ];

  const ethPosSeries = useMemo(
    () =>
      supplyOverTimeTimeFrame === undefined
        ? undefined
        : supplyOverTimeTimeFrame.map(
            (point): SupplyPoint => [
              new Date(point.timestamp).getTime(),
              point.supply,
            ],
          ),
    [supplyOverTimeTimeFrame],
  );

  const ethPowSeries = useMemo(
    () =>
      supplySinceMerge === undefined
        ? undefined
        : supplySinceMerge.reduce((points: SupplyPoint[], point) => {
            const timestamp = new Date(point.timestamp).getTime();

            if (timestamp <= PARIS_TIMESTAMP.getTime()) {
              return points;
            }

            const lastPoint = _last(points);
            if (lastPoint === undefined) {
              return [pointFromSupplyAtTime(point)];
            }

            const slotsSinceMerge =
              (new Date(point.timestamp).getTime() -
                PARIS_TIMESTAMP.getTime()) /
              1000 /
              12;

            const simulatedPowIssuanceSinceMerge =
              (slotsSinceMerge * POW_ISSUANCE_PER_DAY) / SLOTS_PER_DAY;

            const nextSupply = point.supply + simulatedPowIssuanceSinceMerge;

            const nextPoint: SupplyPoint = [timestamp, nextSupply];

            return [...points, nextPoint];
          }, []),
    [supplySinceMerge],
  );

  const bitcoinSupplySeries = useMemo(() => {
    if (ethPosSeries === undefined) {
      return undefined;
    }

    const timeFrameBitcoinStepSizeMap: Record<TimeFrameWithMerge, number> = {
      m5: 1,
      h1: 10,
      d1: 10,
      d7: 10,
      d30: 60,
      since_merge: 240,
    };

    const last = ethPosSeries[ethPosSeries.length - 1];
    const points = [];
    const firstPointSupply = ethPosSeries[0][1];
    const stepSize = timeFrameBitcoinStepSizeMap[timeFrame];
    let timestamp = ethPosSeries[0][0];
    let bitcoinSupply = BITCOIN_SUPPLY_AT_MERGE;
    while (timestamp < last[0]) {
      const bitcoinSupplyRescaled =
        (bitcoinSupply / BITCOIN_SUPPLY_AT_MERGE) * firstPointSupply;

      points.push([timestamp, bitcoinSupplyRescaled] as SupplyPoint);

      bitcoinSupply = bitcoinSupply + 0.625 * stepSize;
      timestamp = addMinutes(timestamp, 1 * stepSize).getTime();
    }

    return points;
  }, [ethPosSeries, timeFrame]);

  const options = useMemo((): Highcharts.Options => {
    const lastPointPos = _last(ethPosSeries);
    const lastPointBtc = _last(bitcoinSupplySeries);
    const lastPointPow = _last(ethPowSeries);

    const ethPosPointMap = Object.fromEntries(
      new Map(ethPosSeries ?? []).entries(),
    );

    const ethPowPointMap = Object.fromEntries(
      new Map(ethPowSeries ?? []).entries(),
    );

    const bitcoinPointMap = Object.fromEntries(
      new Map(bitcoinSupplySeries ?? []).entries(),
    );

    const dynamicOptions: Highcharts.Options = {
      legend: {
        enabled: simulateProofOfWork,
      },
      yAxis: {
        plotLines: [
          {
            id: "merge-supply",
            value: PARIS_SUPPLY,
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
              x: 72,
              y: 2,
              useHTML: true,
              formatter:
                bitcoinSupplySeries === undefined
                  ? undefined
                  : getSupplyChangeLabel(bitcoinSupplySeries),
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
              x: 72,
              y: 2,
              useHTML: true,
              formatter:
                ethPosSeries === undefined
                  ? undefined
                  : getSupplyChangeLabel(ethPosSeries),
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
              x: 72,
              y: 2,
              useHTML: true,
              formatter:
                ethPowSeries === undefined
                  ? undefined
                  : getSupplyChangeLabel(ethPowSeries),
            },
          },
        ],
      },
      xAxis: {
        plotLines: [
          {
            id: "merge-plotline",
            value: PARIS_TIMESTAMP.getTime(),
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
                  #${formatZeroDecimals(PARIS_BLOCK_NUMBER)}
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
            lastPointPos !== undefined && ethPosSeries !== undefined
              ? [
                  ...ethPosSeries,
                  {
                    x: lastPointPos?.[0],
                    y: lastPointPos?.[1],
                    marker: {
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
          tooltip: {
            pointFormatter: getTooltip(
              "pos",
              ethPosPointMap,
              simulateProofOfWork,
            ),
          },
        },
        {
          color: "#FF891D",
          visible: simulateProofOfWork,
          enableMouseTracking: simulateProofOfWork,
          id: BITCOIN_SUPPLY_ID,
          type: "line",
          shadow: {
            color: "#FF891D33",
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
                      symbol: `url(/graph-dot-bitcoin.svg)`,
                      enabled: true,
                    },
                  },
                ],
          name: "BTC",
          showInLegend: simulateProofOfWork,
          tooltip: {
            pointFormatter: getTooltip(
              "bitcoin",
              bitcoinPointMap,
              simulateProofOfWork,
            ),
          },
        },
        {
          color: colors.slateus100,
          dashStyle: "Dash",
          visible: simulateProofOfWork,
          enableMouseTracking: simulateProofOfWork,
          id: SUPPLY_SINCE_MERGE_POW_SERIES_ID,
          name: "ETH (PoW)",
          showInLegend: simulateProofOfWork,
          type: "line",
          data:
            ethPowSeries === undefined
              ? undefined
              : [
                  ...ethPowSeries,
                  {
                    x: lastPointPow?.[0],
                    y: lastPointPow?.[1],
                    marker: {
                      symbol: `url(/graph-dot-white.svg)`,
                      enabled: true,
                    },
                  },
                ],
          tooltip: {
            pointFormatter: getTooltip(
              "pow",
              ethPowPointMap,
              simulateProofOfWork,
            ),
          },
        },
        {
          color: "transparent",
          visible: simulateProofOfWork,
          type: "line",
          data: ethPowSeries,
          enableMouseTracking: false,
          showInLegend: false,
          states: { hover: { enabled: false } },
          shadow: {
            color: "#DEE2F133",
            width: 15,
          },
        },
      ],
      tooltip: {
        backgroundColor: "transparent",
        borderWidth: 0,
        shadow: false,
        headerFormat: "",
      },
    };

    return _merge({}, baseOptions, dynamicOptions);
  }, [ethPosSeries, bitcoinSupplySeries, ethPowSeries, simulateProofOfWork]);

  return (
    <WidgetErrorBoundary title="eth supply">
      <WidgetBackground className="relative flex w-full flex-col overflow-hidden">
        <div
          // will-change-transform is critical for mobile performance of
          // rendering the chart overlayed on this element.
          className={`
            pointer-events-none absolute
            -left-[64px] -top-[64px]
            h-full
            w-full opacity-[0.20]
            blur-[120px]
            will-change-transform
            md:-left-[128px]
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
          <SinceMergeIndicator
            onClick={onClickTimeFrame}
            timeFrame={timeFrame}
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
          {simulateProofOfWork && timeFrame !== "since_merge" ? (
            <div className="flex h-full min-h-[400px] items-center justify-center text-center lg:min-h-[auto]">
              <LabelText color="text-slateus-300">not available</LabelText>
            </div>
          ) : (
            <HighchartsReact highcharts={Highcharts} options={options} />
          )}
        </div>
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-4">
          <UpdatedAgo updatedAt={supplyOverTime?.timestamp} />
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
