/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from "react";
import Highcharts from "highcharts";
import highchartsAnnotations from "highcharts/modules/annotations";
import HighchartsReact from "highcharts-react-official";
import merge from "lodash/merge";
import last from "lodash/last";
// TODO load these from API
import supplyData from "./supply-total.json";
import stakingData from "./supply-staking.json";

import { useDebounce } from "../../utils/use-debounce";
import {
  estimatedDailyStakeChange,
  formatDate,
} from "../../utils/metric-utils";
import { useOnResize } from "../../utils/use-on-resize";
import { defaultOptions } from "../../utils/chart-defaults";
import * as DateFns from "date-fns";

import styles from "./SupplyChart.module.scss";
import TranslationsContext from "../../contexts/TranslationsContext";
import { formatOneDecimal } from "../../format";

if (typeof window !== "undefined") {
  // Initialize highchats annotations module (onlly on browser, doesn't work on server)
  highchartsAnnotations(Highcharts);
}

interface sypplyDataObj {
  t: string;
  v: number;
}
interface Props {
  projectedStaking: number;
  projectedBaseGasPrice: number;
  showBreakdown: boolean;
}

interface HighchartsRef {
  chart: Highcharts.Chart;
  container: React.RefObject<HTMLDivElement>;
}

const LONDON_DATE = DateFns.parseISO("2021-08-05T00:00:00Z");
const NUM_DAYS_PER_POINT = 7;
const COMPACT_MARKERS_BELOW_WIDTH = 1040;
const COMPACT_CHART_BELOW_WIDTH = 640;

