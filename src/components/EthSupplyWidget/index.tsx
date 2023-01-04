import { differenceInSeconds, format } from "date-fns";
import type {
  FormatterCallbackFunction,
  PlotLineOrBand,
  Point,
} from "highcharts";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsAnnotations from "highcharts/modules/annotations";
import _first from "lodash/first";
import _last from "lodash/last";
import _merge from "lodash/merge";
import type { FC } from "react";
import { useMemo } from "react";
import type { SupplyAtTime } from "../../api/supply-over-time";
import { useSupplyOverTime } from "../../api/supply-over-time";
import colors from "../../colors";
import type { EthNumber } from "../../eth-units";
import { usePosIssuancePerDay } from "../../eth-units";
import {
  formatPercentFiveDecimalsSigned,
  formatPercentThreeDecimalsSigned,
  formatTwoDigit,
  formatTwoDigitsSigned,
  formatZeroDecimals,
} from "../../format";
import { PARIS_BLOCK_NUMBER, PARIS_TIMESTAMP } from "../../hardforks/paris";
import { powIssuancePerDay } from "../../static-ether-data";
import type {
  LimitedTimeFrameWithMerge,
  SupplyPoint,
} from "../Dashboard/SupplyDashboard";
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
const BITCOIN_ISSUANCE_PER_TEN_MINUTES = 6.25;
const BITCOIN_ISSUANCE_PER_SECOND =
  BITCOIN_ISSUANCE_PER_TEN_MINUTES / (60 * 10);

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
  series: SupplyPoint[] | undefined,
  pointMap: PointMap | undefined,
  simulateProofOfWork: boolean,
): FormatterCallbackFunction<Point> =>
  function () {
    if (series === undefined || pointMap === undefined) {
      return "";
    }

    const x = typeof this.x === "number" ? this.x : undefined;
    if (x === undefined) {
      return "";
    }

    const firstPoint = _first(series);
    if (firstPoint === undefined) {
      return "";
    }
    const firstSupply = firstPoint[1];
    const total = pointMap[x];
    if (total === undefined) {
      return "";
    }

    const dt = new Date(x);
    const formattedDate = format(dt, "iii MMM dd");
    const formattedTime = format(dt, "HH:mm:ss 'UTC'x");

    const supplyDelta = total - firstSupply;

    const supplyDeltaFormatted =
      supplyDelta !== undefined
        ? formatTwoDigitsSigned(supplyDelta)
        : undefined;

    const gradientCss =
      supplyDelta !== undefined && supplyDelta <= 0
        ? "from-orange-400 to-yellow-300"
        : "from-cyan-300 to-indigo-500";

    const title = type === "pos" ? "ETH" : type === "pow" ? "ETH (PoW)" : "BTC";
    const unit = type === "bitcoin" ? "BTC" : "ETH";

    const supplyDeltaPercent =
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
            ${supplyDeltaPercent === undefined ? "hidden" : ""}
          ">
            (${supplyDeltaPercent})
          </div>
        </div>
      </div>
    `;
  };

const YEAR_IN_SECONDS = 365.25 * 24 * 60 * 60;

const getSupplyChangeLabel = (
  points: SupplyPoint[],
): FormatterCallbackFunction<PlotLineOrBand> =>
  function () {
    const firstPoint = _first(points);
    const lastPoint = _last(points);
    if (firstPoint === undefined || lastPoint === undefined) {
      return "";
    }

    const secondsDelta = differenceInSeconds(lastPoint[0], firstPoint[0]);
    const supplyDelta = lastPoint[1] - firstPoint[1];
    const yearlyDelta = (supplyDelta / secondsDelta) * YEAR_IN_SECONDS;
    const yearlySupplyDeltaPercent = formatPercentThreeDecimalsSigned(
      yearlyDelta / firstPoint[1],
    );

    return `
      <div class="flex flex-row items-center gap-x-2">
        <div class="w-2 h-2 rounded-full"></div>
        <div class="font-roboto font-normal text-slateus-400 text-xs">
          <span class="text-white">${yearlySupplyDeltaPercent}</span>/y
        </div>
      </div>
    `;
  };

const getBitcoinSeries = (
  ethPosSeries: SupplyPoint[] | undefined,
): [SupplyPoint[] | undefined, SupplyPoint[] | undefined] => {
  if (ethPosSeries === undefined) {
    return [undefined, undefined];
  }

  const ethPosFirstPoint = _first(ethPosSeries);
  if (ethPosFirstPoint === undefined) {
    return [undefined, undefined];
  }

  const parisToTimeFrameSeconds = differenceInSeconds(
    ethPosFirstPoint[0],
    PARIS_TIMESTAMP,
  );
  const firstPointBitcoinSupply =
    BITCOIN_SUPPLY_AT_MERGE +
    BITCOIN_ISSUANCE_PER_SECOND * parisToTimeFrameSeconds;
  const points = ethPosSeries.map(([timestamp]) => {
    const secondsDelta =
      ethPosFirstPoint[0] === undefined
        ? 0
        : differenceInSeconds(timestamp, ethPosFirstPoint[0]);
    const bitcoinIssued = secondsDelta * BITCOIN_ISSUANCE_PER_SECOND;
    const nextPoint = [
      timestamp,
      firstPointBitcoinSupply + bitcoinIssued,
    ] as SupplyPoint;
    return nextPoint;
  });
  const scalingConstant = ethPosFirstPoint[1] / firstPointBitcoinSupply;
  const pointsScaled = points.map(([timestamp, bitcoinSupply]) => {
    return [timestamp, bitcoinSupply * scalingConstant] as SupplyPoint;
  });
  return [points, pointsScaled];
};

const getEthPowSeries = (
  ethPosSeries: SupplyPoint[] | undefined,
  powMinPosIssuancePerDay: EthNumber,
): SupplyPoint[] | undefined =>
  ethPosSeries === undefined
    ? undefined
    : ethPosSeries.map(([timestamp, supply]) => {
        const firstPoint = _first(ethPosSeries);
        // Map can only be called for points that are not undefined.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const firstPointTimestamp = new Date(firstPoint![0]);
        const slotsSinceStart =
          differenceInSeconds(new Date(timestamp), firstPointTimestamp) / 12;

        const simulatedPowIssuanceSinceStart =
          (slotsSinceStart / SLOTS_PER_DAY) * powMinPosIssuancePerDay;

        const nextSupply = supply + simulatedPowIssuanceSinceStart;
        const nextPoint: SupplyPoint = [timestamp, nextSupply];
        return nextPoint;
      });

const getEthPosSeries = (
  supplyOverTimeTimeFrame: SupplyAtTime[] | undefined,
): SupplyPoint[] | undefined =>
  supplyOverTimeTimeFrame === undefined
    ? undefined
    : supplyOverTimeTimeFrame.map(
        (point): SupplyPoint => [
          new Date(point.timestamp).getTime(),
          point.supply,
        ],
      );

type Props = {
  onClickTimeFrame: () => void;
  onSimulateProofOfWork: () => void;
  simulateProofOfWork: boolean;
  timeFrame: LimitedTimeFrameWithMerge;
};

const SupplySinceMergeWidget: FC<Props> = ({
  onClickTimeFrame,
  onSimulateProofOfWork,
  simulateProofOfWork,
  timeFrame,
}) => {
  const supplyOverTime = useSupplyOverTime();
  const supplyOverTimeTimeFrame = supplyOverTime?.[timeFrame];
  const isTimeFrameAvailable =
    supplyOverTimeTimeFrame !== undefined && supplyOverTimeTimeFrame.length > 0;
  const posIssuancePerDay = usePosIssuancePerDay();
  // To compare proof of stake issuance to proof of work issuance we offer a
  // "simulate proof of work" toggle. However, we only have a supply series under
  // proof of stake. Already including proof of stake issuance. Adding proof of
  // work issuance would mean "simulated proof of work" is really what supply
  // would look like if there was both proof of work _and_ proof of stake
  // issuance. To make the comparison apples to apples we subtract an estimated
  // proof of stake issuance to show the supply as if there were _only_ proof of
  // work issuance. A possible improvement would be to drop this ad-hoc solution
  // and have the backend return separate series.
  const powMinPosIssuancePerDay = powIssuancePerDay - posIssuancePerDay;

  const options = useMemo((): Highcharts.Options => {
    if (!isTimeFrameAvailable) {
      return baseOptions;
    }

    const ethPosSeries = getEthPosSeries(supplyOverTimeTimeFrame);
    const [bitcoinSupplySeries, bitcoinSupplySeriesScaled] =
      getBitcoinSeries(ethPosSeries);
    const ethPowSeries = getEthPowSeries(ethPosSeries, powMinPosIssuancePerDay);
    const lastPointPos = _last(ethPosSeries);
    const lastPointBtc = _last(bitcoinSupplySeriesScaled);
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
            id: "supply-at-start",
            value: ethPosSeries?.[0]?.[1],
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
                  <a class="hover:underline" href="https://etherscan.io/block/15537393" target="_blank">
                    <div class="font-roboto font-light text-slateus-300">
                    #${formatZeroDecimals(PARIS_BLOCK_NUMBER)}
                    </div>
                  </a>
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
          type: "spline",
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
              ethPosSeries,
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
          type: "spline",
          shadow: {
            color: "#FF891D33",
            width: 15,
          },
          data:
            bitcoinSupplySeriesScaled === undefined
              ? undefined
              : [
                  ...bitcoinSupplySeriesScaled,
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
              bitcoinSupplySeries,
              bitcoinPointMap,
              simulateProofOfWork,
            ),
          },
        },
        {
          color: colors.slateus100,
          visible: simulateProofOfWork,
          enableMouseTracking: simulateProofOfWork,
          id: SUPPLY_SINCE_MERGE_POW_SERIES_ID,
          name: "ETH (PoW)",
          showInLegend: simulateProofOfWork,
          type: "spline",
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
              ethPowSeries,
              ethPowPointMap,
              simulateProofOfWork,
            ),
          },
        },
        {
          color: "transparent",
          visible: simulateProofOfWork,
          type: "spline",
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
  }, [
    isTimeFrameAvailable,
    powMinPosIssuancePerDay,
    simulateProofOfWork,
    supplyOverTimeTimeFrame,
  ]);

  return (
    <WidgetErrorBoundary title="eth supply">
      <WidgetBackground className="relative flex w-full flex-col">
        <div className="absolute left-0 right-0 top-0 bottom-0 overflow-hidden">
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
        </div>
        <div className="z-10 flex justify-between">
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
          {isTimeFrameAvailable ? (
            <HighchartsReact highcharts={Highcharts} options={options} />
          ) : (
            <div className="flex h-full min-h-[400px] items-center justify-center text-center lg:min-h-[auto]">
              <LabelText color="text-slateus-300">
                currently unavailable
              </LabelText>
            </div>
          )}
        </div>
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-4">
          <UpdatedAgo updatedAt={supplyOverTime?.timestamp} />
          <SimulateProofOfWork
            checked={simulateProofOfWork}
            onToggle={onSimulateProofOfWork}
            tooltipText="simulate what the ETH supply would look like under proof-of-work issuance"
          />
        </div>
      </WidgetBackground>
    </WidgetErrorBoundary>
  );
};

export default SupplySinceMergeWidget;
