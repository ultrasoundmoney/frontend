import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import SolidGauge from "highcharts/modules/solid-gauge.js";
import HighchartsReact from "highcharts-react-official";
import _ from "lodash";
import { useEffect, useState } from "react";

if (typeof Highcharts === "object") {
  HighchartsMore(Highcharts);
  SolidGauge(Highcharts);
}

// interface HighchartsRef {
//   chart: Highcharts.Chart;
//   container: React.RefObject<HTMLDivElement>;
// }

const InflationaryGauge = () => {
  const [options, setOptions] = useState({});
  useEffect(() => {
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
        size: "90%",
        startAngle: -110,
        endAngle: 110,
        background: [{ backgroundColor: "none", borderWidth: 0 }],
      },

      yAxis: {
        minorTicks: false,
        lineWidth: 0,
        tickWidth: 0,
        labels: {
          style: { color: "#b5bddb", fontSize: "1rem" },
          distance: 24,
          step: 2,
        },
        min: -4,
        max: 4,
        plotBands: [
          {
            from: -10,
            to: 0,
            color: "#f85a89", // green
          },
          {
            from: 0,
            to: 10,
            color: "#00FFA3", // yellow
          },
        ],
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
      },
    };

    const inflationary: Highcharts.Options = {
      series: [
        {
          type: "gauge",
          color: "#f85a89",
          data: [3],
          tooltip: { distance: 100 },
        },
      ],
    };

    setOptions(_.merge(baseGauge, inflationary));
  }, []);

  return (
    <div className="w-full bg-blue-tangaroa px-4 py-8">
      <HighchartsReact highcharts={Highcharts} options={options} />
      <p className="flex justify-center font-roboto font-light text-white text-xl -mt-20">
        supply change
      </p>
    </div>
  );
};

export default InflationaryGauge;
