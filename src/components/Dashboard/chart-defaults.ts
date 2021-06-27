import * as Highcharts from "highcharts";

// TODO(colors)
export const COLORS = {
  GRID: "#262e48",
  LABEL: "#8490b5",
  LABEL_HOVER: "#6c7696",
  TOOLTIP_BG: "#1b2135", // mignight-express but lighter
  // visx
  // SERIES: ["#0b7285", "#66d9e8", "#fcc419", "#ff8787", "#9c36b5", "#cc5de8", "#a61e4d"],
  // chart.js
  SERIES: ["#36a2eb", "#ff6384", "#8142ff", "#ff9f40", "#ffcd56", "#4bc0c0"],
};

export const defaultChartOptions: Highcharts.ChartOptions = {
  backgroundColor: "rgba(0, 0, 0, 0)",
  style: {
    fontFamily: "Roboto Mono, monospace",
  },
};

export const defaultLegendOptions: Highcharts.LegendOptions = {
  itemStyle: {
    color: COLORS.LABEL,
  },
  itemHoverStyle: {
    color: COLORS.LABEL_HOVER,
  },
};

export const defaultOptions: Highcharts.Options = {
  chart: defaultChartOptions,
  colors: COLORS.SERIES,
  credits: {
    enabled: false,
  },
  legend: defaultLegendOptions,
  plotOptions: {
    area: {
      marker: {
        radius: 2,
      },
      lineWidth: 1,
      states: {
        hover: {
          lineWidth: 1,
        },
      },
      fillOpacity: 0.4,
      stacking: "normal",
    },
  },
  title: {
    text: undefined,
  },
  tooltip: {
    backgroundColor: COLORS.TOOLTIP_BG,
    borderColor: "none",
    shadow: false,
    style: {
      color: COLORS.LABEL,
    },
  },
  xAxis: {
    labels: {
      style: {
        color: COLORS.LABEL,
      },
    },
    title: {
      style: {
        color: COLORS.LABEL,
      },
    },
    gridLineColor: COLORS.GRID,
    lineColor: COLORS.GRID,
    tickColor: COLORS.GRID,
  },
  yAxis: {
    labels: {
      style: {
        color: COLORS.LABEL,
      },
    },
    title: {
      style: {
        color: COLORS.LABEL,
      },
    },
    gridLineColor: COLORS.GRID,
  },
};
