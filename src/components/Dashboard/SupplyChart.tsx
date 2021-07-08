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

let mouseOutTimer: NodeJS.Timeout | null = null;

const NUM_DAYS_PER_POINT = 7;

function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
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

  const handleChartMouseOver = React.useCallback(() => {
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
        stakingValue = Math.min(
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

      const burn = estimatedDailyFeeBurn(variables.projectedBaseGasPrice);

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
    };

    let series: Highcharts.SeriesAreaOptions[] = [];
    if (variables.showBreakdown) {
      series = [
        {
          id: "addresses",
          type: "area",
          name: t.supply_chart_series_address,
          color: COLORS.SERIES[0],
          data: addressSeriesData,
          marker: { symbol: "circle" },
          stack: "historical",
        },
        {
          id: "contracts",
          type: "area",
          name: t.supply_chart_series_contracts,
          color: COLORS.SERIES[1],
          data: contractSeriesData,
          marker: { symbol: "square" },
          stack: "historical",
        },
        {
          id: "staking",
          type: "area",
          name: t.supply_chart_series_staking,
          color: COLORS.SERIES[2],
          data: stakingSeriesData,
          marker: { symbol: "diamond" },
          stack: "historical",
        },
        {
          id: "addresses_projected",
          type: "area",
          name: `${t.supply_chart_series_address} (${t.projected})`,
          data: addressProj,
          color: COLORS.SERIES[0],
          marker: { symbol: "circle" },
          stack: "projected",
          ...projSeriesOptions,
        },
        {
          id: "contracts_projected",
          type: "area",
          name: `${t.supply_chart_series_contracts} (${t.projected})`,
          data: contractProj,
          color: COLORS.SERIES[1],
          marker: { symbol: "square" },
          stack: "projected",
          ...projSeriesOptions,
        },
        {
          id: "staking_projected",
          type: "area",
          name: `${t.supply_chart_series_staking} (${t.projected})`,
          data: stakingProj,
          color: COLORS.SERIES[2],
          marker: { symbol: "diamond" },
          stack: "projected",
          ...projSeriesOptions,
        },
      ];
    } else {
      series = [
        {
          id: "supply",
          type: "area",
          name: t.historical_supply,
          color: COLORS.SERIES[0],
          data: supplySeriesData,
        },
        {
          id: "supply_projected",
          type: "area",
          name: `${t.eth_supply} (${t.projected})`,
          data: supplyProj,
          color: COLORS.SERIES[0],
          ...projSeriesOptions,
          showInLegend: true,
        },
      ];
    }

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
      },
      plotOptions: {
        area: {
          animation: animate,
          events: {
            mouseOut: handleChartMouseOut,
            mouseOver: handleChartMouseOver,
            legendItemClick: function (e) {
              e.preventDefault();
            },
          },
        },
      },
      legend: {
        labelFormatter: function () {
          const s = this as Highcharts.Series;
          if (s.userOptions.id === "supply_projected") {
            return t.projected_supply;
          }
          return s.name;
        },
      },
      series,
      xAxis: {
        type: "datetime",
        minPadding: 0,
        maxPadding: 0,
        /*
        plotLines: [
          {
            value: DateTime.fromISO("2021-08-04T00:00:00Z").toMillis(),
            color: COLORS.LABEL,
            width: 1,
            label: {
              text: "EIP 1559",
              style: {
                color: COLORS.LABEL,
              },
              y: 2,
            },
            zIndex: 2,
          },
          {
            value: variables.projectedMergeDate.toMillis(),
            color: COLORS.LABEL,
            width: 1,
            label: {
              text: "Merge",
              style: {
                color: COLORS.LABEL,
              },
              y: 2,
            },
            zIndex: 2,
          },
        ],
        */
      },
      yAxis: {
        min: 0,
        max: 140e6,
        tickInterval: 20e6,
        title: {
          text: undefined,
          // text: "ETH",
        },
      },
      tooltip: {
        shared: true,
        // split: true,
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
  }, [series, handleChartMouseOut, handleChartMouseOver, t, totalSupplyByDate]);

  return (
    <>
      <div className={styles.supplyChart}>
        <HighchartsReact
          options={options}
          highcharts={Highcharts}
          ref={chartRef}
        />
      </div>
    </>
  );
};

export default React.memo(SupplyChart);
