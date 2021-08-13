import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import SolidGauge from "highcharts/modules/solid-gauge.js";
import HighchartsReact from "highcharts-react-official";
import _ from "lodash";
import { FC, useEffect, useRef, useState } from "react";
import { useActiveBreakpoint } from "../utils/use-active-breakpoint";

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
    marginTop: 24,
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
      // format: '<span class="font-roboto text-sm">{value}%/year</span>',
      style: { color: "#b5bddb", fontSize: "1rem" },
      distance: 28,
      step: 2,
    },
    min: -4,
    max: 4,
    plotBands: [
      {
        from: -4,
        to: -4,
        color: "#00ffa3",
        outerRadius: "100%",
      },
      {
        from: -4,
        to: 0,
        color: "#0f8a5d",
        outerRadius: "100%",
      },
      {
        from: 0,
        to: 2.4,
        color: "#ed1254",
        outerRadius: "100%",
      },
      {
        from: 2.4,
        to: 4,
        color: "#f85a89",
        outerRadius: "100%",
      },
    ],
    lineWidth: 0,
    tickWidth: 3,
    tickLength: 6,
    tickInterval: 1,
    tickPosition: "outside",
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
      pivot: {
        backgroundColor: "white",
        radius: 4,
      },
      dataLabels: {
        color: "#FFF",
        y: 32,
        borderColor: "none",
        useHTML: true,
        format:
          '<span class="font-roboto font-light text-base">{y:.2f} %/year</span>',
      },
    },
  },
};

const initialSupplyGrowthOptions: Highcharts.Options = {
  series: [
    {
      type: "gauge",
      data: [2.4],
    },
  ],
};

type SupplyGrowthGaugeProps = {
  includePowIssuance: boolean;
  toggleIncludePowIssuance: () => void;
};
const SupplyGrowthGauge: FC<SupplyGrowthGaugeProps> = ({
  includePowIssuance: includePowIssuance,
}) => {
  const [options, setOptions] = useState<Highcharts.Options>(
    _.merge(baseOptions, initialSupplyGrowthOptions)
  );
  const chartRef = useRef(null);
  const { md, lg, xl } = useActiveBreakpoint();
  const height = xl ? "400" : lg ? "320" : md ? "244" : "100";

  console.log("includePowIssuance", includePowIssuance);
  console.log(xl, lg, md);
  console.log("supply opt", options);
  console.log(options?.series && options?.series);

  useEffect(() => {
    setOptions({
      chart: { height },
    });
  }, [height]);

  useEffect(() => {
    setOptions({
      series: [
        {
          type: "gauge",
          data: [!includePowIssuance ? -1.8 : 2.4],
        },
      ],
    });
  }, [includePowIssuance]);

  // useEffect(() => {
  //   if (chartRef.current) {
  // chartRef.current.container.current
  //   .querySelectorAll(":scope .highcharts-plot-band")
  //   .forEach((el: any) =>
  //     el.setAttribute(
  //       "d",
  //       "M 50.664 187.7932 A 110.5 110.5 0 1 1 258.3738 187.6894 A 1 1 0 0 1 247.9864 183.9204 A 99.45 99.45 0 1 0 61.0476 184.0139 A 1 1 0 0 1 50.664 187.7932"
  //     )
  //   );
  // }
  // }, [chartRef]);

  return (
    <div className="w-full bg-blue-tangaroa px-4 py-4">
      <div className="w-4 h-4"></div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartRef}
      />
      <p className="font-inter font-light uppercase text-blue-spindle text-md text-center -mt-8 mb-4 md:mb-0 lg:mb-4 xl:mb-0">
        supply decrease
      </p>
    </div>
  );
};

export default SupplyGrowthGauge;
