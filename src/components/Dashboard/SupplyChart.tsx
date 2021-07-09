import * as React from "react";
import * as Highcharts from "highcharts";
import { DateTime } from "luxon";
import HighchartsReact from "highcharts-react-official";
import merge from "lodash/merge";
import { useDebounce } from "../../utils/use-debounce";
import { useTranslations } from "../../utils/use-translation";
import {
  estimatedDailyFeeBurn,
  estimatedDailyIssuance,
  estimatedDailyStakeChange,
} from "../../utils/metric-utils";
import { defaultOptions, COLORS } from "./chart-defaults";

import supplyData from "./supply-total.json";
import stakingData from "./supply-staking.json";
import contractData from "./supply-in-smart-contracts.json";

import styles from "./SupplyChart.module.scss";

interface Props {
  projectedStaking: number;
  projectedBaseGasPrice: number;
  projectedMergeDate: DateTime;
}

interface HighchartsRef {
  chart: Highcharts.Chart;
  container: React.RefObject<HTMLDivElement>;
}

const intlFormatter = new Intl.NumberFormat();

const LONDON_DATE = DateTime.fromISO("2021-08-04T00:00:00Z");

let mouseOutTimer: NodeJS.Timeout | null = null;

const NUM_DAYS_PER_POINT = 7;

function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

function createPlotline(value: number, text: string) {
  return {
    value,
    color: COLORS.LABEL,
    width: 1,
    label: {
      rotation: 0,
      text,
      style: {
        color: "#fff",
        whiteSpace: "normal",
        fontSize: "11px",
      },
      y: 12,
    },
    zIndex: 3,
  };
}

