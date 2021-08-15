import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import SolidGauge from "highcharts/modules/solid-gauge.js";
import HighchartsReact from "highcharts-react-official";
import CountUp from "react-countup";
import _ from "lodash";
import { FC, useEffect, useRef, useState } from "react";
import colors from "../colors";
import useFeeData from "../use-fee-data";
import * as EtherStaticData from "../static-ether-data";
import { weiToEth } from "../utils/metric-utils";
import ToggleSwitch from "./ToggleSwitch";

if (typeof Highcharts === "object") {
  HighchartsMore(Highcharts);
  SolidGauge(Highcharts);
}

// interface HighchartsRef {
//   chart: Highcharts.Chart;
//   container: React.RefObject<HTMLDivElement>;
// }

const signFormatter = Intl.NumberFormat("en-US", { signDisplay: "always" });
const baseOptions: Highcharts.Options = {
  chart: {
    type: "gauge",
    backgroundColor: null,
    spacing: [12, 2, 0, 2],
    height: 300,
  },

  credits: { enabled: false },

  title: { style: { display: "none" } },

  tooltip: { enabled: false },

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
      // format: '<span class="font-roboto font-light text-base">{value}</span>',
      formatter: (ctx) => {
        if (ctx.value === 0) {
          // we prefer zero signless
          return `<span class="font-roboto font-light text-base">0</span>`;
        }
        return (
          typeof ctx.value === "number" &&
          `<span class="font-roboto font-light text-base">${signFormatter.format(
            ctx.value
          )}</span>`
        );
      },
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
  toggleIncludePowIssuance: () => void;
};
const SupplyGrowthGauge: FC<SupplyGrowthGaugeProps> = ({
  includePowIssuance,
  toggleIncludePowIssuance,
}) => {
  const [options, setOptions] = useState<Highcharts.Options>(
    _.merge(baseOptions, initialSupplyGrowthOptions)
  );
  const { burnRates } = useFeeData();
  const chartRef = useRef(null);

  const powIssuanceYear = EtherStaticData.powIssuancePerDay * 365;
  const posIssuanceYear = EtherStaticData.posIssuancePerDay * 365;
  // Burn rates are per minute.
  const feeBurnYear =
    burnRates !== undefined
      ? weiToEth(burnRates.burnRate30d) * 60 * 24 * 365
      : 0;
  const growthRateWithPoWIssuance =
    (powIssuanceYear + posIssuanceYear - feeBurnYear) /
    EtherStaticData.totalSupply;
  const growthRateWithoutPoWIssuance =
    (posIssuanceYear - feeBurnYear) / EtherStaticData.totalSupply;
  const growthRate = includePowIssuance
    ? growthRateWithPoWIssuance
    : growthRateWithoutPoWIssuance;

  useEffect(() => {
    setOptions({
      yAxis: {
        // Highcharts expects plain numbers, ours is a percent.
        plotBands: buildPlotBands(growthRate * 100),
      },
      series: [
        {
          type: "gauge",
          data: [growthRate * 100],
        },
      ],
    });
  }, [growthRate]);

  return (
    <div className="bg-blue-tangaroa px-4 md:px-0 py-4 rounded-lg">
      <p className="font-roboto text-blue-spindle flex flex-row items-center justify-end px-4 mb-4 md:text-sm">
        <ToggleSwitch
          className="mr-4"
          checked={includePowIssuance}
          onToggle={toggleIncludePowIssuance}
        />
        include PoW
      </p>
      <div className="transform md:scale-75 md:-mt-16 lg:scale-90 lg:-mt-4">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={chartRef}
        />
      </div>
      {burnRates !== undefined && (
        <p className="relative font-roboto font-light text-white text-center text-lg -mt-24 z-10">
          <CountUp
            start={0}
            preserveValue={true}
            end={growthRate * 100}
            separator=","
            decimals={2}
            duration={1}
            // breaks preserve value
            // formattingFn={(num) => percentChangeFormatter.format(num)}
          />
          <span className="font-extralight text-blue-spindle pl-2">%/year</span>
        </p>
      )}
      <p className="relative font-inter font-light uppercase text-blue-spindle text-md text-center mt-8 md:mt-4 z-10">
        supply growth
      </p>
    </div>
  );
};

export default SupplyGrowthGauge;
