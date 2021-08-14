import Highcharts from "highcharts";
import colors from "../colors";

export const baseGaugeOptions: Highcharts.Options = {
  chart: {
    type: "gauge",
    backgroundColor: null,
    marginTop: 12,
    marginLeft: 12,
    marginRight: 12,
    spacing: [0, 0, 0, 0],
    height: 300,
  },

  title: { style: { display: "none" } },

  pane: {
    startAngle: -110,
    endAngle: 110,
    background: [
      {
        backgroundColor: colors.dusk,
        innerRadius: "90%",
        outerRadius: "100%",
        shape: "arc",
        borderWidth: 0,
      },
    ],
  },

  credits: {
    enabled: false,
  },

  tooltip: { enabled: false },

  yAxis: {
    minorTicks: false,
    lineWidth: 0,
    tickAmount: 0,
    tickWidth: 0,
    // tickLength: 10,
    // tickInterval: 6,
    tickPosition: "outside",
  },

  plotOptions: {
    gauge: {
      dial: {
        backgroundColor: "white",
        baseWidth: 7,
        topWidth: 1,
        baseLength: "0",
        rearLength: "0",
        radius: "70%",
      },
      dataLabels: {
        enabled: false,
      },
      pivot: {
        backgroundColor: "white",
        radius: 3,
      },
    },
    solidgauge: {
      rounded: false,
      innerRadius: 90,
      radius: 100,
      dataLabels: { enabled: false },
    },
  },
};
