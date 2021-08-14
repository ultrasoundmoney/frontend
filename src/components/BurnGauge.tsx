import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import SolidGauge from "highcharts/modules/solid-gauge.js";
import HighchartsReact from "highcharts-react-official";
import CountUp from "react-countup";
import _ from "lodash";
import { useActiveBreakpoint } from "../utils/use-active-breakpoint";
import { useEffect, useRef, useState } from "react";
import useFeeData from "../use-fee-data";
import { weiToEth } from "../utils/metric-utils";
import { baseGaugeOptions } from "./BaseGauge";
import colors from "../colors";

if (typeof Highcharts === "object") {
  HighchartsMore(Highcharts);
  SolidGauge(Highcharts);
}

// interface HighchartsRef {
//   chart: Highcharts.Chart;
//   container: React.RefObject<HTMLDivElement>;
// }

// const baseOptions: Highcharts.Options = {
//   chart: {
//     type: "gauge",
//     backgroundColor: null,
//     margin: 0,
//   },

//   title: { style: { display: "none" } },

//   pane: {
//     // center: ["50%", "85%"],
//     // size: "140%",
//     startAngle: -110,
//     endAngle: 110,
//     background: [
//       // {
//       //   backgroundColor: "#b5bddb",
//       //   innerRadius: "90%",
//       //   outerRadius: "100%",
//       //   shape: "arc",
//       // },
//     ],
//   },

//   // the value axis
//   credits: {
//     enabled: false,
//   },

//   plotOptions: {
//     gauge: {
//       dial: {
//         backgroundColor: "white",
//         baseWidth: 8,
//         topWidth: 1,
//         baseLength: "0",
//         rearLength: "0",
//         radius: "70%",
//       },
//       dataLabels: {
//         color: "#FFF",
//         y: 32,
//         borderColor: "none",
//         useHTML: true,
//         format:
//           '<span class="font-roboto font-light text-lg">{y:.2f} ETH/min</span>',
//       },
//       pivot: {
//         backgroundColor: "white",
//         radius: 4,
//       },
//     },
//     solidgauge: {
//       rounded: true,
//       color: "#FF000",
//       innerRadius: 90,
//       radius: 96,
//       dataLabels: { enabled: false },
//     },
//   },
// };

const burnGaugeOptions = {
  yAxis: {
    min: 0,
    max: 12,
    stops: [[0, colors.yellow500]],
    labels: {
      style: { color: "#B5BDDB" },
      distance: "117%",
      step: 1,
      format: '<span class="font-roboto font-light text-base">{value}</span>',
      useHTML: true,
    },
  },
};

const BurnGauge = () => {
  const [options, setOptions] = useState<Highcharts.Options>(
    _.merge(_.cloneDeep(baseGaugeOptions), burnGaugeOptions)
  );
  const chartRef = useRef(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { md, lg, xl } = useActiveBreakpoint();
  const height = xl ? 400 : lg ? 300 : md ? 180 : 150;
  const { burnRates } = useFeeData();

  const burnRateAll =
    burnRates !== undefined ? weiToEth(burnRates.burnRateAll) : 0;

  useEffect(() => {
    console.log("setting new chart height", height);
    // setOptions({
    //   chart: { height },
    // });

    // const hc = containerRef.current.querySelector(".highcharts-container");
    // if (hc.clientWidth > containerRef.current.clientWidth) {
    //   console.log("height reflow");
    //   chartRef.current.chart.reflow();
    // }
    // if (chartRef.current) {
    //   console.log("height reflow");
    //   chartRef.current.chart.reflow();
    // }
  }, [height]);

  useEffect(() => {
    // if (chartRef.current) {
    //   console.log("options reflow");
    //   chartRef.current.chart.reflow();
    // }
  }, [options]);

  useEffect(() => {
    console.log("setting burnrate", burnRateAll);
    setOptions({
      series: [
        { type: "gauge", data: [burnRateAll] },
        { type: "solidgauge", data: [burnRateAll] },
      ],
    });
  }, [burnRateAll]);

  return (
    <div
      className="bg-blue-tangaroa px-4 md:px-0 py-8 rounded-lg"
      ref={containerRef}
    >
      <div className="transform md:scale-75 md:-mt-16 lg:scale-90 lg:-mt-4">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={chartRef}
        />
      </div>
      <p className="font-roboto font-light text-white text-center text-lg -mt-24">
        <CountUp
          decimals={2}
          duration={1}
          separator=","
          end={burnRateAll}
          preserveValue={true}
          suffix=" ETH/min"
        />
      </p>
      <p className="font-inter font-light uppercase text-blue-spindle text-md text-center mt-8 md:mt-4">
        burn
      </p>
    </div>
  );
};

export default BurnGauge;
