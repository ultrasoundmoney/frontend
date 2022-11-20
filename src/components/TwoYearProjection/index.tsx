import dynamic from "next/dynamic";
import * as React from "react";
import TranslationsContext from "../../contexts/TranslationsContext";
import { formatOneDecimal } from "../../format";
import {
  estimatedDailyFeeBurn,
  estimatedDailyIssuance,
} from "../../utils/metric-utils";
import Slider from "../Slider/Slider";
import { BaseText } from "../Texts";
import Twemoji from "../Twemoji";
import styles from "./TwoYearProjection.module.scss";
const SupplyChart = dynamic(() => import("./TwoYearProjectionChart"));

const MIN_PROJECTED_ETH_STAKING = 1e6;
const DEFAULT_PROJECTED_ETH_STAKING = 30e6;
const MAX_PROJECTED_ETH_STAKING = 69696969;

const MIN_PROJECTED_BASE_GAS_PRICE = 0;
const DEFAULT_PROJECTED_BASE_GAS_PRICE = 60;
const MAX_PROJECTED_BASE_GAS_PRICE = 420;

const DEFAULT_PROJECTED_MERGE_DATE = new Date("2022-09-15T00:00:00Z");

const TwoYearProjection: React.FC = () => {
  const t = React.useContext(TranslationsContext);

  // TODO Initialize this to current amount of ETH staked
  const [projectedStaking, setProjectedStaking] = React.useState(
    DEFAULT_PROJECTED_ETH_STAKING,
  );
  // TODO Initialize this to current base gas price
  const [projectedBaseGasPrice, setProjectedBaseGasPrice] = React.useState(
    DEFAULT_PROJECTED_BASE_GAS_PRICE,
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

  const projectedMergeDate = DEFAULT_PROJECTED_MERGE_DATE;
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

  return (
    <>
      <div className={styles.chartHeader}>
        <BaseText
          font="font-inter"
          className="flex items-center px-3 pb-8 text-xs uppercase tracking-widest text-slateus-200"
          inline
        >
          ETH supply—2y projection
          <span
            className={`transition-opacity ${
              isPeakPresent ? "opacity-1" : "opacity-0"
            }`}
          >
            <Twemoji className="flex" imageClassName="inline ml-1 h-6" wrapper>
              🦇🔊
            </Twemoji>
          </span>
        </BaseText>
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
    <div className={`text-slateus-200 ${styles.paramTitle}`}>{title}</div>
    <div className={styles.paramValue}>{value}</div>
    <div className={styles.paramChildren}>{children}</div>
    <div
      className={`text-xs text-slateus-200 lg:text-base xl:text-lg ${styles.paramSubValue}`}
    >
      {subValue}
    </div>
  </div>
);

export default TwoYearProjection;
