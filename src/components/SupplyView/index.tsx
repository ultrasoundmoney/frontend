import * as React from "react";
import { DateTime } from "luxon";
import Slider from "../Slider/Slider";
import SupplyChart from "./SupplyChart";
import { intlFormat } from "../../utils/number-utils";
import {
  estimatedDailyFeeBurn,
  estimatedDailyIssuance,
} from "../../utils/metric-utils";
import { useTranslations } from "../../utils/use-translation";
import styles from "./SupplyView.module.scss";

const MIN_PROJECTED_ETH_STAKING = 1e6;
const DEFAULT_PROJECTED_ETH_STAKING = 10e6;
const MAX_PROJECTED_ETH_STAKING = 33554432;

const MIN_PROJECTED_BASE_GAS_PRICE = 0;
const DEFAULT_PROJECTED_BASE_GAS_PRICE = 20;
const MAX_PROJECTED_BASE_GAS_PRICE = 200;

const MIN_PROJECTED_MERGE_DATE = DateTime.utc(2021, 12, 1);
const DEFAULT_PROJECTED_MERGE_DATE = DateTime.utc(2022, 1, 31);
const MAX_PROJECTED_MERGE_DATE = DateTime.utc(2022, 12, 31);

const SupplyView: React.FC<{}> = () => {
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
  const daysUntilMinProjectedMerge = MIN_PROJECTED_MERGE_DATE.diff(
    DateTime.utc().startOf("day"),
    "days"
  ).days;
  const daysUntilMaxProjectedMerge = MAX_PROJECTED_MERGE_DATE.diff(
    DateTime.utc().startOf("day"),
    "days"
  ).days;

  return (
    <div>
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

      <div className={styles.params}>
        <Param
          title={t.eth_staked}
          value={
            <>
              {projectedStaking / 1e6}
              {t.numeric_million_abbrev} ETH
            </>
          }
          subValue={
            <>
              {t.pos_issuance}
              {": "}
              {intlFormat(estimatedDailyIssuance(projectedStaking))}{" "}
              {t.eth_per_day}
            </>
          }
        >
          <Slider
            min={MIN_PROJECTED_ETH_STAKING}
            max={MAX_PROJECTED_ETH_STAKING}
            value={projectedStaking}
            step={1e6}
            onChange={handleProjectedStakingChange}
          />
        </Param>

        <Param
          title={t.base_gas_price}
          value={<>{intlFormat(projectedBaseGasPrice)} Gwei</>}
          subValue={
            <>
              {t.fee_burn}
              {": "}
              {intlFormat(estimatedDailyFeeBurn(projectedBaseGasPrice))}{" "}
              {t.eth_per_day}
            </>
          }
        >
          <Slider
            min={MIN_PROJECTED_BASE_GAS_PRICE}
            max={MAX_PROJECTED_BASE_GAS_PRICE}
            value={projectedBaseGasPrice}
            step={1}
            onChange={handleProjectedBaseGasPriceChange}
          />
        </Param>

        <Param
          title={t.merge_date}
          value={projectedMergeDate.toLocaleString(DateTime.DATE_MED)}
          subValue={
            <>
              {t.pow_removal}
              {": in "}
              {intlFormat(daysUntilProjectedMerge)}{" "}
              {daysUntilProjectedMerge === 1 ? "day" : "days"}
            </>
          }
        >
          <Slider
            min={daysUntilMinProjectedMerge}
            max={daysUntilMaxProjectedMerge}
            value={daysUntilProjectedMerge}
            step={1}
            onChange={handleProjectedMergeDateChange}
          />
        </Param>
      </div>
    </div>
  );
};

interface ParamProps {
  title: React.ReactNode;
  value: React.ReactNode;
  subValue: React.ReactNode;
  children: React.ReactNode;
}

function Param({ title, value, subValue, children }: ParamProps) {
  return (
    <div className={styles.param}>
      <div className={`text-blue-spindle ${styles.paramTitle}`}>{title}</div>
      <div className={styles.paramValueContainer}>
        <div className={styles.paramValue}>{value}</div>
        <div className={`text-blue-spindle ${styles.paramSubValue}`}>
          {subValue}
        </div>
      </div>
      {children}
    </div>
  );
}

export default SupplyView;
