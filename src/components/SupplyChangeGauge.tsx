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

  credits: { enabled: false },

  title: { style: { display: "none" } },

  pane: {
    // center: ["50%", "85%"],
    // size: "90%",
    startAngle: -110,
    endAngle: 110,
    background: [],
  },

  yAxis: {
    minorTicks: false,
    labels: {
      format: "{value}%",
      style: { color: "#b5bddb", fontSize: "1rem" },
      distance: 24,
      step: 2,
    },
    min: -4,
    max: 4,
    plotBands: [
      {
        from: -4,
        to: 0,
        color: "#f85a89",
        outerRadius: "96%",
      },
      {
        from: 0,
        to: 4,
        color: "#00FFA3",
        outerRadius: "96%",
      },
    ],
    lineWidth: 1,
    tickWidth: 2,
    tickLength: 4,
    tickInterval: 1,
    tickPosition: "outside",
  },
  plotOptions: {
    gauge: {
      dial: {
        backgroundColor: "white",
        baseWidth: 6,
        baseLength: "0%",
        topWidth: 1,
        radius: "70%",
      },
      pivot: { backgroundColor: "none" },
      dataLabels: {
        enabled: false,
      },
    },
  },
};

const inflationary: Highcharts.Options = {
  series: [
    {
      type: "gauge",
      data: [3],
    },
  ],
};

const options = _.merge(baseGauge, inflationary);

const InflationaryGauge = () => {
  // const [options, setOptions] = useState({});

  return (
    <div className="w-full bg-blue-tangaroa px-4 py-4">
      <HighchartsReact highcharts={Highcharts} options={options} />
      <p className="flex justify-center font-roboto font-light text-white text-xl -mt-16 mb-4">
        supply change
      </p>
    </div>
  );
};

export default InflationaryGauge;
