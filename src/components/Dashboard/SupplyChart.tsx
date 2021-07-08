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

let mouseOutTimer: NodeJS.Timeout | null = null;

interface HighchartsRef {
  chart: Highcharts.Chart;
  container: React.RefObject<HTMLDivElement>;
}

const NUM_DAYS_PER_POINT = 7;

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

  const series = React.useMemo((): Highcharts.SeriesOptionsType[] => {
    const stakingByDate = {};
    stakingData.forEach(({ t, v }) => {
      stakingByDate[t] = v;
    });

    const contractByDate = {};
    contractData.forEach(({ t, v }) => {
      contractByDate[t] = v;
    });

    const totalSupplyData: number[][] = [];
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
      totalSupplyData.push([dateMillis, v]);
    });

    // Projections
    const { t: firstDateStr } = supplyData[0];
    const { t: lastDateStr, v: lastSupplyValue } = supplyData[
      supplyData.length - 1
    ];
    const firstDate = DateTime.fromISO(firstDateStr, { zone: "utc" });
    const lastDate = DateTime.fromISO(lastDateStr, { zone: "utc" });
    const daysOfData = lastDate.diff(firstDate, "days").days;
    // Projection should be 1/3 of chart
    const daysOfProjection = Math.floor(daysOfData / 2);
    const lastStakingValue = stakingSeriesData[stakingSeriesData.length - 1][1];
    const lastContractValue =
      contractSeriesData[contractSeriesData.length - 1][1];

    const contractProj: number[][] = [];
    const addressProj: number[][] = [];
    const stakingProj: number[][] = [];
    const totalSupplyProj: number[][] = [];
    const mergeDate = variables.projectedMergeDate.toSeconds();

    let supplyValue = lastSupplyValue;
    let stakingValue = lastStakingValue;
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

      let inContractValue = Math.min(lastContractValue, nonStakingValue);
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
      totalSupplyProj.push([projDateMillis, adjustedSupplyValue]);
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
          id: "total_supply_invisible",
          type: "area",
          name: t.total_supply,
          color: COLORS.SERIES[5],
          data: totalSupplyData,
          opacity: 0,
          showInLegend: false,
          stacking: undefined,
          stack: "total_supply_invisible",
        },
        {
          id: "addresses",
          type: "area",
          name: t.supply_chart_series_address,
          color: COLORS.SERIES[0],
          data: addressSeriesData,
          marker: { symbol: "circle" },
        },
        {
          id: "contracts",
          type: "area",
          name: t.supply_chart_series_contracts,
          color: COLORS.SERIES[1],
          data: contractSeriesData,
          marker: { symbol: "square" },
        },
        {
          id: "staking",
          type: "area",
          name: t.supply_chart_series_staking,
          color: COLORS.SERIES[2],
          data: stakingSeriesData,
          marker: { symbol: "diamond" },
        },
        {
          id: "total_supply_projected_invisible",
          type: "area",
          name: `${t.total_supply} (${t.projected})`,
          data: totalSupplyProj,
          color: COLORS.SERIES[5],
          opacity: 0,
          showInLegend: false,
          stacking: undefined,
          stack: "total_supply_projected_invisible",
        },
        {
          id: "addresses_projected",
          type: "area",
          name: `${t.supply_chart_series_address} (${t.projected})`,
          data: addressProj,
          color: COLORS.SERIES[0],
          marker: { symbol: "circle" },
          ...projSeriesOptions,
        },
        {
          id: "contracts_projected",
          type: "area",
          name: `${t.supply_chart_series_contracts} (${t.projected})`,
          data: contractProj,
          color: COLORS.SERIES[1],
          marker: { symbol: "square" },
          ...projSeriesOptions,
        },
        {
          id: "staking_projected",
          type: "area",
          name: `${t.supply_chart_series_staking} (${t.projected})`,
          data: stakingProj,
          color: COLORS.SERIES[2],
          marker: { symbol: "diamond" },
          ...projSeriesOptions,
        },
      ];
    } else {
      series = [
        {
          id: "total_supply",
          type: "area",
          name: t.historical_supply,
          color: COLORS.SERIES[0],
          data: totalSupplyData,
        },
        {
          id: "total_supply_projected",
          type: "area",
          name: `${t.eth_supply} (${t.projected})`,
          data: totalSupplyProj,
          color: COLORS.SERIES[0],
          ...projSeriesOptions,
          showInLegend: true,
        },
      ];
    }

    return series;
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
          },
        },
      },
      legend: {
        labelFormatter: function () {
          const s = this as Highcharts.Series;
          if (s.userOptions.id === "total_supply_projected") {
            return t.projected_supply;
          }
          return s.name;
        },
      },
      series,
      xAxis: {
        type: "datetime",
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
        max: 150e6,
        title: {
          text: undefined,
          // text: "ETH",
        },
      },
      tooltip: {
        shared: true,
        // split: true,
        valueDecimals: 0,
        valueSuffix: " ETH",
        xDateFormat: "%Y-%m-%d",
      },
    };
    return merge({}, defaultOptions, chartOptions);
  }, [series, handleChartMouseOut, handleChartMouseOver, t]);

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
