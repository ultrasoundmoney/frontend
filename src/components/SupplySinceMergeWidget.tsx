import HighchartsReact from "highcharts-react-official";
import _last from "lodash/last";
import _merge from "lodash/merge";
import Highcharts from "highcharts";
import highchartsAnnotations from "highcharts/modules/annotations";
import type { FC } from "react";
import { useMemo } from "react";
import LabelText from "./TextsNext/LabelText";
import UpdatedAgo from "./UpdatedAgo";
import WidgetErrorBoundary from "./WidgetErrorBoundary";
import { WidgetBackground } from "./WidgetSubcomponents";
import colors from "../colors";
import { getTime, parseISO } from "date-fns";
import { formatTwoDigit, formatZeroDecimals } from "../format";
import type { DateTimeString } from "../time";
import type { SupplyPoint } from "./Dashboard/MergeSection";
import type { EthNumber } from "../eth-units";
import { formatInTimeZone } from "date-fns-tz";
import type { MergeStatus } from "../api/merge-status";

// Somehow resolves an error thrown by the annotation lib
if (typeof window !== "undefined") {
  // Initialize highchats annotations module (only on browser, doesn't work on server)
  highchartsAnnotations(Highcharts);
}

const baseOptions: Highcharts.Options = {
  accessibility: { enabled: false },
  chart: {
    backgroundColor: "transparent",
    showAxes: false,
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
      format: "{value:%l%p} UTC",
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

type Props = {
  supplySinceMergeSeries: SupplyPoint[] | undefined;
  supplySinceMergeMap: Record<string, EthNumber>;
  timestamp: DateTimeString | undefined;
  mergeStatus: MergeStatus;
};

const SupplySinceMergeWidget: FC<Props> = ({
  supplySinceMergeMap: supplySinceMergeMap,
  supplySinceMergeSeries: supplySinceMergeSeries,
  mergeStatus,
  timestamp,
}) => {
  const options = useMemo((): Highcharts.Options => {
    const lastPoint = _last(supplySinceMergeSeries);
    return _merge({}, baseOptions, {
      xAxis: {
        plotLines: [
          {
            id: "merge-plotline",
            value:
              mergeStatus.status === "pending"
                ? undefined
                : getTime(parseISO(mergeStatus.timestamp)),
            color: colors.slateus400,
            width: 1,
            label: {
              x: 10,
              y: 100,
              style: { color: colors.slateus400 },
              align: "center",
              useHTML: true,
              formatter: () => `
                <div class="flex">
                  <div class="font-roboto font-light text-slateus-300">
                  #${
                    mergeStatus.status === "pending"
                      ? undefined
                      : formatZeroDecimals(mergeStatus.block_number)
                  }
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
        // {
        //   id: "supply-by-minute-series-projection",
        //   type: "line",
        //   dashStyle: "Dash",
        //   color: {
        //     linearGradient: {
        //       x1: 0,
        //       y1: 0,
        //       x2: 1,
        //       y2: 0,
        //     },
        //     stops: [
        //       [0, "#5487F4"],
        //       [1, "#6A54F4"],
        //     ],
        //   },
        //   data: [],
        // },
        {
          id: "supply-since-merge-series",
          type: "line",
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

          const total = supplySinceMergeMap[x];
          if (total === undefined) {
            return undefined;
          }

          const dt = new Date(x);
          const formattedDate = formatInTimeZone(dt, "UTC", "MMM d, h:mmaa");
          return `
                <div class="font-roboto bg-slateus-700 p-4 rounded-lg border-2 border-slateus-200">
                  <div class="text-blue-spindle">${formattedDate}</div>
                  <div class="text-white">
                    ${formatTwoDigit(total)}
                    <span class="text-slateus-200"> ETH</span>
                  </div>
                </div>`;
        },
      },
    } as Highcharts.Options);
  }, [supplySinceMergeSeries, supplySinceMergeMap, mergeStatus]);

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
        <div className="flex justify-between flex-wrap gap-y-2">
          <UpdatedAgo updatedAt={timestamp} />
        </div>
      </WidgetBackground>
    </WidgetErrorBoundary>
  );
};

export default SupplySinceMergeWidget;