const SupplyChart: React.FC<Props> = ({
  projectedBaseGasPrice,
  projectedStaking,
  showBreakdown: forceShowBreakdown,
}) => {
  const t = React.useContext(TranslationsContext);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const chartRef = React.useRef<HighchartsRef | null>(null);

  React.useEffect(() => {
    // Sometimes the chart container resizes to be smaller after
    // the page finishes loading. Force a reflow to handle this.
    const hc = containerRef.current!.querySelector(".highcharts-container");
    if (hc!.clientWidth > containerRef.current!.clientWidth) {
      console.log("reflow supply chart!");
      chartRef.current!.chart.reflow();
    }
  }, [t]);

  // Responsive helpers
  const [useCompactMarkers, setUseCompactMarkers] = React.useState(
    typeof window !== "undefined" &&
      window.innerWidth < COMPACT_MARKERS_BELOW_WIDTH,
  );
  const [useCompactChart, setUseCompactChart] = React.useState(
    typeof window !== "undefined" &&
      window.innerWidth < COMPACT_CHART_BELOW_WIDTH,
  );

  useOnResize((resizeProps) => {
    const width = resizeProps!.width;
    const _useCompactMarkers = width < COMPACT_MARKERS_BELOW_WIDTH;
    if (_useCompactMarkers !== useCompactMarkers) {
      setUseCompactMarkers(_useCompactMarkers);
    }
    const _useCompactChart = width < COMPACT_CHART_BELOW_WIDTH;
    if (_useCompactChart !== useCompactChart) {
      setUseCompactChart(_useCompactChart);
    }
  });

  // Collect chart settings into a object and debounce how fast it can change
  // (otherwise moving sliders feels very sluggish)
  const _chartSettings = React.useMemo(
    () => ({
      projectedBaseGasPrice,
      projectedStaking,
      showBreakdown: false || forceShowBreakdown,
      useCompactChart,
      useCompactMarkers,
    }),
    [
      projectedBaseGasPrice,
      projectedStaking,
      forceShowBreakdown,
      useCompactChart,
      useCompactMarkers,
    ],
  );
  const chartSettings = useDebounce(_chartSettings, 100);

  // Transform our input data into series that we'll pass to highcharts
  const [series, totalSupplyByDate] = React.useMemo((): [
    Highcharts.SeriesLineOptions[],
    Record<string, number>,
  ] => {
    const stakingByDate: Record<string, number> = {};
    stakingData.forEach(({ t, v }: { t: string; v: number }) => {
      stakingByDate[t] = v;
    });
    const supplyByDate: Record<string, number> = {};

    const supplySeriesData: number[][] = [];
    const stakingSeriesData: number[][] = [];

    const numSupplyDataPoints = supplyData.length;

    supplyData.forEach(({ t: timestamp, v }: sypplyDataObj, i: number) => {
      // Only render every Nth point for chart performance
      if (i % NUM_DAYS_PER_POINT !== 0 && i < numSupplyDataPoints - 1) {
        return;
      }

      const date = DateFns.parseISO(timestamp);
      const dateMillis: number = DateFns.getTime(date);

      // Subtract any staking eth from total supply on that date
      const stakingSupply: number = stakingByDate[timestamp] || 0;

      stakingSeriesData.push([dateMillis, stakingSupply]);
      supplySeriesData.push([dateMillis, v]);
      supplyByDate[dateMillis] = v;
    });

    /**
     * Projection data
     */
    const lastSupplyPoint = last(supplySeriesData);
    const lastStakingPoint = last(stakingSeriesData);

    // Projection should be 1/3 of chart
    const firstDate = DateFns.parseISO(supplyData[0]!.t);
    const lastDate = DateFns.parseISO(supplyData[supplyData.length - 1]!.t);
    const daysOfData = DateFns.differenceInDays(lastDate, firstDate);
    const daysOfProjection = Math.floor(daysOfData / 2);

    const supplyProj: number[][] = [lastSupplyPoint!];

    const series: Highcharts.SeriesLineOptions[] = [
      {
        id: "supply_line_1",
        type: "line",
        name: t.historical_supply,
        color: {
          linearGradient: {
            x1: 0,
            y1: 1,
            x2: 1,
            y2: 0,
          },
          stops: [
            [0, "#1FD0E1"],
            [1, "#6758F3"],
          ],
        },
        data: [
          ...supplySeriesData,
          ...supplyProj,
          //end point
          {
            x: supplyProj[supplyProj.length - 1]![0],
            y: supplyProj[supplyProj.length - 1]![1],
            marker: {
              symbol: `url(/dot_supply_graph.svg)`,
              enabled: true,
            },
          },
        ],
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
    ];

    return [series, supplyByDate];
  }, [chartSettings, t]);

  // Now build up the Highcharts configuration object
  const options = React.useMemo((): Highcharts.Options => {
    // Animate only after mounting
    const animate = Boolean(chartRef.current);
    const chartOptions: Highcharts.Options = {
      annotations: [
        {
          draggable: "",
        },
      ],
      chart: {
        animation: animate,
        height: 420,
        showAxes: true,
      },
      legend: {
        enabled: false,
      },
      series,
      xAxis: {
        type: "datetime",
        minPadding: 0,
        maxPadding: 0.03,
        tickInterval: 365.25 * 24 * 3600 * 1000, // always use 1 year intervals
      },
      yAxis: {
        min: 0,
        max: 140e6,
        tickInterval: 20e6,
        title: {
          text: undefined,
        },
      },
      //settings marker
      tooltip: {
        shared: true,
        backgroundColor: "transparent",
        padding: 0,
        valueDecimals: 0,
        xDateFormat: "%Y-%m-%d",
        useHTML: true,
        formatter: function () {
          const x: number = this.x !== undefined ? Number(this.x) : 0;
          const dt = new Date(x);
          const header = `<div class="tt-header"><div class="tt-header-date text-slateus-200">${formatDate(
            dt,
          )}</div></div>`;

          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          const total = totalSupplyByDate[x] as number;
          const table = `<table><tbody><tr class="tt-total-row">
              <td class="text-white">${formatOneDecimal(total / 1e6)}M</td>
            </tr></tbody></table>`;
          return `<div class="tt-root">${header}${table}</div>`;
        },
      },
    };
    return merge({}, defaultOptions, chartOptions);
  }, [series, totalSupplyByDate]);

  return (
    <div>
      <div ref={containerRef} className={styles.supplyChart}>
        <HighchartsReact
          options={options}
          highcharts={Highcharts}
          ref={chartRef}
        />
      </div>
    </div>
  );
};

export default React.memo(SupplyChart);
