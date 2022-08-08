import * as DateFns from "date-fns";
import * as React from "react";
import { formatOneDecimal } from "../../format";
import { pipe } from "../../fp";
import {
  estimatedDailyFeeBurn,
  estimatedDailyIssuance,
} from "../../utils/metric-utils";
import { useTranslations } from "../../utils/use-translation";
import Slider from "../Slider/Slider";
import { TextInter } from "../Texts";
import Twemoji from "../Twemoji";
import SupplyChart from "./SupplyChart";
import styles from "./SupplyView.module.scss";

const MIN_PROJECTED_ETH_STAKING = 1e6;
const DEFAULT_PROJECTED_ETH_STAKING = 14e6;
const MAX_PROJECTED_ETH_STAKING = 33554432;

const MIN_PROJECTED_BASE_GAS_PRICE = 0;
const DEFAULT_PROJECTED_BASE_GAS_PRICE = 74;
const MAX_PROJECTED_BASE_GAS_PRICE = 200;

const MIN_PROJECTED_MERGE_DATE = DateFns.startOfDay(new Date());
const DEFAULT_PROJECTED_MERGE_DATE = DateFns.max([
  DateFns.parseISO("2022-09-19T00:00:00Z"),
  MIN_PROJECTED_MERGE_DATE,
]);
const MAX_PROJECTED_MERGE_DATE = DateFns.parseISO("2022-12-31T00:00:00Z");

const getDaysUntil = (dt: Date) =>
  DateFns.differenceInDays(dt, DateFns.startOfDay(new Date()));

const SupplyView: React.FC = () => {
  const { translations: t } = useTranslations();
  const [daysUntilMaxProjectedMergeDate, setMaxDaysUntilMerge] = React.useState(
    getDaysUntil(MAX_PROJECTED_MERGE_DATE),
  );

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
      if (
        getDaysUntil(MAX_PROJECTED_MERGE_DATE) !==
        daysUntilMaxProjectedMergeDate
      ) {
        setMaxDaysUntilMerge(getDaysUntil(MAX_PROJECTED_MERGE_DATE));
      }

      const numDays: number = parseInt(e.target.value);
      const projectedDate = pipe(new Date(), DateFns.startOfDay, (dt) =>
        DateFns.addDays(dt, numDays),
      );
      setProjectedMergeDate(projectedDate);
    },
    [daysUntilMaxProjectedMergeDate],
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

  const daysUntilProjectedMerge = getDaysUntil(projectedMergeDate);
  const daysUntilMinProjectedMerge = getDaysUntil(MIN_PROJECTED_MERGE_DATE);

  return (
    <>
      <div className={styles.chartHeader}>
        <TextInter
          className="font-light text-blue-spindle text-xs uppercase tracking-widest flex items-center pl-3 pb-8"
          inline
        >
          historical supply
          <span
            className={`transition-opacity ${
              isPeakPresent ? "opacity-1" : "opacity-0"
            }`}
          >
            <Twemoji imageClassName="inline ml-1 h-6" wrapper>
              🦇🔊
            </Twemoji>
          </span>
        </TextInter>
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
              {formatOneDecimal(
                estimatedDailyIssuance(projectedStaking) / 1000,
              )}
              K {t.eth_per_day}
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
              {formatOneDecimal(
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
            max={daysUntilMaxProjectedMergeDate}
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
