import * as React from "react";
import { DateTime } from "luxon";
import Slider from "../Slider/Slider";
import SupplyChart from "./SupplyChart";
import {
  estimatedDailyFeeBurn,
  estimatedDailyIssuance,
} from "../../utils/metric-utils";
import { useTranslations } from "../../utils/use-translation";
import styles from "./Dashboard.module.scss";

const MIN_PROJECTED_ETH_STAKING = 1e6;
const DEFAULT_PROJECTED_ETH_STAKING = 10e6;
const MAX_PROJECTED_ETH_STAKING = 33554432;
const DEFAULT_PROJECTED_BASE_GAS_PRICE = 20;
const DEFAULT_PROJECTED_MERGE_DATE = DateTime.utc(2022, 1, 31);
const MAX_PROJECTED_MERGE_DATE = DateTime.utc(2022, 12, 31);

const intlFormatter = new Intl.NumberFormat();

const DashboardPage: React.FC<{}> = () => {
  const { translations: t } = useTranslations();

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
          <div className="dash-wrapper">
            <div className="">
              <div className={styles.chartHeader}>
                <div>
                  <div className="text-xl text-white text-left font-light leading-2 pl-3 pb-2">
                    {t.eth_supply}
                  </div>
                </div>
              </div>
              <SupplyChart
                projectedStaking={projectedStaking}
                projectedBaseGasPrice={projectedBaseGasPrice}
                projectedMergeDate={projectedMergeDate}
              />
            </div>

            <div className={styles.variables}>
              <div className="dash-variable">
                <div className="text-xs text-blue-spindle font-light uppercase leading-2">
                  {t.eth_staked}
                </div>
                <div className="text-xl text-white font-light">
                  {projectedStaking / 1e6}
                  {t.numeric_million_abbrev.toUpperCase()}
                </div>
                <div className="text-sm text-blue-spindle font-light">
                  {intlFormatter.format(
                    estimatedDailyIssuance(projectedStaking)
                  )}{" "}
                  {t.eth_per_day} {t.pos_issuance}
                </div>
                <Slider
                  min={MIN_PROJECTED_ETH_STAKING}
                  max={MAX_PROJECTED_ETH_STAKING}
                  value={projectedStaking}
                  step={1e6}
                  onChange={handleProjectedStakingChange}
                />
              </div>

              <div className="dash-variable">
                <div className="text-xs text-blue-spindle font-light uppercase leading-2">
                  {t.base_gas_price}
                </div>
                <div className="text-xl text-white font-light">
                  {intlFormatter.format(projectedBaseGasPrice)} Gwei
                </div>
                <div className="text-sm text-blue-spindle font-light">
                  {intlFormatter.format(
                    estimatedDailyFeeBurn(projectedBaseGasPrice)
                  )}{" "}
                  {t.eth_per_day} {t.fee_burn}
                </div>
                <Slider
                  min={0}
                  max={1000}
                  value={projectedBaseGasPrice}
                  step={1}
                  onChange={handleProjectedBaseGasPriceChange}
                />
              </div>

              <div className="dash-variable">
                <div className="text-xs text-blue-spindle font-light uppercase leading-2">
                  {t.merge_date}
                </div>
                <div className="text-xl text-white font-light">
                  {projectedMergeDate.toLocaleString(DateTime.DATE_MED)}
                </div>
                <div className="text-sm text-blue-spindle font-light">
                  {intlFormatter.format(daysUntilProjectedMerge)}{" "}
                  {t.days_until_merge}
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
    </>
  );
};

export default DashboardPage;
