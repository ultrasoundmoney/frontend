import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import SolidGauge from "highcharts/modules/solid-gauge.js";
import HighchartsReact from "highcharts-react-official";
import _ from "lodash";

if (typeof Highcharts === "object") {
  HighchartsMore(Highcharts);
  SolidGauge(Highcharts);
}

// interface HighchartsRef {
//   chart: Highcharts.Chart;
//   container: React.RefObject<HTMLDivElement>;
// }

const baseGauge: Highcharts.Options = {
  chart: {
    type: "gauge",
    backgroundColor: null,
    margin: 20,
    height: 300,
  },

  title: { style: { display: "none" } },

  pane: {
    // center: ["50%", "85%"],
    // size: "140%",
    startAngle: -110,
    endAngle: 110,
    background: [
      // {
      //   backgroundColor: "#b5bddb",
      //   innerRadius: "90%",
      //   outerRadius: "100%",
      //   shape: "arc",
      // },
    ],
  },

  // the value axis
  yAxis: {
    min: 0,
    max: 5,
    stops: [[0, "#00FFA3"]],
    minorTicks: false,
    lineWidth: 1,
    tickWidth: 2,
    tickLength: 4,
    tickInterval: 1,
    tickPosition: "outside",
    labels: {
      style: { color: "#b5bddb", fontSize: "1rem" },
      distance: 24,
      step: 5,
      format: "{value} mach",
    },
  },

  credits: {
    enabled: false,
  },
};

const issuancePerDay: Highcharts.Options = {
  series: [
    {
      type: "gauge",
      data: [2.4],
      tooltip: { distance: 100 },
      dial: {
        backgroundColor: "white",
        baseWidth: 5,
        baseLength: "0%",
        topWidth: 1,
        radius: "70%",
      },
      pivot: { backgroundColor: "none" },
      dataLabels: {
        enabled: false,
      },
    },
    {
      type: "solidgauge",
      rounded: true,
      color: "#FF000",
      innerRadius: 90,
      radius: 96,
      data: [2.4],
      dataLabels: {
        color: "#FFF",
        y: 32,
        borderColor: "none",
        useHTML: true,
        format:
          '<span class="font-roboto font-light text-lg">{y} ETH / min</span>',
      },
    },
  ],
};

const BurnGauge = () => {
  return (
    <div className="w-full bg-blue-tangaroa px-4 py-4">
      <HighchartsReact
        highcharts={Highcharts}
        options={_.merge(baseGauge, issuancePerDay)}
      />
      <p className="flex justify-center font-roboto font-light text-white text-xl -mt-16 mb-4">
        burn
      </p>
    </div>
  );
};

export default BurnGauge;
