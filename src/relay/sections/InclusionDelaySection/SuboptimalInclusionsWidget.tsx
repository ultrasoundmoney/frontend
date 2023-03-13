import type { FC } from "react";
import { useRef } from "react";
import { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsAnnotations from "highcharts/modules/annotations";
import type { TimeFrame } from "../../../mainsite/time-frames";
import type { DateTimeString } from "../../../time";
import WidgetBase from "../../components/WidgetBase";
import colors from "../../../colors";
import * as DateFns from "date-fns";

// Somehow resolves an error thrown by the annotation lib
if (typeof window !== "undefined") {
  // Initialize highchats annotations module (only on browser, doesn't work on server)
  highchartsAnnotations(Highcharts);
}

const highchartsTooltipTheme = {
  backgroundColor: "transparent",
  borderWidth: 0,
  hideDelay: 1000,
  shadow: false,
  stickOnContact: true,
  useHTML: true,
};

const highchartsZoomTheme = {
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
};

const highchartsLabelStyle = {
  color: colors.slateus400,
  fontFamily: "Roboto Mono",
  fontSize: "12px",
  fontWeight: "300",
};

const baseOptions: Highcharts.Options = {
  accessibility: { enabled: false },
  chart: {
    zooming: {
      type: "x",
      resetButton: { position: { x: 0, y: 10 }, theme: highchartsZoomTheme },
    },
    backgroundColor: "transparent",
    showAxes: false,
  },
  title: undefined,
  xAxis: {
    type: "datetime",
    lineWidth: 0,
    labels: { enabled: true, style: highchartsLabelStyle },
    tickWidth: 0,
  },
  yAxis: {
    gridLineWidth: 0,
    labels: { style: highchartsLabelStyle },
    title: undefined,
  },
  tooltip: highchartsTooltipTheme,
  credits: { enabled: false },
};

export type SuboptimalTransaction = {
  blockDelay: number;
  delay: number;
  mined: DateTimeString;
  reason: string;
  transactionHash: string;
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

    const transactionHash = transaction.transactionHash;
    const shortHash = `${transactionHash.slice(
      0,
      5,
    )}...${transaction.transactionHash.slice(-3)}`;

    return `
      <div class="p-4 rounded-lg border-2 font-roboto bg-slateus-700 border-slateus-400">
        <a
          class="block text-right font-roboto text-slateus-200"
          href="https://etherscan.com/tx/${transactionHash}"
        >
          ${shortHash}
        </a>
        <div class="text-right text-slateus-200">${formattedDate}</div>
        <div class="text-right">
          <span class="text-white">${formattedTime} </span>
          <span class="text-slateus-200">${formattedTimeZone}</span>
        </div>
          <div class="mt-2 text-right text-white">${transaction.blockDelay} <span class="text-slateus-200">blocks delay</span></div>
          <div class="text-right text-white">${transaction.delay} <span class="text-slateus-200">seconds delay</span></div>
          <div class="text-right text-white">sanctions <span class="text-slateus-200">${transaction.reason} </span></div>
        </div>
      </div>
    `;
  };

type Props = {
  onClickTimeFrame: () => void;
  suboptimalInclusions: SuboptimalTransaction[];
  timeFrame: TimeFrame;
};

const SuboptimalInclusions: FC<Props> = ({
  onClickTimeFrame,
  suboptimalInclusions,
  timeFrame,
}) => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const [seriesCensored, seriesUncensored, transactionMap] = useMemo(() => {
    const seriesCensored: [number, number][] = [];
    const seriesUncensored: [number, number][] = [];
    const transactionsMap: TransactionMap = {};
    for (const tx of suboptimalInclusions) {
      const x = new Date(tx.mined).getTime();
      const y = tx.blockDelay;
      if (tx.reason === "unknown") {
        seriesUncensored.push([x, y] as [number, number]);
      } else if (tx.reason === "ofac") {
        seriesCensored.push([x, y] as [number, number]);
      } else {
        console.log("unrecognized delayed: ", tx.reason);
      }
      transactionsMap[x] = tx;
    }

    return [seriesCensored, seriesUncensored, transactionsMap];
  }, [suboptimalInclusions]);

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
            <div class="flex flex-row gap-x-2 items-center ml-2 font-inter">
              <!-- <div class="w-3 h-3 ${color} rounded-sm"></div> -->
              <div class="text-xs font-light tracking-widest uppercase font-inter text-slateus-200">
                ${this.name}
              </div>
            </div>
          `;
        },
      },
      series: [
        {
          borderWidth: 0,
          color: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, colors.red400],
              [1, "#1B2236"],
            ],
          },
          data: seriesCensored,
          id: SANCTIONED_ENTITY_SERIES_ID,
          name: "SANCTIONED",
          type: "column",
        },
        {
          borderWidth: 0,
          color: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              [0, colors.blue400],
              [1, "#1B2236"],
            ],
          },
          data: seriesUncensored,
          id: UNSANCTIONED_ENTITY_SERIES_ID,
          name: "UNSANCTIONED",
          type: "column",
        },
      ],
      tooltip: {
        formatter: getTooltipFormatter(transactionMap),
      },
    };

    return Object.assign({}, baseOptions, dynamicOptions);
  }, [seriesCensored, seriesUncensored, transactionMap]);

  return (
    <WidgetBase
      title="suboptimal inclusions (in blocks)"
      timeFrame={timeFrame}
      onClickTimeFrame={onClickTimeFrame}
    >
      <HighchartsReact
        containerProps={{ className: "w-full h-full" }}
        highcharts={Highcharts}
        options={options}
        ref={chartComponentRef}
      />
    </WidgetBase>
  );
};

export default SuboptimalInclusions;
