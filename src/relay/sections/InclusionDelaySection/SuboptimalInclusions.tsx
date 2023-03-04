import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsAnnotations from "highcharts/modules/annotations";
import type { TimeFrame } from "../../../mainsite/time-frames";
import type { DateTimeString } from "../../../time";
import WidgetBase from "../../components/WidgetBase";
import colors from "../../../colors";
import _merge from "lodash/merge";
import * as DateFns from "date-fns";
import useWindowSize from "../../../hooks/use-window-size";

// Somehow resolves an error thrown by the annotation lib
if (typeof window !== "undefined") {
  // Initialize highchats annotations module (only on browser, doesn't work on server)
  highchartsAnnotations(Highcharts);
}

const baseOptions: Highcharts.Options = {
  accessibility: { enabled: false },
  chart: {
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
          zIndex: 20,
          states: { hover: { fill: "#343C56" } },
        },
      },
    },
    backgroundColor: "transparent",
    showAxes: false,
    marginRight: 84,
    marginLeft: 40,
    marginTop: 14,
  },
  title: undefined,
  xAxis: {
    type: "datetime",
    lineWidth: 0,
    labels: { enabled: false, style: { color: colors.slateus400 } },
    tickWidth: 0,
  },
  yAxis: {
    endOnTick: false,
    gridLineWidth: 0,
    labels: {
      style: {
        color: colors.slateus400,
        fontFamily: "Roboto Mono",
        fontSize: "12px",
        fontWeight: "300",
      },
    },
    title: undefined,
  },
  tooltip: {
    backgroundColor: "transparent",
    borderWidth: 0,
    shadow: false,
    useHTML: true,
  },

  credits: { enabled: false },
  plotOptions: {
    series: {
      animation: {
        duration: 300,
      },
      marker: {
        enabled: true,
        lineColor: "white",
        radius: 0.4,
        symbol: "circle",
      },
    },
  },
};

export type SuboptimalTransaction = {
  blocksdelay: number;
  delay: number;
  mined: DateTimeString;
  reason: string;
  transaction_hash: string;
};

const SANCTIONED_ENTITY_SERIES_ID = "sanctioned-entity";
const UNSANCTIONED_ENTITY_SERIES_ID = "unsanctioned-entity";

type TransactionMap = Record<string, SuboptimalTransaction>;

const getTooltipFormatter = (
  transactionMap: TransactionMap,
): Highcharts.TooltipFormatterCallbackFunction =>
  function () {
    const x = typeof this.x === "number" ? this.x : undefined;
    if (x === undefined) {
      return undefined;
    }

    const transaction = transactionMap[x];
    if (transaction === undefined) {
      return undefined;
    }

    const dt = new Date(x);
    const formattedDate = DateFns.format(dt, "iii MMM dd");
    const formattedTime = DateFns.format(dt, "HH:mm:ss");
    const formattedTimeZone = DateFns.format(dt, "'UTC'x");

    const shortHash = `${transaction.transaction_hash.slice(
      0,
      5,
    )}...${transaction.transaction_hash.slice(-3)}`;

    return `
      <div class="font-roboto bg-slateus-700 p-4 rounded-lg border-2 border-slateus-400">
        <div class="font-roboto text-slateus-200 text-right">${shortHash}</div>
        <div class="text-slateus-200 text-right">${formattedDate}</div>
        <div class="text-right">
          <span class="text-white">${formattedTime} </span>
          <span class="text-slateus-200">${formattedTimeZone}</span>
        </div>
          <div class="text-white mt-2 text-right">${transaction.blocksdelay} <span class="text-slateus-200">blocks delay</span></div>
          <div class="text-white text-right">${transaction.delay} <span class="text-slateus-200">seconds delay</span></div>
          <div class="text-white text-right">sanctions <span class="text-slateus-200">${transaction.reason} </span></div>
        </div>
      </div>
    `;
  };

type Props = {
  suboptimalInclusions: SuboptimalTransaction[];
  timeFrame: TimeFrame;
};

const SuboptimalInclusions: FC<Props> = ({
  suboptimalInclusions,
  timeFrame,
}) => {
  const [seriesCensored, seriesUncensored, transactionMap] = useMemo(() => {
    const seriesCensored: [number, number][] = [];
    const seriesUncensored: [number, number][] = [];
    const transactionsMap: TransactionMap = {};
    for (const tx of suboptimalInclusions) {
      const x = new Date(tx.mined).getTime();
      const y = tx.blocksdelay;
      if (tx.reason === "unknown") {
        seriesUncensored.push([x, y] as [number, number]);
      } else {
        seriesCensored.push([x, y] as [number, number]);
      }
      transactionsMap[x] = tx;
    }

    return [seriesCensored, seriesUncensored, transactionsMap];
  }, [suboptimalInclusions]);

  // const { width } = useWindowSize();

  // useLayoutEffect(() => {
  //   if (chartRef.current === null) {
  //     return;
  //   }

  //   console.log(chartRef.current);
  // }, [width]);

  const options = useMemo((): Highcharts.Options => {
    const dynamicOptions: Highcharts.Options = {
      legend: {
        enabled: true,
        useHTML: true,
        symbolWidth: 0,
        squareSymbol: true,
        labelFormatter: function () {
          const color = this.index === 0 ? `bg-blue-400` : `bg-red-400`;
          return `
            <div class="font-inter flex flex-row items-center gap-x-2 ml-2">
              <!-- <div class="w-3 h-3 ${color} rounded-sm"></div> -->
              <div class="font-inter text-xs font-light uppercase tracking-widest text-slateus-200">
                ${this.name}
              </div>
            </div>
          `;
        },
      },
      series: [
        {
          id: SANCTIONED_ENTITY_SERIES_ID,
          type: "column",
          name: "SANCTIONED",
          data: seriesCensored,
          color: {
            linearGradient: {
              x1: 1,
              y1: 0,
              x2: 0.9,
              y2: 1,
            },
            stops: [
              [0, colors.red400],
              [1, "#1B2236"],
            ],
          },
        },
        {
          id: UNSANCTIONED_ENTITY_SERIES_ID,
          type: "column",
          name: "UNSANCTIONED",
          data: seriesUncensored,
          color: {
            linearGradient: {
              x1: 1,
              y1: 0,
              x2: 0.9,
              y2: 1,
            },
            stops: [
              [0, colors.blue400],
              [1, "#1B2236"],
            ],
          },
        },
      ],
      tooltip: {
        formatter: getTooltipFormatter(transactionMap),
      },
    };

    return _merge({}, baseOptions, dynamicOptions);
  }, [seriesCensored, seriesUncensored, transactionMap]);

  return (
    <WidgetBase title="suboptimal inclusions (in blocks)" timeFrame={timeFrame}>
      <div
        className={`
            mt-4 flex h-full
            w-full
          `}
      >
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </WidgetBase>
  );
};

export default SuboptimalInclusions;
