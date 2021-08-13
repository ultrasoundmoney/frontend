import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import SolidGauge from "highcharts/modules/solid-gauge.js";
import HighchartsReact from "highcharts-react-official";
import _ from "lodash";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useActiveBreakpoint } from "../utils/use-active-breakpoint";
import styles from "./ToggleSwitch.module.scss";

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
      distance: 26,
      step: 2,
    },
    min: -4,
    max: 4,
    plotBands: [
      {
        from: -4,
        to: -0.3,
        color: "#f85a89",
        outerRadius: "96%",
      },
      {
        from: -0.3,
        to: 0.3,
        color: "#1b2236",
        outerRadius: "96%",
      },
      {
        from: 0.3,
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
        baseWidth: 8,
        topWidth: 1,
        baseLength: "0",
        rearLength: "0",
        radius: "70%",
      },
      pivot: {
        backgroundColor: "white",
        radius: 3,
      },
      dataLabels: {
        enabled: false,
      },
    },
  },
};

const initialSupplyChangeOptions: Highcharts.Options = {
  series: [
    {
      type: "gauge",
      data: [2.4],
    },
  ],
};

type ToggleSwitchProps = {
  checked: boolean;
  className?: string;
  onToggle: () => void;
};

const ToggleSwitch: FC<ToggleSwitchProps> = ({
  checked,
  className,
  onToggle,
}) => (
  <input
    checked={checked}
    onChange={onToggle}
    className={`${className} ${styles["toggle-switch"]}`}
    type="checkbox"
  />
);

const InflationaryGauge = () => {
  const [posIssuanceMode, setPosIssuanceMode] = useState(false);
  const [options, setOptions] = useState(
    _.merge(baseOptions, initialSupplyChangeOptions)
  );
  const chartRef = useRef(null);
  const { md, lg, xl } = useActiveBreakpoint();
  const height = xl ? "400" : lg ? "320" : md ? "200" : "100";

  const issuanceMode = posIssuanceMode ? "PoS" : "PoW";

  console.log(issuanceMode);
  console.log(xl, lg, md);
  console.log(options);
  console.log(options?.series && options?.series);

  useEffect(() => {
    setOptions({
      chart: { height },
    });
  }, [height]);

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

  const onTogglePosIssuanceMode = useCallback(() => {
    setPosIssuanceMode(!posIssuanceMode);
    setOptions({
      series: [
        {
          type: "gauge",
          data: [!posIssuanceMode ? -1.8 : 2.4],
        },
      ],
    });
  }, [posIssuanceMode]);

  return (
    <div className="w-full bg-blue-tangaroa px-4 py-4">
      <div className="flex justify-end">
        <p className="font-roboto text-blue-spindle flex flex-row items-center">
          {issuanceMode}
          <ToggleSwitch
            className="ml-2"
            checked={posIssuanceMode}
            onToggle={onTogglePosIssuanceMode}
          />
        </p>
      </div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartRef}
      />
      <p className="flex justify-center font-roboto font-light text-white text-lg -mt-4 mb-4">
        supply change
      </p>
    </div>
  );
};

export default InflationaryGauge;
