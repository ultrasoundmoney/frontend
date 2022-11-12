/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as DateFns from "date-fns";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsAnnotations from "highcharts/modules/annotations";
import last from "lodash/last";
import merge from "lodash/merge";
import * as React from "react";
import { useSupplyProjectionInputs } from "../../api/supply-projection";
import { formatOneDecimal } from "../../format";
import TranslationsContext from "../../contexts/TranslationsContext";
import { COLORS, defaultOptions } from "../../utils/chart-defaults";
import {
  estimatedDailyFeeBurn,
  estimatedDailyIssuance,
  estimatedDailyStakeChange,
  formatDate,
} from "../../utils/metric-utils";
import { useDebounce } from "../../utils/use-debounce";
import { useOnResize } from "../../utils/use-on-resize";
import styles from "./TwoYearProjectionChart.module.scss";
import colors from "../../colors";
import { LONDON_TIMESTAMP } from "../../hardforks/london";
import { PARIS_TIMESTAMP } from "../../hardforks/paris";
import _first from "lodash/first";

if (typeof window !== "undefined") {
  // Initialize highchats annotations module (only on browser, doesn't work on server)
  highchartsAnnotations(Highcharts);
}

type Props = {
  projectedStaking: number;
  projectedBaseGasPrice: number;
  projectedMergeDate: Date;
  showBreakdown: boolean;
  onPeakProjectedToggle: (isPeakPresent: boolean) => void;
};

interface HighchartsRef {
  chart: Highcharts.Chart;
  container: React.RefObject<HTMLDivElement>;
}

let mouseOutTimer: NodeJS.Timeout | null = null;

const NUM_DAYS_PER_POINT = 7;
const COMPACT_MARKERS_BELOW_WIDTH = 1440;
const COMPACT_CHART_BELOW_WIDTH = 640;

