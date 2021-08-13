import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import SolidGauge from "highcharts/modules/solid-gauge.js";
import HighchartsReact from "highcharts-react-official";
import _ from "lodash";
import { useActiveBreakpoint } from "../utils/use-active-breakpoint";
import { useEffect, useRef, useState } from "react";
import useFeeData from "../use-fee-data";
import { weiToEth } from "../utils/metric-utils";

if (typeof Highcharts === "object") {
  HighchartsMore(Highcharts);
  SolidGauge(Highcharts);
}

// interface HighchartsRef {
//   chart: Highcharts.Chart;
//   container: React.RefObject<HTMLDivElement>;
// }

const baseOptions: Highcharts.Options = {
  chart: {
    type: "gauge",
    backgroundColor: null,
    margin: 0,
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
      format: '<span class="font-roboto text-md">{value}<br>mach</span>',
    },
  },

  credits: {
    enabled: false,
  },

  plotOptions: {
    gauge: {
      dial: {
        backgroundColor: "white",
        baseWidth: 8,
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
        format: '<span class="font-roboto text-md">{y} ETH/min</span>',
      },
      pivot: {
        backgroundColor: "white",
        radius: 3,
      },
    },
    solidgauge: {
      rounded: true,
      color: "#FF000",
      innerRadius: 90,
      radius: 96,
      dataLabels: { enabled: false },
    },
  },
};

const BurnGauge = () => {
  const [options, setOptions] = useState(baseOptions);
  const chartRef = useRef(null);
  const { md, lg, xl } = useActiveBreakpoint();
  const height = xl ? "400" : lg ? "300" : md ? "180" : "200";
  const { burnRates } = useFeeData();

  const burnRateAll =
    burnRates !== undefined ? weiToEth(burnRates.burnRateAll).toFixed(2) : 0;

  useEffect(() => {
    setOptions({
      chart: { height },
    });
  }, [height]);

  useEffect(() => {
    console.log("setting burnrate", burnRateAll);
    setOptions({
      series: [
        { type: "gauge", data: [burnRateAll] },
        { type: "solidgauge", data: [burnRateAll] },
      ],
    });
  }, [burnRateAll]);

  useEffect(() => {
    if (chartRef.current) {
      // chartRef.current.container.current
      //   .querySelectorAll(":scope path.highcharts-dial")
      //   .forEach((dial: SVGPathElement) =>
      //     dial.setAttribute(
      //       "d",
      //       "M -8.19 -2.5 L 0 -2.5 L 81.9 -0.5 L 81.9 0.5 L 0 2.5 L -8.19 2.5 A 1 1 0 0 1 -8.19 -2.5"
      //     )
      //   );
      // chartRef.current.container.current
      //   .querySelectorAll(":scope .highcharts-plot-band")
      //   .forEach((el: SVGPathElement) =>
      //     el.setAttribute(
      //       "d",
      //       "M 50.664 187.7932 A 110.5 110.5 0 1 1 258.3738 187.6894 A 1 1 0 0 1 247.9864 183.9204 A 99.45 99.45 0 1 0 61.0476 184.0139 A 1 1 0 0 1 50.664 187.7932"
      //     )
      //   );
    }
  }, [chartRef]);

  return (
    <div className="w-full bg-blue-tangaroa px-4 py-4">
      <div className="w-10 h-10"></div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartRef}
      />
      <p className="flex justify-center font-roboto font-light text-white text-xl -mt-4 mb-4">
        burn
      </p>
    </div>
  );
};

export default BurnGauge;
