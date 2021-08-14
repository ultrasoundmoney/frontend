import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import SolidGauge from "highcharts/modules/solid-gauge.js";
import HighchartsReact from "highcharts-react-official";
import CountUp from "react-countup";
import _ from "lodash";
import { FC, useEffect, useRef, useState } from "react";
import { useActiveBreakpoint } from "../utils/use-active-breakpoint";
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

const issuanceGuageOptions: Highcharts.Options = {
  plotOptions: {
    solidgauge: {
      color: "#f85a89",
    },
  },

  yAxis: {
    min: 0,
    max: 12,
    stops: [[0, colors.cloudyblue]],
    labels: {
      format: '<span class="font-roboto text-base">{value}</span>',
      style: { color: "#b5bddb" },
      distance: "117%",
      step: 1,
      useHTML: true,
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
};

const IssuanceGauge: FC<IssuanceGaugeProps> = ({ includePowIssuance }) => {
  const [options, setOptions] = useState(
    _.merge(_.cloneDeep(baseGaugeOptions), issuanceGuageOptions)
  );
  const chartRef = useRef(null);
  const { md, lg, xl } = useActiveBreakpoint();
  const height = xl ? 400 : lg ? 250 : md ? 200 : 150;

  useEffect(() => {
    setOptions({
      series: [
        {
          type: "gauge",
          data: [includePowIssuance ? 10.98 : 3.14],
        },
        {
          type: "solidgauge",
          data: [includePowIssuance ? 10.98 : 3.14],
        },
      ],
    });
  }, [includePowIssuance]);

  // useEffect(() => {
  //   setOptions({
  //     chart: { height },
  //   });
  //   if (chartRef.current) {
  //     chartRef.current.chart.reflow();
  //   }
  // }, [height]);

  return (
    <div className="bg-blue-tangaroa px-4 md:px-0 py-8 rounded-lg">
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
          end={includePowIssuance ? 10.98 : 3.14}
          preserveValue={true}
          suffix=" ETH/min"
        />
      </p>
      <p className="font-inter font-light uppercase text-blue-spindle text-md text-center mt-8 md:mt-4">
        issuance
      </p>
    </div>
  );
};

export default IssuanceGauge;
