import * as React from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import merge from "lodash/merge";
import { useDebounce } from "../../utils/use-debounce";
import { defaultOptions, COLORS } from "./chart-defaults";

import supplyData from "./supply.json";
import stakingData from "./staking.json";

interface Props {
  Data?: Data;
  projectedStaking: number;
  projectedBaseGasPrice: number;
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
      showBreakdown,
    }),
    [projectedBaseGasPrice, projectedStaking, showBreakdown]
  );
  // Debounce how fast the variables can change to prevent UI from locking up
  const variables = useDebounce(_variables, 50);

  const series = React.useMemo((): Highcharts.SeriesOptionsType[] => {
    const stakingByDate = {};

    const now = +new Date();
    const oneYearMs = 365 * 24 * 60 * 60 * 1000;

    const stakingChartData: number[][] = [];
    stakingData.forEach(({ t, v }) => {
      stakingByDate[t] = v;
      const date = +new Date(t);
      if (now - date > oneYearMs) {
        return;
      }
      stakingChartData.push([date, Math.round(v)]);
    });
    const totalSupplyData: number[][] = [];
    const contractData: number[][] = [];
    const addressData: number[][] = [];

    supplyData.forEach(({ t, v }) => {
      // Subtract any staking eth from total supply on that date
      let nonStakingSupply = v;
      if (stakingByDate[t]) {
        nonStakingSupply -= stakingByDate[t];
      }
      const date = +new Date(t);
      if (now - date > oneYearMs) {
        return;
      }
      // Mock contracts as 12% of supply
      contractData.push([date, Math.round(nonStakingSupply * 0.12)]);
      addressData.push([date, Math.round(nonStakingSupply * 0.88)]);
      totalSupplyData.push([date, Math.round(v)]);
    });

    // Projections
    const { t: lastDateStr, v: value } = supplyData[supplyData.length - 1];
    const lastDate = new Date(+new Date(lastDateStr) + 1);
    const lastStakingValue = stakingChartData[stakingChartData.length - 1][1];
    const stakingDeltaPerDay =
      (variables.projectedStaking - lastStakingValue) / 365;
    const contractProj: number[][] = [];
    const addressProj: number[][] = [];
    const stakingProj: number[][] = [];
    const totalSupplyProj: number[][] = [];

    const supplyValue = value;
    let stakingValue = lastStakingValue;
    for (let i = 0; i < 365; i++) {
      stakingValue += stakingDeltaPerDay;
      const nonStakingValue = supplyValue - stakingValue;
      contractProj.push([+lastDate, Math.round(nonStakingValue * 0.12)]);
      addressProj.push([+lastDate, Math.round(nonStakingValue * 0.88)]);
      stakingProj.push([+lastDate, Math.round(stakingValue)]);
      totalSupplyProj.push([+lastDate, supplyValue]);
      // Reliably round to start of day
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
          data: addressData,
        },
        {
          id: "contracts",
          type: "area",
          name: Data.supply_chart_series_contracts,
          color: COLORS.SERIES[1],
          data: contractData,
        },
        {
          id: "staking",
          type: "area",
          name: Data.supply_chart_series_staking,
          color: COLORS.SERIES[2],
          data: stakingChartData,
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
  }, [series, Data, handleChartMouseOut, handleChartMouseOver]);

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
