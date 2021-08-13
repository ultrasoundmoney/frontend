import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import SolidGauge from "highcharts/modules/solid-gauge.js";
import HighchartsReact from "highcharts-react-official";
import _ from "lodash";
import { FC, useEffect, useRef, useState } from "react";
import { useActiveBreakpoint } from "../utils/use-active-breakpoint";
import { baseGaugeOptions } from "./BaseGauge";
import ToggleSwitch from "./ToggleSwitch";

if (typeof Highcharts === "object") {
  HighchartsMore(Highcharts);
  SolidGauge(Highcharts);
}

// interface HighchartsRef {
//   chart: Highcharts.Chart;
//   container: React.RefObject<HTMLDivElement>;
// }

const issuanceGuageOptions: Highcharts.Options = {
  plotOptions: {
    solidgauge: {
      color: "#f85a89",
    },
  },

  yAxis: {
    min: 0,
    max: 12,
    stops: [[0, "#f85a89"]],
    labels: {
      // format: '<span class="font-roboto text-md">{value} ETH/min</span>',
      style: { color: "#b5bddb" },
      distance: 20,
      step: 2,
    },
  },

  series: [
    {
      type: "gauge",
      data: [10.9],
    },
    {
      type: "solidgauge",
      data: [10.9],
    },
  ],
};

type IssuanceGaugeProps = {
  includePowIssuance: boolean;
  toggleIncludePowIssuance: () => void;
};

const IssuanceGauge: FC<IssuanceGaugeProps> = ({
  includePowIssuance,
  toggleIncludePowIssuance,
}) => {
  const [options, setOptions] = useState(
    _.merge(baseGaugeOptions, issuanceGuageOptions)
  );
  const chartRef = useRef(null);
  const { md, lg, xl } = useActiveBreakpoint();
  const height = xl ? "400" : lg ? "300" : md ? "180" : "200";

  useEffect(() => {
    setOptions({ chart: { height } });
  }, [height]);

  useEffect(() => {
    setOptions({
      series: [
        {
          type: "gauge",
          data: [!includePowIssuance ? 3.14 : 10.98],
        },
        {
          type: "solidgauge",
          data: [!includePowIssuance ? 3.14 : 10.98],
        },
      ],
    });
  }, [includePowIssuance]);

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
      <div className="flex justify-start">
        <p className="font-roboto text-blue-spindle flex flex-row items-center">
          <ToggleSwitch
            className="mr-4"
            checked={includePowIssuance}
            onToggle={toggleIncludePowIssuance}
          />
          include PoW
        </p>
      </div>
      <div className="w-16 h-4"></div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartRef}
      />
      <p className="font-inter font-light uppercase text-blue-spindle text-md text-center mt-2 mb-4 md:mb-0 lg:mb-4 xl:mb-0">
        issuance
      </p>
    </div>
  );
};

export default IssuanceGauge;
