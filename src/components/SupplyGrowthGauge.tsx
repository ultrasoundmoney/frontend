import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import SolidGauge from "highcharts/modules/solid-gauge.js";
import HighchartsReact from "highcharts-react-official";
import CountUp from "react-countup";
import _ from "lodash";
import { FC, useEffect, useRef, useState } from "react";
import { useActiveBreakpoint } from "../utils/use-active-breakpoint";
import colors from "../colors";

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
    spacing: [0, 0, 0, 0],
    marginTop: 12,
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
      style: { color: colors.spindle },
      distance: "117%",
      step: 1,
      format: '<span class="font-roboto font-light text-base">{value}</span>',
      useHTML: true,
    },
    min: -4,
    max: 4,
    plotBands: [],
    lineWidth: 0,
    tickWidth: 0,
    tickInterval: 4,
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
        enabled: false,
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

const buildPlotBands = (value: number): Highcharts.YAxisPlotBandsOptions[] => {
  if (value > 0) {
    return [
      {
        from: -4,
        to: 0,
        color: colors.dusk,
        outerRadius: "100%",
        borderWidth: 0,
      },
      {
        from: 0,
        to: value,
        color: colors.cloudyblue,
        outerRadius: "100%",
        borderWidth: 0,
      },
      {
        from: value,
        to: 4,
        color: colors.dusk,
        outerRadius: "100%",
        borderWidth: 0,
      },
    ];
  } else {
    return [
      {
        from: -4,
        to: value,
        color: colors.dusk,
        outerRadius: "100%",
        borderWidth: 0,
      },
      {
        from: value,
        to: 0,
        color: colors.yellow500,
        outerRadius: "100%",
        borderWidth: 0,
      },
      {
        from: 0,
        to: 4,
        color: colors.dusk,
        outerRadius: "100%",
        borderWidth: 0,
      },
    ];
  }
};

const percentChangeFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  signDisplay: "always",
  style: "percent",
});

type SupplyGrowthGaugeProps = {
  includePowIssuance: boolean;
};
const SupplyGrowthGauge: FC<SupplyGrowthGaugeProps> = ({
  includePowIssuance: includePowIssuance,
}) => {
  const [options, setOptions] = useState<Highcharts.Options>(
    _.merge(baseOptions, initialSupplyGrowthOptions)
  );
  const chartRef = useRef(null);
  const { md, lg, xl } = useActiveBreakpoint();
  const height = xl ? 400 : lg ? 300 : md ? 200 : 220;

  useEffect(() => {
    setOptions({
      yAxis: {
        plotBands: buildPlotBands(includePowIssuance ? 2.4 : -1.8),
      },
      series: [
        {
          type: "gauge",
          data: [includePowIssuance ? 2.4 : -1.8],
        },
      ],
    });
  }, [includePowIssuance]);

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
          decimals={4}
          duration={1}
          separator=","
          formattingFn={(num) => `${percentChangeFormatter.format(num)}/year`}
          end={(includePowIssuance ? 2.4 : -1.8) / 100}
          preserveValue={true}
          // suffix="%/year"
        />
      </p>
      <p className="font-inter font-light uppercase text-blue-spindle text-md text-center mt-8 md:mt-4">
        supply growth
      </p>
    </div>
  );
};

export default SupplyGrowthGauge;
