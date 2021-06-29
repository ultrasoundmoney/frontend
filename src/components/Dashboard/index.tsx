import * as React from "react";
import { DateTime } from "luxon";
import Slider from "../Slider/Slider";
import SupplyChart from "./SupplyChart";
import SegmentedControl, {
  Option as SegmentedControlOption,
} from "../SegmentedControl";
import {
  estimatedDailyFeeBurn,
  estimatedDailyIssuance,
} from "../../utils/metric-utils";
import { useTranslations } from "../../utils/use-translation";
import styles from "./Dashboard.module.scss";

const DEFAULT_PROJECTED_ETH_STAKING = 10e6;
const DEFAULT_PROJECTED_BASE_GAS_PRICE = 20;
const DEFAULT_PROJECTED_MERGE_DATE = DateTime.utc(2022, 1, 31);
const MAX_PROJECTED_MERGE_DATE = DateTime.utc(2022, 12, 31);

const intlFormatter = new Intl.NumberFormat();

const DashboardPage: React.FC<{ Data?: Data }> = ({ Data }) => {
  const { translations: t } = useTranslations();
  const timeRangeOptions = React.useMemo(
    () => [
      {
        value: "all",
        label: Data.time_range_all,
      },
      {
        value: "1y",
        label: Data.time_range_1y,
      },
      {
        value: "6mo",
        label: Data.time_range_6mo,
      },
      {
        value: "30d",
        label: Data.time_range_30d,
      },
      {
        value: "7d",
        label: Data.time_range_7d,
      },
    ],
    [Data]
  );

  // TODO Initialize this to current amount of ETH staked
  const [projectedStaking, setProjectedStaking] = React.useState(
    DEFAULT_PROJECTED_ETH_STAKING
  );
  // TODO Initialize this to current base gas price
  const [projectedBaseGasPrice, setProjectedBaseGasPrice] = React.useState(
    DEFAULT_PROJECTED_BASE_GAS_PRICE
  );
  const [projectedMergeDate, setProjectedMergeDate] = React.useState(
    DEFAULT_PROJECTED_MERGE_DATE
  );

  const [timeRange, setTimeRange] = React.useState(timeRangeOptions[1].value);

  const handleProjectedStakingChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setProjectedStaking(parseInt(e.target.value));
    },
    []
  );

  const handleProjectedBaseGasPriceChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setProjectedBaseGasPrice(parseInt(e.target.value));
    },
    []
  );

  const handleProjectedMergeDateChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const numDays: number = parseInt(e.target.value);
      const projectedDate = DateTime.utc()
        .startOf("day")
        .plus({ days: numDays });
      setProjectedMergeDate(projectedDate);
    },
    []
  );

  const handleTimeRangeChange = React.useCallback(
    (option: SegmentedControlOption) => {
      setTimeRange(option.value);
    },
    []
  );

  const daysUntilProjectedMerge = projectedMergeDate.diff(
    DateTime.utc().startOf("day"),
    "days"
  ).days;
  const daysUntilMaxProjectedMerge = MAX_PROJECTED_MERGE_DATE.diff(
    DateTime.utc().startOf("day"),
    "days"
  ).days;

  return (
    <>
      <div className="dash-wrapper wrapper bg-blue-midnightexpress min-h-screen text-white">
        <div className="pt-8 container m-auto">
          <div className="dash-wrapper flex">
            <div className={`${styles.charts}`}>
              <div className={styles.chartHeader}>
                <div>
                  <div className="text-xl text-white text-left font-light leading-2 pl-3 pb-2">
                    {Data.total_eth_supply}
                  </div>
                </div>
                <SegmentedControl
                  options={timeRangeOptions}
                  value={timeRange}
                  onChange={handleTimeRangeChange}
                />
              </div>
              <SupplyChart
                Data={Data}
                projectedStaking={projectedStaking}
                projectedBaseGasPrice={projectedBaseGasPrice}
              />
            </div>

            <div className={`${styles.sidebar} flex-none pl-4`}>
              <div className="">
                <div className="text-lg text-white text-left font-light leading-2">
                  {Data.projection}
                </div>
                <div className="text-xs text-blue-spindle text-left font-light leading-relaxed">
                  {Data.projection_description}
                </div>
              </div>
              <div className="my-4">
                <div className="">
                  <div className="text-xs text-blue-spindle text-left font-light uppercase leading-2">
                    {Data.eth_staked}
                  </div>
                  <div className="text-xl text-white text-left font-light">
                    {intlFormatter.format(projectedStaking)}
                  </div>
                  <div className="text-sm text-blue-spindle font-light">
                    PoS issuance:{" "}
                    {intlFormatter.format(
                      estimatedDailyIssuance(projectedStaking)
                    )}{" "}
                    {t.eth_per_day}
                  </div>
                  <Slider
                    min={0}
                    max={33554432}
                    value={projectedStaking}
                    step={1e6}
                    onChange={handleProjectedStakingChange}
                  />
                </div>
                <div className="mt-4">
                  <div className="text-xs text-blue-spindle text-left font-light uppercase leading-2">
                    {Data.base_gas_price}
                  </div>
                  <div className="text-xl text-white text-left font-light">
                    {intlFormatter.format(projectedBaseGasPrice)} Gwei
                  </div>
                  <div className="text-sm text-blue-spindle font-light">
                    Fee burn:{" "}
                    {intlFormatter.format(
                      estimatedDailyFeeBurn(projectedBaseGasPrice)
                    )}{" "}
                    {t.eth_per_day}
                  </div>
                  <Slider
                    min={0}
                    max={1000}
                    value={projectedBaseGasPrice}
                    step={1}
                    onChange={handleProjectedBaseGasPriceChange}
                  />
                </div>
                <div className="mt-4">
                  <div className="text-xs text-blue-spindle font-light uppercase leading-2">
                    {Data.merge_date}
                  </div>
                  <div className="text-xl text-white font-light">
                    {projectedMergeDate.toLocaleString(DateTime.DATE_MED)}
                  </div>
                  <div className="text-sm text-blue-spindle font-light">
                    Days until merge:{" "}
                    {intlFormatter.format(daysUntilProjectedMerge)}
                  </div>
                  <Slider
                    min={0}
                    max={daysUntilMaxProjectedMerge}
                    value={daysUntilProjectedMerge}
                    step={1}
                    onChange={handleProjectedMergeDateChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