const SupplyChart: React.FC<Props> = ({
  projectedBaseGasPrice,
  projectedStaking,
  projectedMergeDate,
}) => {
  const { translations: t } = useTranslations();
  React.useEffect(() => {
    Highcharts.setOptions({
      lang: {
        thousandsSep: t.chart_thousands_sep,
        decimalPoint: t.chart_decimal_point,
      },
    });
  }, [t]);

  const chartRef = React.useRef<HighchartsRef | null>(null);
  const [showBreakdown, setShowBreakdown] = React.useState(false);
  // TODO enable this if ETH fee burn is currently higher than issuance
  const [isUltraSound, setIsUltraSound] = React.useState(false);

  const handleChartMouseOver = React.useCallback((evt) => {
    clearTimeout(mouseOutTimer);
    setShowBreakdown(true);
  }, []);

  const handleChartMouseOut = React.useCallback(() => {
    clearTimeout(mouseOutTimer);
    mouseOutTimer = setTimeout(() => {
      setShowBreakdown(false);
    }, 200);
  }, []);

  const _variables = React.useMemo(
    () => ({
      projectedBaseGasPrice,
      projectedStaking,
      projectedMergeDate,
      showBreakdown,
    }),
    [projectedBaseGasPrice, projectedStaking, projectedMergeDate, showBreakdown]
  );
  // Debounce how fast the variables can change to prevent UI from locking up
  const variables = useDebounce(_variables, 50);

  const [series, totalSupplyByDate] = React.useMemo((): [
    Highcharts.SeriesOptionsType[],
    Record<string, number>
  ] => {
    const stakingByDate = {};
    stakingData.forEach(({ t, v }) => {
      stakingByDate[t] = v;
    });

    const contractByDate = {};
    contractData.forEach(({ t, v }) => {
      contractByDate[t] = v;
    });

    const supplyByDate: Record<string, number> = {};

    const supplySeriesData: number[][] = [];
    const contractSeriesData: number[][] = [];
    const addressSeriesData: number[][] = [];
    const stakingSeriesData: number[][] = [];

    const numSupplyDataPoints = supplyData.length;
    supplyData.forEach(({ t, v }, i) => {
      // Only render every Nth point for chart performance
      if (i % NUM_DAYS_PER_POINT !== 0 && i < numSupplyDataPoints - 1) {
        return;
      }
      // Subtract any staking eth from total supply on that date
      const stakingSupply = stakingByDate[t] || 0;
      const nonStakingSupply = v - stakingSupply;

      const date = DateTime.fromISO(t, { zone: "utc" });
      const dateMillis = date.toMillis();
      if (stakingByDate[t]) {
        stakingSeriesData.push([dateMillis, stakingByDate[t]]);
      }

      const inContractsPct = contractByDate[t];
      let inAddressesValue = nonStakingSupply;
      if (inContractsPct !== undefined) {
        // Glassnode's ETH in contract data includes staked ETH, so we need
        // to subtract it here since we render staked ETH separately
        const inContractsValue = inContractsPct * v - stakingSupply;
        contractSeriesData.push([dateMillis, inContractsValue]);
        inAddressesValue -= inContractsValue;
      } else {
        contractSeriesData.push([dateMillis, 0]);
      }

      addressSeriesData.push([dateMillis, inAddressesValue]);
      supplySeriesData.push([dateMillis, v]);
      supplyByDate[dateMillis] = v;
    });

    // Projections
    const lastSupplyPoint = last(supplySeriesData);
    const lastStakingPoint = last(stakingSeriesData);
    const lastAddressPoint = last(addressSeriesData);
    const lastContractPoint = last(contractSeriesData);

    // Projection should be 1/3 of chart
    const firstDate = DateTime.fromISO(supplyData[0].t, { zone: "utc" });
    const lastDate = DateTime.fromISO(last(supplyData).t, { zone: "utc" });
    const daysOfData = lastDate.diff(firstDate, "days").days;
    const daysOfProjection = Math.floor(daysOfData / 2);

    const contractProj: number[][] = [lastContractPoint];
    const addressProj: number[][] = [lastAddressPoint];
    const stakingProj: number[][] = [lastStakingPoint];
    const supplyProj: number[][] = [lastSupplyPoint];
    const mergeDate = variables.projectedMergeDate.toSeconds();

    let supplyValue = lastSupplyPoint[1];
    let stakingValue = lastStakingPoint[1];
    for (let i = 0; i < daysOfProjection; i++) {
      const projDate = lastDate.plus({ days: i + 1 }).startOf("day");

      // Calculate new ETH staking on this day
      if (stakingValue < variables.projectedStaking) {
        // Add ETH to approach projected staking value
        stakingValue = Math.min(
          variables.projectedStaking,
          stakingValue + estimatedDailyStakeChange(stakingValue)
        );
      } else if (stakingValue > variables.projectedStaking) {
        // Subtract ETH to approach projected staking value
        stakingValue = Math.max(
          variables.projectedStaking,
          stakingValue - estimatedDailyStakeChange(stakingValue)
        );
      }

      // Add in PoS issuance
      let newIssuance = estimatedDailyIssuance(stakingValue);
      // If this is berfore the merge, add PoW issuance
      if (projDate.toSeconds() < mergeDate) {
        newIssuance += 13500;
      }
      // If this is after EIP-1559 calculate the fee burn
      let burn = 0;
      if (projDate.toSeconds() >= LONDON_DATE.toSeconds()) {
        burn = estimatedDailyFeeBurn(variables.projectedBaseGasPrice);
      }

      supplyValue = Math.max(supplyValue + newIssuance - burn, 0);

      // Only render every Nth point for chart performance
      if (i % NUM_DAYS_PER_POINT !== 0) {
        continue;
      }

      const nonStakingValue = Math.max(supplyValue - stakingValue, 0);

      let inContractValue = Math.min(lastContractPoint[1], nonStakingValue);
      let inAddressesValue = nonStakingValue - inContractValue;
      // Make sure ETH in addresses doesn't dip way below ETH in contracts
      if (inAddressesValue < inContractValue * 0.5) {
        inContractValue = Math.floor((nonStakingValue * 2) / 3);
        inAddressesValue = nonStakingValue - inContractValue;
      }

      // Make sure our total supply value can't dip below the amount staked
      const adjustedSupplyValue = Math.max(supplyValue, stakingValue);

      const projDateMillis = projDate.toMillis();
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
        ...(variables.showBreakdown ? hiddenStyles : visibleStyles),
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
        ...(variables.showBreakdown ? hiddenStyles : visibleStyles),
      },
      {
        id: "addresses",
        type: "area",
        name: t.supply_chart_series_address,
        color: COLORS.SERIES[1],
        data: addressSeriesData,
        marker: { symbol: "circle" },
        stack: "historical",
        ...(variables.showBreakdown ? visibleStyles : hiddenStyles),
      },
      {
        id: "contracts",
        type: "area",
        name: t.supply_chart_series_contracts,
        color: COLORS.SERIES[2],
        data: contractSeriesData,
        marker: { symbol: "circle" },
        stack: "historical",
        ...(variables.showBreakdown ? visibleStyles : hiddenStyles),
      },
      {
        id: "staking",
        type: "area",
        name: t.supply_chart_series_staking,
        color: COLORS.SERIES[5],
        data: stakingSeriesData,
        marker: { symbol: "circle" },
        stack: "historical",
        ...(variables.showBreakdown ? visibleStyles : hiddenStyles),
      },
      {
        id: "addresses_projected",
        type: "area",
        name: `${t.supply_chart_series_address} (${t.projected})`,
        data: addressProj,
        color: COLORS.SERIES[1],
        stack: "projected",
        ...(variables.showBreakdown ? visibleStyles : hiddenStyles),
        ...projSeriesOptions,
      },
      {
        id: "contracts_projected",
        type: "area",
        name: `${t.supply_chart_series_contracts} (${t.projected})`,
        data: contractProj,
        color: COLORS.SERIES[2],
        stack: "projected",
        ...(variables.showBreakdown ? visibleStyles : hiddenStyles),
        ...projSeriesOptions,
      },
      {
        id: "staking_projected",
        type: "area",
        name: `${t.supply_chart_series_staking} (${t.projected})`,
        data: stakingProj,
        color: COLORS.SERIES[5],
        stack: "projected",
        ...(variables.showBreakdown ? visibleStyles : hiddenStyles),
        ...projSeriesOptions,
      },
    ];

    return [series, supplyByDate];
  }, [variables, t]);

  const options = React.useMemo((): Highcharts.Options => {
    // Animate only if we're changing the underlying data & not the number of series
    const animate = Boolean(
      chartRef.current && series.length === chartRef.current.chart.series.length
    );

    const chartOptions: Highcharts.Options = {
      chart: {
        animation: animate,
        height:
          typeof window !== "undefined" && window.innerWidth > 640 ? 380 : 300,
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
        plotLines: [
          createPlotline(
            DateTime.fromISO("2015-07-31T00:00:00Z").toMillis(),
            "genesis<br>5 ETH/block</div>"
          ),
          createPlotline(
            DateTime.fromISO("2017-10-16T00:00:00Z").toMillis(),
            "Byzantium<br>3 ETH/block"
          ),
          createPlotline(
            DateTime.fromISO("2019-02-27T00:00:00Z").toMillis(),
            "Constantinople<br>2 ETH/block"
          ),
          createPlotline(
            DateTime.fromISO("2020-12-01T00:00:00Z").toMillis(),
            "phase 0<br>PoS"
          ),
          createPlotline(LONDON_DATE.toMillis(), "London<br>EIP-1559"),
          createPlotline(
            variables.projectedMergeDate.toMillis(),
            "merge<br>PoW removal"
          ),
        ],
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
        valueDecimals: 0,
        xDateFormat: "%Y-%m-%d",
        useHTML: true,
        formatter: function () {
          let points = (this.points || []).slice(0);

          // Historical/projected overlap at current date; only show historical on that date
          if (points.length > 4) {
            points = points.filter(
              (p) => !p.series.userOptions.id.includes("projected")
            );
          }

          const isProjected = points[0].series.userOptions.id.includes(
            "projected"
          );

          const dt = DateTime.fromMillis(this.x, { zone: "utc" });
          const header = `<div class="tt-header"><div class="tt-header-date">${dt.toISODate()}</div>${
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
              <td>${intlFormatter.format(Math.round(p.y))} ETH</td>
              </tr>`
          );

          // Show total supply last
          const total = totalSupplyByDate[this.x];
          rows.push(
            `<tr class="tt-total-row">
              <td><div class="tt-series-name">${t.total_supply}</div></td>
              <td>${intlFormatter.format(Math.round(total))} ETH</td>
            </tr>`
          );

          const table = `<table><tbody>${rows.join("")}</tbody></table>`;
          return `<div class="tt-root">${header}${table}</div>`;
        },
      },
    };
    return merge({}, defaultOptions, chartOptions);
  }, [
    handleChartMouseOver,
    handleChartMouseOut,
    series,
    t,
    totalSupplyByDate,
    variables,
  ]);

  const legendItems = series.filter((s) => s.showInLegend);

  return (
    <>
      <div className={styles.supplyChart}>
        {isUltraSound && <div className={styles.ultraSound}>🦇🔉</div>}
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
                  opacity: (s as Highcharts.SeriesAreaOptions).fillOpacity,
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
      </div>
    </>
  );
};

export default React.memo(SupplyChart);