const SupplyChart: React.FC<Props> = ({
  projectedBaseGasPrice,
  projectedStaking,
  projectedMergeDate,
  showBreakdown: forceShowBreakdown,
  onPeakProjectedToggle,
}) => {
  const t = React.useContext(TranslationsContext);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const chartRef = React.useRef<HighchartsRef | null>(null);

  React.useEffect(() => {
    if (containerRef.current === null) {
      return;
    }

    // Sometimes the chart container resizes to be smaller after
    // the page finishes loading. Force a reflow to handle this.
    const hc = containerRef.current.querySelector(".highcharts-container");
    if (
      chartRef.current !== null &&
      hc !== null &&
      hc.clientWidth > containerRef.current.clientWidth
    ) {
      chartRef.current.chart.reflow();
    }
  }, [t]);

  // Show / hide supply breakdown on hover
  const [showBreakdown, setShowBreakdown] = React.useState(false);
  const handleChartMouseOut = React.useCallback(() => {
    if (mouseOutTimer !== null) {
      clearTimeout(mouseOutTimer);
    }
    mouseOutTimer = setTimeout(() => {
      setShowBreakdown(false);
    }, 200);
  }, []);

  const handleChartMouseOver = React.useCallback(() => {
    if (mouseOutTimer !== null) {
      clearTimeout(mouseOutTimer);
    }
    setShowBreakdown(true);
  }, []);

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
      projectedMergeDate,
      showBreakdown: showBreakdown || forceShowBreakdown,
      useCompactChart,
      useCompactMarkers,
    }),
    [
      projectedBaseGasPrice,
      projectedStaking,
      projectedMergeDate,
      showBreakdown,
      forceShowBreakdown,
      useCompactChart,
      useCompactMarkers,
    ],
  );
  const chartSettings = useDebounce(_chartSettings, 100);

  // Define the event markers that we'll plot on the chart
  const markers = React.useMemo(
    // prettier-ignore
    (): [Date | null, string, string][] => ([
      [DateFns.parseISO("2015-07-31T00:00:00Z"), t.marker_genesis, `5 ETH/${t.marker_block}`],
      [DateFns.parseISO("2017-10-16T00:00:00Z"), "byzantium", `3 ETH/${t.marker_block}`],
      [DateFns.parseISO("2019-02-27T00:00:00Z"), "constantinople", `2 ETH/${t.marker_block}`],
      [DateFns.parseISO("2020-12-01T00:00:00Z"), t.marker_phase_0, t.marker_pos],
      [LONDON_TIMESTAMP, "london", "burn"],
      [chartSettings.projectedMergeDate, t.marker_merge, t.marker_pow_removal],
    ]),
    [chartSettings, t],
  );

  const projectionsInputs = useSupplyProjectionInputs();

  // Transform our input data into series that we'll pass to highcharts
  const [series, annotations, totalSupplyByDate] = React.useMemo((): [
    Highcharts.SeriesAreaOptions[],
    Highcharts.AnnotationsLabelsOptions[],
    Record<string, number>,
  ] => {
    if (projectionsInputs === undefined) {
      return [[], [], {}];
    }

    const {
      inBeaconValidatorsByDay,
      inContractsByDay,
      supplyByDay: supplyData,
    } = projectionsInputs;

    const stakingByDate: Record<number, number | undefined> = {};
    inBeaconValidatorsByDay.forEach(({ t, v }) => {
      stakingByDate[t] = v;
    });

    const contractByDate: Record<number, number | undefined> = {};
    inContractsByDay.forEach(({ t, v }) => {
      contractByDate[t] = v;
    });

    const supplyByDate: Record<string, number> = {};

    const supplySeriesData: number[][] = [];
    const contractSeriesData: number[][] = [];
    const addressSeriesData: number[][] = [];
    const stakingSeriesData: number[][] = [];

    const numSupplyDataPoints = supplyData.length;

    let maxSupply: number | null = null;
    let peakSupply: [number, number] | null = null;

    let lastInContractsIterValue: number | undefined = undefined;

    // Glassnode is currently overcounting ETH after the Paris hardfork as Etherscan was too. Etherscan fixed it. Glassnode not yet, here we manually correct their mistake.
    supplyData.forEach(({ t: timestamp, v: vMiscounted }, i) => {
      const dateTime = DateFns.fromUnixTime(timestamp);

      // Glassnode overcounting per day
      const GLASSNODE_OVERCOUNTING_ETH = ((24 * 60 * 60) / 12) * 2 * 0.99;
      const daysSinceMerge =
        DateFns.differenceInDays(dateTime, PARIS_TIMESTAMP) + 1;

      const v = DateFns.isAfter(dateTime, PARIS_TIMESTAMP)
        ? vMiscounted - GLASSNODE_OVERCOUNTING_ETH * daysSinceMerge
        : vMiscounted;

      // Calculate peak supply
      if (v > (maxSupply || 0)) {
        maxSupply = v;
        peakSupply = null;
      } else if (v < maxSupply! && !peakSupply) {
        const lastPoint = supplyData[i - 1];
        if (lastPoint === undefined) {
          throw new Error("cannot calculate peak supply without supply points");
        }
        const value =
          lastPoint.v - (daysSinceMerge - 1) * GLASSNODE_OVERCOUNTING_ETH;
        peakSupply = [lastPoint.t, value];
      }

      // Only render every Nth point for chart performance
      if (i % NUM_DAYS_PER_POINT !== 0 && i < numSupplyDataPoints - 1) {
        return;
      }

      const dateMillis = DateFns.getTime(dateTime);

      // Subtract any staking eth from total supply on that date
      const stakingSupply = stakingByDate[timestamp];

      if (stakingSupply !== undefined) {
        stakingSeriesData.push([dateMillis, stakingSupply]);
      }

      const nonStakingSupply =
        stakingSupply === undefined ? v : v - stakingSupply;

      // Calculate contract vs address split
      const inContractsPercent =
        contractByDate[timestamp] || lastInContractsIterValue;

      if (inContractsPercent !== undefined) {
        lastInContractsIterValue = inContractsPercent;
        // Glassnode's ETH in contract data includes staked ETH, so we need
        // to subtract staked ETH here since we render it as its own series
        const inContractsValue = inContractsPercent * v - (stakingSupply ?? 0);
        contractSeriesData.push([dateMillis, inContractsValue]);

        const inAddressesValue = (nonStakingSupply ?? v) - inContractsValue;
        addressSeriesData.push([dateMillis, inAddressesValue]);
      }

      supplySeriesData.push([dateMillis, v]);
      supplyByDate[dateMillis] = v;
    });

    /**
     * Projection data
     */
    const lastSupplyPoint = last(supplySeriesData);
    const lastStakingPoint = last(stakingSeriesData);
    const lastAddressPoint = last(addressSeriesData);
    const lastContractPoint = last(contractSeriesData);

    // Projection should be 1/3 of chart
    // const firstDate = DateFns.fromUnixTime(supplyData[0].t);
    const lastDate = DateFns.fromUnixTime(last(supplyData)!.t);
    // const daysOfData = DateFns.differenceInDays(lastDate, firstDate);
    const daysOfProjection = 365 * 2;

    const contractProj: number[][] = [lastContractPoint!];
    const addressProj: number[][] = [lastAddressPoint!];
    const stakingProj: number[][] = [lastStakingPoint!];
    const supplyProj: number[][] = [lastSupplyPoint!];
    const mergeDate = chartSettings.projectedMergeDate;

    let supplyValue = lastSupplyPoint![1];
    let stakingValue = lastStakingPoint![1];
    if (stakingValue === undefined) {
      throw new Error(
        "cannot calculate projected staking value without staking value",
      );
    }

    const maxIssuance = estimatedDailyIssuance(chartSettings.projectedStaking);

    for (let i = 0; i < daysOfProjection; i++) {
      const projDate = DateFns.startOfDay(DateFns.addDays(lastDate, i + 1));

      // Calculate new ETH staking on this day
      if (stakingValue < chartSettings.projectedStaking) {
        // Add ETH to approach projected staking value
        stakingValue = Math.min(
          chartSettings.projectedStaking,
          stakingValue + estimatedDailyStakeChange(stakingValue),
        );
      } else if (stakingValue > chartSettings.projectedStaking) {
        // Subtract ETH to approach projected staking value
        stakingValue = Math.max(
          chartSettings.projectedStaking,
          stakingValue - estimatedDailyStakeChange(stakingValue),
        );
      }

      // Add in PoS issuance
      let newIssuance = estimatedDailyIssuance(stakingValue);
      // If this is berfore the merge, add PoW issuance
      if (DateFns.isBefore(projDate, mergeDate)) {
        newIssuance += 13500;
      }
      // If this is after EIP-1559 calculate the fee burn
      let burn = 0;
      if (DateFns.isAfter(projDate, LONDON_TIMESTAMP)) {
        burn = estimatedDailyFeeBurn(chartSettings.projectedBaseGasPrice);
      }

      if (supplyValue === undefined) {
        throw new Error("cannot calculate supply split without supply value");
      }

      supplyValue = Math.max(supplyValue + newIssuance - burn, 0);

      const nonStakingValue = Math.max(supplyValue - stakingValue, 0);

      if (lastContractPoint === undefined) {
        throw new Error(
          "cannot calculate the in contract value without the last contract point",
        );
      }

      let inContractValue = Math.min(lastContractPoint[1]!, nonStakingValue);
      let inAddressesValue = nonStakingValue - inContractValue;
      // Make sure ETH in addresses doesn't dip way below ETH in contracts
      if (inAddressesValue < inContractValue * 0.5) {
        inContractValue = Math.floor((nonStakingValue * 2) / 3);
        inAddressesValue = nonStakingValue - inContractValue;
      }

      // Make sure our total supply value can't dip below the amount staked
      const adjustedSupplyValue = Math.max(supplyValue, stakingValue);

      // Issuance is a function of ETH staked, but delayed over time.
      // Therefore, we may see a local peak where burn outpaces issuance
      // temporarily. We want our peak to be non-local, we filter the local
      // case.
      const isLongTermContractingSupply = burn > maxIssuance;

      // Calculate peak supply
      if (adjustedSupplyValue > (maxSupply || 0)) {
        maxSupply = adjustedSupplyValue;
        peakSupply = null;
      } else if (
        adjustedSupplyValue < maxSupply! &&
        !peakSupply &&
        isLongTermContractingSupply
      ) {
        peakSupply = [DateFns.getUnixTime(projDate), adjustedSupplyValue];
      }

      // Only render every Nth point for chart performance
      if (i % NUM_DAYS_PER_POINT !== 0) {
        continue;
      }

      const projDateMillis = DateFns.getTime(projDate);
      contractProj.push([projDateMillis, inContractValue]);
      addressProj.push([projDateMillis, inAddressesValue]);
      stakingProj.push([projDateMillis, stakingValue]);
      supplyProj.push([projDateMillis, adjustedSupplyValue]);
      supplyByDate[projDateMillis] = adjustedSupplyValue;
    }

    const projSeriesOptions: Partial<Highcharts.SeriesAreaOptions> = {
      fillOpacity: 0.25,
      dashStyle: "Dash",
      showInLegend: false,
      marker: { symbol: "circle" },
    };

    let series: Highcharts.SeriesAreaOptions[] = [];
    const hiddenStyles: Partial<Highcharts.SeriesAreaOptions> = {
      opacity: 0,
      showInLegend: false,
    };
    const visibleStyles: Partial<Highcharts.SeriesAreaOptions> = {
      opacity: 1,
      showInLegend: true,
    };
    series = [
      {
        id: "supply",
        type: "area",
        name: t.historical_supply,
        color: COLORS.SERIES[0],
        data: supplySeriesData,
        enableMouseTracking: false,
        ...(chartSettings.showBreakdown ? hiddenStyles : visibleStyles),
      },
      {
        id: "supply_projected",
        type: "area",
        name: `${t.eth_supply} (${t.projected})`,
        data: supplyProj,
        color: COLORS.SERIES[0],
        enableMouseTracking: false,
        ...projSeriesOptions,
        showInLegend: true,
        ...(chartSettings.showBreakdown ? hiddenStyles : visibleStyles),
      },
      {
        id: "addresses",
        type: "area",
        name: t.supply_chart_series_address,
        color: COLORS.SERIES[1],
        data: addressSeriesData,
        marker: { symbol: "circle" },
        stack: "historical",
        ...(chartSettings.showBreakdown ? visibleStyles : hiddenStyles),
      },
      {
        id: "contracts",
        type: "area",
        name: t.supply_chart_series_contracts,
        color: COLORS.SERIES[2],
        data: contractSeriesData,
        marker: { symbol: "circle" },
        stack: "historical",
        ...(chartSettings.showBreakdown ? visibleStyles : hiddenStyles),
      },
      {
        id: "staking",
        type: "area",
        name: t.supply_chart_series_staking,
        color: COLORS.SERIES[5],
        data: stakingSeriesData,
        marker: { symbol: "circle" },
        stack: "historical",
        ...(chartSettings.showBreakdown ? visibleStyles : hiddenStyles),
      },
      {
        id: "addresses_projected",
        type: "area",
        name: `${t.supply_chart_series_address} (${t.projected})`,
        data: addressProj,
        color: COLORS.SERIES[1],
        stack: "projected",
        ...(chartSettings.showBreakdown ? visibleStyles : hiddenStyles),
        ...projSeriesOptions,
      },
      {
        id: "contracts_projected",
        type: "area",
        name: `${t.supply_chart_series_contracts} (${t.projected})`,
        data: contractProj,
        color: COLORS.SERIES[2],
        stack: "projected",
        ...(chartSettings.showBreakdown ? visibleStyles : hiddenStyles),
        ...projSeriesOptions,
      },
      {
        id: "staking_projected",
        type: "area",
        name: `${t.supply_chart_series_staking} (${t.projected})`,
        data: stakingProj,
        color: COLORS.SERIES[5],
        stack: "projected",
        ...(chartSettings.showBreakdown ? visibleStyles : hiddenStyles),
        ...projSeriesOptions,
      },
    ];

    // If we found a peak supply value, render an annotation at the peak
    const annotations: Highcharts.AnnotationsLabelsOptions[] = [];
    if (peakSupply) {
      const peakSupplyDate = DateFns.fromUnixTime(peakSupply[0]);
      const isProjected = DateFns.isAfter(peakSupplyDate, new Date());
      const annotation: Highcharts.AnnotationsLabelsOptions = {
        point: {
          xAxis: 0,
          yAxis: 0,
          x: DateFns.getTime(DateFns.fromUnixTime(peakSupply[0])),
          y: maxSupply!,
        },
        text: `<div class="ann-root">
          <div class="ann-title">${t.peak_supply}</div>
          ${isProjected ? `<div class="ann-proj">(Projected)</div>` : ""}
          <div class="ann-value">${formatOneDecimal(
            peakSupply[1] / 1e6,
          )}M ETH</div>
          </div>`,
        padding: 10,
        borderRadius: 10,
        useHTML: true,
      };
      annotations.push(annotation);
      onPeakProjectedToggle(true);
    } else {
      onPeakProjectedToggle(false);
    }

    return [series, annotations, supplyByDate];
  }, [chartSettings, onPeakProjectedToggle, t, projectionsInputs]);

  // Now build up the Highcharts configuration object
  const options = React.useMemo((): Highcharts.Options => {
    // Animate only after mounting
    const animate = Boolean(chartRef.current);

    if (typeof window !== "undefined") {
      Highcharts.setOptions({
        lang: {
          thousandsSep: t.chart_thousands_sep,
          decimalPoint: t.chart_decimal_point,
        },
      });
    }

    const chartOptions: Highcharts.Options = {
      annotations: [
        {
          draggable: "",
          labelOptions: {
            backgroundColor: COLORS.TOOLTIP_BG,
            borderWidth: 0,
            // Display above chart
            // verticalAlign: "bottom",
            // y: -7,
            verticalAlign: "top",
            y: 7,
          },
          labels: annotations,
        },
      ],
      chart: {
        animation: animate,
        height: chartSettings.useCompactChart ? 300 : 380,
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
      plotOptions: {
        area: {
          animation: animate,
          events: {
            mouseOver: handleChartMouseOver,
            mouseOut: handleChartMouseOut,
          },
        },
      },
      legend: {
        // Usinga custom legend for more control over responsiveness
        enabled: false,
      },
      series,
      xAxis: {
        type: "datetime",
        minPadding: 0,
        maxPadding: 0,
        tickInterval: 365.25 * 24 * 3600 * 1000, // always use 1 year intervals
        plotLines: markers.map(([date, title, subtitle], i) => ({
          value: DateFns.getTime(date!),
          color: COLORS.PLOT_LINE,
          width: 1,
          label: {
            rotation: 0,
            text: chartSettings.useCompactMarkers
              ? String.fromCharCode(65 + i) // A, B, C, D, etc.
              : `${title}<br><b>${subtitle}</b>`,
            style: {
              color: "#b5bddb",
              whiteSpace: "normal",
              fontSize: "11px",
            },
            y: 18,
            x: 6,
          },
          zIndex: 3,
        })),
      },
      yAxis: {
        min: 0,
        max: 160e6,
        tickInterval: 20e6,
        title: {
          text: undefined,
        },
      },
      tooltip: {
        shared: true,
        backgroundColor: "transparent",
        padding: 0,
        valueDecimals: 0,
        xDateFormat: "%Y-%m-%d",
        useHTML: true,
        formatter: function () {
          let points = (this.points || []).slice(0);

          // Historical & projected overlap at current date; only show historical on that date
          if (points.length > 4) {
            points = points.filter(
              (p) => !p.series.userOptions.id?.includes("projected"),
            );
          }

          const firstPoint = _first(points);

          if (firstPoint === undefined) {
            return "";
          }

          const isProjected =
            firstPoint.series.userOptions.id?.includes("projected");

          const dt = new Date(this.x || 0);
          const header = `<div class="tt-header"><div class="tt-header-date text-slateus-200">${formatDate(
            dt,
          )}</div>${
            isProjected
              ? `<div class="tt-header-projected">(${t.projected})</div>`
              : ""
          }</div>`;

          const rows = points.map(
            (p) =>
              `<tr>
              <td>
                <div class="tt-series">
                  <div class="tt-series-color" style="background-color:${
                    p.series.userOptions.color
                  }"></div>
                  <div class="tt-series-name">${
                    p.series.name.split(" (")[0]
                  }</div>
                </div>
              </td>
              <td class="text-white">${formatOneDecimal(
                (p.y || 0) / 1e6,
              )}M ETH</td>
              </tr>`,
          );

          // Show total supply last
          const total = totalSupplyByDate[this.x || 0];
          if (total === undefined) {
            return "";
          }
          rows.push(
            `<tr class="tt-total-row">
              <td><div class="tt-series-name">${t.total_supply}</div></td>
              <td class="text-white">${formatOneDecimal(total / 1e6)}M ETH</td>
            </tr>`,
          );

          const table = `<table><tbody>${rows.join("")}</tbody></table>`;
          return `<div class="tt-root">${header}${table}</div>`;
        },
      },
    };
    return merge({}, defaultOptions, chartOptions);
  }, [
    annotations,
    handleChartMouseOver,
    handleChartMouseOut,
    markers,
    series,
    t,
    totalSupplyByDate,
    chartSettings,
  ]);

  const legendItems = series.filter((s) => s.showInLegend);

  return (
    <>
      <div ref={containerRef} className={styles.supplyChart}>
        <HighchartsReact
          options={options}
          highcharts={Highcharts}
          ref={chartRef}
        />
        <div className={styles.legend}>
          {legendItems.map((s) => (
            <div key={s.id} className={styles.legendItem}>
              <div
                className={styles.legendItemColor}
                style={{
                  backgroundColor: String(s.color),
                  opacity: s.fillOpacity,
                }}
              />
              <div
                className={styles.legendItemName}
                style={{ color: COLORS.LABEL }}
              >
                {s.id === "supply_projected" ? t.projected_supply : s.name}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.markerLegend}>
          {markers.map(([, title, subtitle], i) => (
            <div key={title} className={styles.markerLegendItem}>
              <div className={styles.markerLegendCount}>
                {String.fromCharCode(65 + i)}
              </div>
              <div>
                <div className={styles.markerLegendTitle}>{title}</div>
                <div className={styles.markerLegendSubtitle}>{subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default React.memo(SupplyChart);
