import * as React from "react";
import * as Highcharts from "highcharts";
import { DateTime } from "luxon";
import HighchartsReact from "highcharts-react-official";
import merge from "lodash/merge";
import { useDebounce } from "../../utils/use-debounce";
import { defaultOptions, COLORS } from "./chart-defaults";

import supplyData from "./supply-total.json";
import stakingData from "./supply-staking.json";
import contractData from "./supply-in-smart-contracts.json";
import {
  estimatedDailyFeeBurn,
  estimatedDailyIssuance,
  estimatedDailyStakeChange,
} from "../../utils/metric-utils";

interface Props {
  Data?: Data;
  projectedStaking: number;
  projectedBaseGasPrice: number;
  projectedMergeDate: DateTime;
}

let mouseOutTimer: NodeJS.Timeout | null = null;

interface HighchartsRef {
  chart: Highcharts.Chart;
  container: React.RefObject<HTMLDivElement>;
}

const SupplyChart: React.FC<Props> = ({
  Data,
  projectedBaseGasPrice,
  projectedStaking,
  projectedMergeDate,
}) => {
  React.useEffect(() => {
    Highcharts.setOptions({
      lang: {
        thousandsSep: Data.chart_thousands_sep,
        decimalPoint: Data.chart_decimal_point,
      },
    });
  }, [Data]);

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

    const now = +new Date();
    const oneYearMs = 365 * 24 * 60 * 60 * 1000;
    supplyData.forEach(({ t, v }) => {
      // Subtract any staking eth from total supply on that date
      const stakedSupply = stakingByDate[t] || 0;
      const unstakedSupply = v - stakedSupply;
      // Only show 1 year of historical data for now
      // TODO make this dynamic
      const date = +new Date(t);
      if (now - date > oneYearMs) {
        return;
      }

      if (stakingByDate[t]) {
        stakingSeriesData.push([date, Math.round(stakingByDate[t])]);
      }

      const inContractsPct = contractByDate[t];
      let inAddressesValue = unstakedSupply;
      if (inContractsPct !== undefined) {
        // In-contract eth includes staked eth
        const inContractsValue = inContractsPct * v - stakedSupply;
        contractSeriesData.push([date, Math.round(inContractsValue)]);
        inAddressesValue -= inContractsValue;
      }
      addressSeriesData.push([date, Math.round(inAddressesValue)]);
      totalSupplyData.push([date, Math.round(v)]);
    });

    // Projections
    const { t: lastDateStr, v: value } = supplyData[supplyData.length - 1];
    const lastDate = new Date(+new Date(lastDateStr) + 1);
    const lastStakingValue = stakingSeriesData[stakingSeriesData.length - 1][1];
    const lastContractPct = contractData[contractData.length - 1].v;

    const contractProj: number[][] = [];
    const addressProj: number[][] = [];
    const stakingProj: number[][] = [];
    const totalSupplyProj: number[][] = [];
    const mergeDate = variables.projectedMergeDate.toJSDate();

    let supplyValue = value;
    let stakingValue = lastStakingValue;
    for (let i = 0; i < 365; i++) {
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
      if (lastDate < mergeDate) {
        newIssuance += 13500;
      }

      const burn = estimatedDailyFeeBurn(variables.projectedBaseGasPrice);

      supplyValue = supplyValue + newIssuance - burn;

      const unstakedValue = supplyValue - stakingValue;

      const inContractValue = supplyValue * lastContractPct - stakingValue;
      const inAddressesValue = unstakedValue - inContractValue;

      contractProj.push([+lastDate, Math.round(inContractValue)]);
      addressProj.push([+lastDate, Math.round(inAddressesValue)]);
      stakingProj.push([+lastDate, Math.round(stakingValue)]);
      totalSupplyProj.push([+lastDate, supplyValue]);

      // TODO Reliably round to start of day
      lastDate.setDate(lastDate.getDate() + 1);
      lastDate.setMilliseconds(0);
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
          name: Data.supply_chart_series_address,
          color: COLORS.SERIES[0],
          data: addressSeriesData,
        },
        {
          id: "contracts",
          type: "area",
          name: Data.supply_chart_series_contracts,
          color: COLORS.SERIES[1],
          data: contractSeriesData,
        },
        {
          id: "staking",
          type: "area",
          name: Data.supply_chart_series_staking,
          color: COLORS.SERIES[2],
          data: stakingSeriesData,
        },
        {
          id: "addresses_projected",
          type: "area",
          name: `${Data.supply_chart_series_address} (${Data.projected})`,
          data: addressProj,
          color: COLORS.SERIES[0],
          ...projSeriesOptions,
        },
        {
          id: "contracts_projected",
          type: "area",
          name: `${Data.supply_chart_series_contracts} (${Data.projected})`,
          data: contractProj,
          color: COLORS.SERIES[1],
          ...projSeriesOptions,
        },
        {
          id: "staking_projected",
          type: "area",
          name: `${Data.supply_chart_series_staking} (${Data.projected})`,
          data: stakingProj,
          color: COLORS.SERIES[2],
          ...projSeriesOptions,
        },
      ];
    } else {
      series = [
        {
          id: "total_supply",
          type: "area",
          name: Data.total_eth_supply,
          color: COLORS.SERIES[0],
          data: totalSupplyData,
        },
        {
          id: "total_supply_projected",
          type: "area",
          name: `${Data.total_eth_supply} (${Data.projected})`,
          data: totalSupplyProj,
          color: COLORS.SERIES[0],
          ...projSeriesOptions,
        },
      ];
    }

    return series;
  }, [variables, Data]);

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
      series,
      xAxis: {
        type: "datetime",
      },
      yAxis: {
        min: 0,
        title: {
          text: undefined,
          // text: "ETH",
        },
      },
      tooltip: {
        split: true,
      },
    };
    return merge({}, defaultOptions, chartOptions);
  }, [series, handleChartMouseOut, handleChartMouseOver]);

  return (
    <>
      <div className="supply-chart">
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
