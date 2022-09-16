import HighchartsReact from "highcharts-react-official";
import { subHours } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import type { SupplyAtTime } from "../../api/supply-since-merge";
import { useSupplySinceMerge } from "../../api/supply-since-merge";
import _last from "lodash/last";
import _merge from "lodash/merge";
import Highcharts from "highcharts";
import highchartsAnnotations from "highcharts/modules/annotations";
import type { FC } from "react";
import LabelText from "../TextsNext/LabelText";
import UpdatedAgo from "../UpdatedAgo";
import WidgetErrorBoundary from "../WidgetErrorBoundary";
import { WidgetBackground } from "../WidgetSubcomponents";
import colors from "../../colors";
import { formatTwoDigit, formatZeroDecimals } from "../../format";
import type { JsTimestamp } from "../../time";
import type { SupplyPoint } from "../Dashboard/MergeSection";
import { formatInTimeZone } from "date-fns-tz";
import type { MergeStatus } from "../../api/merge-status";
import { useImpreciseEthSupply } from "../../api/eth-supply";
import SimulateProofOfWork from "../SimulateProofOfWork";
import { MERGE_TIMESTAMP } from "../../eth-constants";
import { posIssuancePerDay, powIssuancePerDay } from "../../static-ether-data";

// Somehow resolves an error thrown by the annotation lib
if (typeof window !== "undefined") {
  // Initialize highchats annotations module (only on browser, doesn't work on server)
  highchartsAnnotations(Highcharts);
}

const SUPPLY_SINCE_MERGE_SERIES_ID = "supply-since-merge-series";

const baseOptions: Highcharts.Options = {
  accessibility: { enabled: false },
  chart: {
    backgroundColor: "transparent",
    showAxes: false,
    marginRight: 32,
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
  },
  xAxis: {
    type: "datetime",
    lineWidth: 0,
    labels: {
      style: { color: colors.slateus400 },
    },
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
        enabled: false,
        lineColor: "white",
        fillColor: "#4B90DB",
        radius: 5,
        symbol: "circle",
      },
    },
  },
};

const peakPoint: SupplyPoint = [1663224120000, 120521136.6];

const POW_ISSUANCE_PER_DAY = powIssuancePerDay - posIssuancePerDay;
const SLOTS_PER_DAY = 24 * 60 * 5;

// Given a list of supply points check if no point within the last hour has crossed it, if no, return peak point.
const getNewPeakSinceMerge = (
  lastHourBound: JsTimestamp,
  points: SupplyPoint[],
) =>
  points.some((point) => point[0] >= lastHourBound && point[1] >= peakPoint[1]);

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
  const [showPeakLine, setShowPeakLine] = useState<boolean>();
  const ethSupply = useImpreciseEthSupply();
  const supplySinceMerge = useSupplySinceMerge();

  const mergeTimestamp = new Date(mergeStatus.timestamp).getTime();

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

  useEffect(() => {
    if (supplySinceMergeSeries === undefined) {
      return;
    }

    const lastHourBound = subHours(new Date(), 1).getTime();
    if (!getNewPeakSinceMerge(lastHourBound, supplySinceMergeSeries)) {
      setShowPeakLine(true);
    } else {
      setShowPeakLine(false);
    }
  }, [supplySinceMergeSeries]);

  const options = useMemo((): Highcharts.Options => {
    const lastPoint = _last(supplySinceMergeSeries);

    const supplySinceMergeMap = Object.fromEntries(
      new Map(supplySinceMergeSeries ?? []).entries(),
    );

    const supplySinceMergePowMap = Object.fromEntries(
      new Map(supplySinceMergePowSeries ?? []).entries(),
    );

    return _merge({}, baseOptions, {
      yAxis: {
        max: simulateProofOfWork
          ? undefined
          : mergeStatus.supply + POW_ISSUANCE_PER_DAY / 4,
        plotLines: [
          {
            id: "merge-supply",
            value: peakPoint[1],
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
            value: mergeTimestamp,
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
          threshold: mergeStatus.supply,
          // negativeColor: {
          //   linearGradient: {
          //     x1: 0,
          //     y1: 1,
          //     x2: 0,
          //     y2: 0,
          //   },
          //   stops: [
          //     [0, "#EDDB36"],
          //     [1, "#E79800"],
          //   ],
          // },
          // color: {
          //   linearGradient: {
          //     x1: 0,
          //     y1: 0,
          //     x2: 0,
          //     y2: 1,
          //   },
          //   stops: [
          //     [0.2, "#5487F4"],
          //     [1, "#00FFFB"],
          //   ],
          // },
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
          id: "supply-since-merge-pow-series",
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
          data: supplySinceMergePowSeries,
        },
        {
          enableMouseTracking: false,
          id: "supply-since-merge-pow-series-shadow",
          states: { hover: { enabled: false }, select: { enabled: false } },
          type: "line",
          color: {},
          shadow: {
            color: "rgba(75, 144, 219, 0.2)",
            width: 15,
          },
          data: supplySinceMergePowSeries,
        },
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

          // Hack in showing the right graphs' points.
          const pointMap =
            this.series.userOptions.id === SUPPLY_SINCE_MERGE_SERIES_ID
              ? supplySinceMergeMap
              : supplySinceMergePowMap;
          const total = pointMap[x];
          if (total === undefined) {
            return undefined;
          }

          const dt = new Date(x);
          const formattedDate = formatInTimeZone(dt, "UTC", "MMM d, h:mmaa");

          const supplyDelta =
            x >= peakPoint[0] && ethSupply !== undefined
              ? total - peakPoint[1]
              : undefined;

          const supplyDeltaFormatted =
            supplyDelta !== undefined ? formatTwoDigit(supplyDelta) : undefined;

          const gradientCss =
            supplyDelta !== undefined && supplyDelta <= 0
              ? "from-orange-400 to-yellow-500"
              : "from-cyan-300 to-indigo-500";

          return `
            <div class="font-roboto bg-slateus-700 p-4 rounded-lg border-2 border-slateus-200">
              <div class="text-slateus-400">${
                this.series.userOptions.id !== SUPPLY_SINCE_MERGE_SERIES_ID
                  ? "SIMULATED PoW"
                  : ""
              }</div>
              <div class="text-blue-spindle">${formattedDate}</div>
              <div class="flex flex-col items-end">
                <div class="text-white">
                  ${formatTwoDigit(total)}
                  <span class="text-slateus-400"> ETH</span>
                </div>
                <div class="
                  ${supplyDelta === undefined ? "hidden" : ""}
                  text-transparent bg-clip-text bg-gradient-to-r ${gradientCss}
                ">
                  ${
                    supplyDelta !== undefined && supplyDelta >= 0 ? "+" : ""
                  }${supplyDeltaFormatted}
                  <span class="text-slateus-400"> ETH</span>
                </div>
              </div>
            </div>
          `;
        },
      },
    } as Highcharts.Options);
  }, [
    ethSupply,
    mergeStatus.block_number,
    mergeStatus.supply,
    mergeTimestamp,
    simulateProofOfWork,
    supplySinceMergePowSeries,
    supplySinceMergeSeries,
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
