import React, { memo, FC } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { DateTime } from "luxon";
import merge from "lodash/merge";

import { useFeesBurnedPerInterval } from "../../api";
import { useOnResize } from "../../utils/use-on-resize";
import { formatDate, weiToEth } from "../../utils/metric-utils";
import {
  defaultOptions,
  useHighchartsGlobalOptions,
  HighchartsRef,
} from "../../utils/chart-defaults";
import FeePeriodControl, { Timeframe } from "../FeePeriodControl";

import styles from "./FeeBurnChart.module.scss";

const timeframeOptions: Timeframe[] = ["t24h", "t7d", "t30d", "tAll"];

const LARGE_SCREEN_THRESHOLD = 1280;

const FeeBurnChart: FC = () => {
  const { feesBurnedPerInterval } = useFeesBurnedPerInterval();
  const chartRef = React.useRef<HighchartsRef | null>(null);

  const [timeframe, setFeePeriod] = React.useState<Timeframe>("tAll");
  const onSetFeePeriod = React.useCallback(setFeePeriod, [setFeePeriod]);

  const [isLargeScreen, setIsLargeScreen] = React.useState<boolean>(
    typeof window !== "undefined" && window.innerWidth >= LARGE_SCREEN_THRESHOLD
  );

  useHighchartsGlobalOptions();

  useOnResize(({ width }) => {
    setIsLargeScreen(width >= LARGE_SCREEN_THRESHOLD);
  });

  const granularity = React.useMemo((): string => {
    if (timeframe === "t24h") {
      return "hour";
    } else if (timeframe === "t7d") {
      return isLargeScreen ? "hour" : "day";
    }
    return "day";
  }, [timeframe, isLargeScreen]);

  const data = React.useMemo((): number[][] => {
    if (feesBurnedPerInterval == undefined) {
      return [];
    }

    let minDate = null;
    if (timeframe === "t24h") {
      minDate = DateTime.utc().minus({ hours: 24 });
    } else if (timeframe === "t7d") {
      minDate = DateTime.utc().minus({ days: 7 });
    } else if (timeframe === "t30d") {
      minDate = DateTime.utc().minus({ days: 30 });
    }

    minDate = minDate ? minDate.toMillis() : null;

    const aggData: Record<string, number> = {};
    for (const [unixSeconds, burn] of Object.entries(feesBurnedPerInterval)) {
      let unixMillis = Number(unixSeconds) * 1000;
      if (minDate && unixMillis < minDate) {
        continue;
      }
      if (granularity === "day") {
        unixMillis = DateTime.fromMillis(unixMillis, { zone: "utc" })
          .startOf("day")
          .toMillis();
      }
      if (!aggData[unixMillis]) {
        aggData[unixMillis] = 0;
      }
      aggData[unixMillis] += weiToEth(burn);
    }
    return Object.entries(aggData).map(([ts, burn]) => [
      Number(ts),
      Number(burn),
    ]);
  }, [feesBurnedPerInterval, timeframe, granularity]);

  const options = React.useMemo((): Highcharts.Options => {
    const chartOptions: Highcharts.Options = {
      title: { text: undefined },
      chart: {
        animation: false,
        height: 250,
      },
      xAxis: {
        type: "datetime",
        dateTimeLabelFormats: {
          day: "%e %b",
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: undefined,
        },
      },
      tooltip: {
        shared: true,
        backgroundColor: "transparent",
        padding: 0,
        valueDecimals: 0,
        xDateFormat: "%Y-%m-%d",
        useHTML: true,
        formatter: function () {
          const points = this.points || [];
          const dt = DateTime.fromMillis(this.x, { zone: "utc" });
          const header = `<div class="tt-header"><div class="tt-header-date text-blue-spindle">${
            granularity === "day"
              ? formatDate(dt)
              : dt.toLocaleString(DateTime.DATETIME_MED)
          }</div></div>`;

          const rows = points.map(
            (p) =>
              `<tr>
              <td>
                <div class="tt-series">
                  <div class="tt-series-name">${p.series.name}</div>
                </div>
              </td>
              <td class="text-white">${Intl.NumberFormat(undefined, {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }).format(p.y)} ETH</td>
              </tr>`
          );

          const table = `<table><tbody>${rows.join("")}</tbody></table>`;
          return `<div class="tt-root">${header}${table}</div>`;
        },
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          type: "column",
          borderWidth: 0,
          data: data,
          name: "Fees burned",
          animation: false,
        },
      ],
    };
    return merge({}, defaultOptions, chartOptions);
  }, [data, granularity]);

  return (
    <div
      className={`bg-blue-tangaroa w-full rounded-lg p-8 ${styles.feeBurnChart}`}
    >
      <div className="flex flex-col justify-between items-start md:flex-row md:items-center">
        <p className="font-inter font-light uppercase text-blue-spindle text-md mb-4 md:mb-0 lg:mb-4 xl:mb-0">
          Fees burned over time
        </p>
        <FeePeriodControl
          timeframe={timeframe}
          timeframeOptions={timeframeOptions}
          onSetFeePeriod={onSetFeePeriod}
        />
      </div>
      <div className="h-6"></div>
      <HighchartsReact
        ref={chartRef}
        highcharts={Highcharts}
        options={options}
      />
    </div>
  );
};

export default memo(FeeBurnChart);
