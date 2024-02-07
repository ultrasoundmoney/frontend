import dynamic from "next/dynamic";
import TranslationsContext from "../../contexts/TranslationsContext";
import { formatOneDecimal } from "../../../format";
import { GWEI_PER_ETH, Gwei } from "../../../eth-units";
import {
  estimatedDailyFeeBurn,
  estimatedDailyIssuance,
} from "../../utils/metric-utils";
import Slider from "../Slider/Slider";
import { BaseText } from "../../../components/Texts";
import Twemoji from "../../../components/Twemoji";
import styles from "./TwoYearProjection.module.scss";
import type { ChangeEvent, FC, ReactNode } from "react";
import { useCallback, useEffect, useState, useContext } from "react";
import { useEffectiveBalanceSum } from "../../api/effective-balance-sum";
const SupplyChart = dynamic(() => import("./TwoYearProjectionChart"));

const MIN_PROJECTED_ETH_STAKING = 1e6;
const DEFAULT_PROJECTED_ETH_STAKING = 30e6;
const MAX_PROJECTED_ETH_STAKING = 69696969;

const MIN_PROJECTED_BASE_GAS_PRICE = 0;
const DEFAULT_PROJECTED_BASE_GAS_PRICE = 60;
const MAX_PROJECTED_BASE_GAS_PRICE = 420;

const DEFAULT_PROJECTED_MERGE_DATE = new Date("2022-09-15T00:00:00Z");

const TwoYearProjection: FC = () => {
  const t = useContext(TranslationsContext);

  // TODO Initialize this to current amount of ETH staked
  const [projectedStaking, setProjectedStaking] = useState(
    DEFAULT_PROJECTED_ETH_STAKING,
  );
  // TODO Initialize this to current base gas price
  const [projectedBaseGasPrice, setProjectedBaseGasPrice] = useState(
    DEFAULT_PROJECTED_BASE_GAS_PRICE,
  );
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isPeakPresent, setIsPeakPresent] = useState(true);

  const handleProjectedStakingChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setProjectedStaking(parseInt(e.target.value));
    },
    [],
  );

  const handleProjectedBaseGasPriceChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setProjectedBaseGasPrice(parseInt(e.target.value));
    },
    [],
  );

  const projectedMergeDate = DEFAULT_PROJECTED_MERGE_DATE;
  const handleProjectedStakingPointerDown = useCallback(() => {
    setShowBreakdown(true);
  }, []);

  const handleProjectedStakingPointerUp = useCallback(() => {
    setShowBreakdown(false);
  }, []);

  const handleOnPeakProjectedToggle = useCallback((isPeakPresent: boolean) => {
    setIsPeakPresent(isPeakPresent);
  }, []);

  const [stakingAprFraction, setStakingAprFraction] = useState<number>(0);
  const BASE_REWARD_FACTOR = 64;
  const SECONDS_PER_SLOT = 12;
  const SLOTS_PER_EPOCH = 32;
  const EPOCHS_PER_DAY: number =
    (24 * 60 * 60) / SLOTS_PER_EPOCH / SECONDS_PER_SLOT;
  const EPOCHS_PER_YEAR: number = 365.25 * EPOCHS_PER_DAY;
  const MAX_EFFECTIVE_BALANCE: number = 32 * GWEI_PER_ETH;
  const BASE_REWARDS_PER_EPOCH = 4;

  const getIssuanceApr = (effective_balance_sum: Gwei): number => {
    const balance_sum_gwei = effective_balance_sum;
    const max_issuance_per_epoch = Math.trunc(
      (BASE_REWARD_FACTOR * balance_sum_gwei) /
        Math.floor(Math.sqrt(balance_sum_gwei)),
    );
    const issuancePerYear = max_issuance_per_epoch * EPOCHS_PER_YEAR;
    const apr = issuancePerYear / balance_sum_gwei;
    return apr;
  };

  const getStakedFromApr = (apr: number): number => {
    const baseReward = (apr * 32e9) / 4 / EPOCHS_PER_YEAR;
    const active_validators =
      ((MAX_EFFECTIVE_BALANCE * BASE_REWARD_FACTOR) /
        BASE_REWARDS_PER_EPOCH /
        baseReward) **
        2 /
      32e9;
    return active_validators * 32;
  };

  const effectiveBalanceSum = useEffectiveBalanceSum();

  useEffect(() => {
    if (effectiveBalanceSum === undefined) {
      return;
    }
    const initialStakingApr = getIssuanceApr(effectiveBalanceSum.sum);
    setStakingAprFraction(initialStakingApr);
  }, [effectiveBalanceSum, stakingAprFraction]);

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
              {getStakedFromApr(stakingAprFraction) / 1e6}
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
  title: ReactNode;
  value: ReactNode;
  subValue: ReactNode;
  children: ReactNode;
}

const Param: FC<ParamProps> = ({ title, value, subValue, children }) => (
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
