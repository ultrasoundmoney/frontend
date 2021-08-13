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
      {
        backgroundColor: "#b5bddb",
        innerRadius: "90%",
        outerRadius: "100%",
        shape: "arc",
      },
    ],
  },

  // the value axis
  yAxis: {
    minorTicks: false,
    lineWidth: 0,
    tickWidth: 0,
    labels: {
      style: { color: "#b5bddb", fontSize: "1rem" },
      distance: 24,
    },
  },

  plotOptions: {
    gauge: {
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
    solidgauge: {
      dataLabels: {
        color: "#FFF",
        x: 0,
        y: 10,
        borderColor: "none",
        useHTML: true,
      },
    },
  },
};

const issuancePerDay: Highcharts.Options = {
  yAxis: {
    min: 0,
    max: 5,
    tickAmount: 2,
    stops: [
      [0, "#00FFA3"], // green
      [3000, "#00FFA3"], // red
    ],
  },

  credits: {
    enabled: false,
  },

  series: [
    // {
    //   type: "gauge",
    //   data: [8000],
    //   tooltip: { distance: 100 },
    // },
    {
      type: "solidgauge",
      rounded: true,
      color: "#FF000",
      name: "Issuance per day",
      innerRadius: 90,
      radius: 100,
      data: [4],
      dataLabels: {
        y: 32,
        formatter: function () {
          if (this.y > 1000000) {
            const num = Highcharts.numberFormat(this.y / 1000, 3) + "M";
            return `<span class="font-roboto font-light text-2xl">${num} ETH / min</span>`;
          } else if (this.y > 1000) {
            const num = Highcharts.numberFormat(this.y / 1000, 0) + "K";
            return `<span class="font-roboto font-light text-2xl">${num} ETH / min</span>`;
          } else {
            const num = this.y;
            return `<span class="font-roboto font-light text-2xl">${num} ETH / min</span>`;
          }
        },
      },
    },
  ],
};

const IssuanceGauge = () => {
  return (
    <div className="w-full bg-blue-tangaroa px-8 py-8">
      <HighchartsReact
        highcharts={Highcharts}
        options={_.merge(baseGauge, issuancePerDay)}
      />
      <p className="flex justify-center font-roboto font-light text-white text-xl -mt-20">
        issuance
      </p>
    </div>
  );
};

export default IssuanceGauge;
