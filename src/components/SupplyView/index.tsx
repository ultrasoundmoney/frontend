import * as DateFns from "date-fns";
import * as React from "react";
import { formatOneDigit } from "../../format";
import { pipe } from "../../fp";
import {
  estimatedDailyFeeBurn,
  estimatedDailyIssuance,
} from "../../utils/metric-utils";
import { useTranslations } from "../../utils/use-translation";
import Slider from "../Slider/Slider";
import Twemoji from "../Twemoji";
import SupplyChart from "./SupplyChart";
import styles from "./SupplyView.module.scss";

const MIN_PROJECTED_ETH_STAKING = 1e6;
const DEFAULT_PROJECTED_ETH_STAKING = 15e6;
const MAX_PROJECTED_ETH_STAKING = 33554432;

const MIN_PROJECTED_BASE_GAS_PRICE = 0;
const DEFAULT_PROJECTED_BASE_GAS_PRICE = 100;
const MAX_PROJECTED_BASE_GAS_PRICE = 200;

const MIN_PROJECTED_MERGE_DATE = DateFns.parseISO("2021-01-01T00:00:00Z");
const DEFAULT_PROJECTED_MERGE_DATE = DateFns.parseISO("2022-07-01T00:00:00Z");
const MAX_PROJECTED_MERGE_DATE = DateFns.parseISO("2022-12-31T00:00:00Z");

const SupplyView: React.FC = () => {
  const { translations: t } = useTranslations();

  // TODO Initialize this to current amount of ETH staked
  const [projectedStaking, setProjectedStaking] = React.useState(
    DEFAULT_PROJECTED_ETH_STAKING,
  );
  // TODO Initialize this to current base gas price
  const [projectedBaseGasPrice, setProjectedBaseGasPrice] = React.useState(
    DEFAULT_PROJECTED_BASE_GAS_PRICE,
  );
  const [projectedMergeDate, setProjectedMergeDate] = React.useState(
    DEFAULT_PROJECTED_MERGE_DATE,
  );
  const [showBreakdown, setShowBreakdown] = React.useState(false);
  const [isPeakPresent, setIsPeakPresent] = React.useState(true);

  const handleProjectedStakingChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setProjectedStaking(parseInt(e.target.value));
    },
    [],
  );

  const handleProjectedBaseGasPriceChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setProjectedBaseGasPrice(parseInt(e.target.value));
    },
    [],
  );

  const handleProjectedMergeDateChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const numDays: number = parseInt(e.target.value);
      const projectedDate = pipe(new Date(), DateFns.startOfDay, (dt) =>
        DateFns.addDays(dt, numDays),
      );
      setProjectedMergeDate(projectedDate);
    },
    [],
  );

  const handleProjectedStakingPointerDown = React.useCallback(() => {
    setShowBreakdown(true);
  }, []);

  const handleProjectedStakingPointerUp = React.useCallback(() => {
    setShowBreakdown(false);
  }, []);

  const handleOnPeakProjectedToggle = React.useCallback(
    (isPeakPresent: boolean) => {
      setIsPeakPresent(isPeakPresent);
    },
    [],
  );

  const getDaysUntil = (dt: Date) =>
    DateFns.differenceInDays(dt, DateFns.startOfDay(new Date()));

  const daysUntilProjectedMerge = getDaysUntil(projectedMergeDate);
  const daysUntilMinProjectedMerge = getDaysUntil(MIN_PROJECTED_MERGE_DATE);
  const daysUntilMaxProjectedMerge = getDaysUntil(MAX_PROJECTED_MERGE_DATE);

  return (
    <>
      <div className={styles.chartHeader}>
        <div className="text-xl text-white text-left font-light pl-3 pb-8 flex">
          {t.eth_supply}
          <span
            className={`transition-opacity ${
              isPeakPresent ? "opacity-1" : "opacity-0"
            }`}
          >
            <Twemoji imageClassName="inline ml-1 h-6" wrapper>
              🦇🔊
            </Twemoji>
          </span>
        </div>
      </div>
      <SupplyChart
        projectedStaking={projectedStaking}
        projectedBaseGasPrice={projectedBaseGasPrice}
        projectedMergeDate={projectedMergeDate}
        showBreakdown={showBreakdown}
        onPeakProjectedToggle={handleOnPeakProjectedToggle}
      />

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
              {formatOneDigit(
                estimatedDailyIssuance(projectedStaking) / 1000,
              )}K {t.eth_per_day}
            </>
          }
        >
          <Slider
            min={MIN_PROJECTED_ETH_STAKING}
            max={MAX_PROJECTED_ETH_STAKING}
            value={projectedStaking}
            step={1e6}
            onChange={handleProjectedStakingChange}
            onPointerDown={handleProjectedStakingPointerDown}
            onPointerUp={handleProjectedStakingPointerUp}
          />
        </Param>

        <Param
          title={t.base_gas_price}
          value={<>{projectedBaseGasPrice} Gwei</>}
          subValue={
            <>
              {t.fee_burn}
              {": "}
              {formatOneDigit(
                estimatedDailyFeeBurn(projectedBaseGasPrice) / 1000,
              )}
              K {t.eth_per_day}
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
          value={DateFns.format(projectedMergeDate, "d MMM yyyy")}
          subValue={`${t.pow_removal}: in ${daysUntilProjectedMerge} ${
            daysUntilProjectedMerge === 1 ? "day" : "days"
          }`}
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
    </>
  );
};

interface ParamProps {
  title: React.ReactNode;
  value: React.ReactNode;
  subValue: React.ReactNode;
  children: React.ReactNode;
}

const Param: React.FC<ParamProps> = ({ title, value, subValue, children }) => (
  <div className={styles.param}>
    <div className={`text-blue-spindle ${styles.paramTitle}`}>{title}</div>
    <div className={styles.paramValue}>{value}</div>
    <div className={styles.paramChildren}>{children}</div>
    <div
      className={`text-blue-spindle text-xs lg:text-base xl:text-lg ${styles.paramSubValue}`}
    >
      {subValue}
    </div>
  </div>
);

export default SupplyView;
