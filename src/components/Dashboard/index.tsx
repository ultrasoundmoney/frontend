import * as React from "react";
import Slider from "../Slider/Slider";
import SupplyChart from "./SupplyChart";
import styles from "./Dashboard.module.scss";
import SegmentedControl, {
  Option as SegmentedControlOption,
} from "../SegmentedControl";

const DEFAULT_PROJECTED_ETH_STAKING = 30e6;
const DEFAULT_PROJECTED_FEE_BURN_PCT = 70;

const DashboardPage: React.FC<{ Data?: Data }> = ({ Data }) => {
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

  const [projectedStaking, setProjectedStaking] = React.useState(
    DEFAULT_PROJECTED_ETH_STAKING
  );
  const [projectedFeeBurn, setProjectedFeeBurn] = React.useState(
    DEFAULT_PROJECTED_FEE_BURN_PCT
  );
  const [timeRange, setTimeRange] = React.useState(timeRangeOptions[1].value);

  const handleProjectedStakingChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setProjectedStaking(parseInt(e.target.value));
    },
    []
  );

  const handleProjectedFeeBurnChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setProjectedFeeBurn(parseInt(e.target.value));
    },
    []
  );

  const handleTimeRangeChange = React.useCallback(
    (option: SegmentedControlOption) => {
      setTimeRange(option.value);
    },
    []
  );

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
                projectedFeeBurn={projectedFeeBurn}
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
                    {new Intl.NumberFormat().format(projectedStaking)}
                  </div>
                  <Slider
                    min={5e6}
                    max={65e6}
                    value={projectedStaking}
                    step={1e6}
                    onChange={handleProjectedStakingChange}
                  />
                </div>
                <div className="mt-3">
                  <div className="text-xs text-blue-spindle text-left font-light uppercase leading-2">
                    {Data.fee_burn_pct}
                  </div>
                  <div className="text-xl text-white text-left font-light">
                    {new Intl.NumberFormat().format(projectedFeeBurn)}%
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    value={projectedFeeBurn}
                    step={1}
                    onChange={handleProjectedFeeBurnChange}
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
