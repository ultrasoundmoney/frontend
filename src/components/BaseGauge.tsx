import Highcharts from "highcharts";

export const baseGaugeOptions: Highcharts.Options = {
  chart: {
    type: "gauge",
    backgroundColor: null,
    margin: 0,
  },

  title: { style: { display: "none" } },

  pane: {
    startAngle: -110,
    endAngle: 110,
    background: [
      {
        backgroundColor: "#495069",
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
    tickWidth: 2,
    tickLength: 6,
    tickInterval: 1,
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
        color: "#FFF",
        y: 32,
        borderColor: "none",
        useHTML: true,
        format:
          '<span class="font-roboto font-light text-base">{y:.2f} ETH/min</span>',
      },
      pivot: {
        backgroundColor: "white",
        radius: 3,
      },
    },
    solidgauge: {
      rounded: true,
      innerRadius: 90,
      radius: 100,
      dataLabels: { enabled: false },
    },
  },
};
