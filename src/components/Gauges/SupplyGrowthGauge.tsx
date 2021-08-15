import CountUp from "react-countup";
import _ from "lodash";
import { FC, useEffect, useRef, useState } from "react";
import colors from "../../colors";
import useFeeData from "../../use-fee-data";
import * as StaticEtherData from "../../static-ether-data";
import { weiToEth } from "../../utils/metric-utils";
import ToggleSwitch from "../ToggleSwitch";
import SplitGaugeSvg from "./SplitGaugeSvg";

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
  const { burnRates } = useFeeData();

  const powIssuanceYear = StaticEtherData.powIssuancePerDay * 365;
  const posIssuanceYear = StaticEtherData.posIssuancePerDay * 365;
  // Burn rates are per minute.
  const feeBurnYear =
    burnRates !== undefined
      ? weiToEth(burnRates.burnRate30d) * 60 * 24 * 365
      : 0;
  const growthRateWithPoWIssuance =
    (powIssuanceYear + posIssuanceYear - feeBurnYear) /
    StaticEtherData.totalSupply;
  const growthRateWithoutPoWIssuance =
    (posIssuanceYear - feeBurnYear) / StaticEtherData.totalSupply;
  const growthRate = includePowIssuance
    ? growthRateWithPoWIssuance
    : growthRateWithoutPoWIssuance;

  const max = 4;

  return (
    <div className="flex flex-col items-center bg-blue-tangaroa px-4 md:px-0 lg:px-2 py-4 rounded-lg md:rounded-none lg:rounded-lg">
      <p className="relative z-10 font-roboto text-blue-spindle flex flex-row items-center justify-end px-4 md:text-sm self-end md:self-center lg:self-end">
        <ToggleSwitch
          className="mr-4"
          checked={includePowIssuance}
          onToggle={toggleIncludePowIssuance}
        />
        include PoW
      </p>
      <div className="w-4 h-4"></div>
      <div className="relative transform md:scale-gauge-md md:-mx-4 md:-mt-12 lg:-mt-0 lg:scale-100">
        <span className="absolute transform left-1/2 -translate-x-1/2 text-center -mb-6 font-roboto font-light text-blue-spindle">
          0
        </span>
        <SplitGaugeSvg max={max} progress={(growthRate * 100) / max} />
        <span className="absolute left-5 top-44 font-roboto font-light text-blue-spindle">
          {-max}
        </span>
        <span className="absolute right-7 top-44 font-roboto font-light text-blue-spindle">
          {max}
        </span>
      </div>
      <p className="relative font-roboto font-light text-white text-center text-lg -mt-24">
        <CountUp
          decimals={2}
          duration={1}
          separator=","
          end={growthRate}
          preserveValue={true}
        />
      </p>
      <span className="relative font-extralight text-blue-spindle">
        ETH/min
      </span>
      <p className="relative font-inter font-light uppercase text-blue-spindle text-md text-center mt-8 md:mt-4">
        supply growth
      </p>
    </div>
  );
};

export default SupplyGrowthGauge;
