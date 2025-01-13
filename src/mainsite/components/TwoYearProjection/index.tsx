import dynamic from "next/dynamic";
import TranslationsContext from "../../contexts/TranslationsContext";
import { formatOneDecimal } from "../../../format";
import {
  estimatedDailyFeeBurn,
  estimatedDailyIssuance,
} from "../../utils/metric-utils";
import Slider from "../Slider/Slider";
import { SliderMarker, SliderMarkers } from "../../../components/SliderMarkers";
import { BaseText } from "../../../components/Texts";
import Twemoji from "../../../components/Twemoji";
import styles from "./TwoYearProjection.module.scss";
import type { ChangeEvent, FC, ReactNode } from "react";
import { useCallback, useEffect, useState, useContext } from "react";
import { useBaseFeeOverTime } from "../../api/base-fee-over-time";
import { useBaseFeePerGasStats } from "../../api/base-fee-per-gas-stats";
import { useEffectiveBalanceSum } from "../../api/effective-balance-sum";
const SupplyChart = dynamic(() => import("./TwoYearProjectionChart"));

const MIN_PROJECTED_ETH_STAKING = 1e6;
const DEFAULT_PROJECTED_ETH_STAKING = 30e6;
const MAX_PROJECTED_ETH_STAKING = 69696969;

const MIN_PROJECTED_BASE_GAS_PRICE = 0;
const DEFAULT_PROJECTED_BASE_GAS_PRICE = 60;
const MAX_PROJECTED_BASE_GAS_PRICE = 200;

const DEFAULT_PROJECTED_MERGE_DATE = new Date("2022-09-15T00:00:00Z");

const TwoYearProjection: FC = () => {
  const t = useContext(TranslationsContext);

  const [projectedStaking, setProjectedStaking] = useState(
    DEFAULT_PROJECTED_ETH_STAKING,
  );
  const [projectedBaseGasPrice, setProjectedBaseGasPrice] = useState(
    DEFAULT_PROJECTED_BASE_GAS_PRICE,
  );
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isPeakPresent, setIsPeakPresent] = useState(true);

  const handleProjectedStakingChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setProjectedStaking(parseInt(e.target.value));
      setUserHasAdjustedStakedEth(true);
    },
    [],
  );

  const handleProjectedBaseGasPriceChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setProjectedBaseGasPrice(parseInt(e.target.value));
      setUserHasAdjustedBaseFee(true);
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

  const effectiveBalanceSum = useEffectiveBalanceSum();
  const baseFeesOverTime = useBaseFeeOverTime();
  const baseFeesPerGasStats = useBaseFeePerGasStats();
  const [userHasAdjustedStakedEth, setUserHasAdjustedStakedEth] =
    useState(false);
  const [userHasAdjustedBaseFee, setUserHasAdjustedBaseFee] = useState(false);

  const [baseFeeSliderMarkers, setBaseFeeSliderMarkers] = useState<
    SliderMarker[]
  >([]);
  const [stakedEthSliderMarkers, setStakedEthSliderMarkers] = useState<
    SliderMarker[]
  >([]);

  useEffect(() => {
    if (effectiveBalanceSum === undefined || baseFeesOverTime === undefined) {
      return;
    }
    const intialStakingAmount = effectiveBalanceSum.sum / 1e9;
    setStakedEthSliderMarkers([{ label: "now", value: intialStakingAmount }]);
    if (!userHasAdjustedStakedEth) {
      setProjectedStaking(intialStakingAmount);
    }
    const latestBaseFee =
      baseFeesPerGasStats?.base_fee_per_gas_stats.m5.average;
    if (latestBaseFee === undefined || baseFeesPerGasStats === undefined) {
      return;
    }
    if (!userHasAdjustedBaseFee) {
      setProjectedBaseGasPrice(
        baseFeesPerGasStats?.base_fee_per_gas_stats.since_burn.average / 1e9,
      );
    }

    setBaseFeeSliderMarkers([
      { label: "now", value: latestBaseFee / 1e9 },
      { label: "🦇🔊🚧", value: baseFeesPerGasStats.barrier },
      {
        label: "all",
        value:
          baseFeesPerGasStats.base_fee_per_gas_stats.since_burn.average / 1e9,
      },
      {
        label: "30d",
        value: baseFeesPerGasStats.base_fee_per_gas_stats.d30.average / 1e9,
      },
      {
        label: "7d",
        value: baseFeesPerGasStats.base_fee_per_gas_stats.d7.average / 1e9,
      },
      {
        label: "1d",
        value: baseFeesPerGasStats.base_fee_per_gas_stats.d1.average / 1e9,
      },
    ]);
  }, [baseFeesOverTime, baseFeesPerGasStats, effectiveBalanceSum]);

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
            className={`transition-opacity ${isPeakPresent ? "opacity-1" : "opacity-0"
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
              {Math.round(projectedStaking / 1e6)}
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
          <div className="relative mb-10">
            <Slider
              min={MIN_PROJECTED_ETH_STAKING}
              max={MAX_PROJECTED_ETH_STAKING}
              value={projectedStaking}
              step={1e6}
              onChange={handleProjectedStakingChange}
              onPointerDown={handleProjectedStakingPointerDown}
              onPointerUp={handleProjectedStakingPointerUp}
            />
            <SliderMarkers
              markerList={stakedEthSliderMarkers}
              min={MIN_PROJECTED_ETH_STAKING}
              max={MAX_PROJECTED_ETH_STAKING}
            />
          </div>
        </Param>

        <Param
          title={t.base_gas_price}
          value={<>{Math.round(projectedBaseGasPrice)} Gwei</>}
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
          <div className="relative mb-10">
            <Slider
              min={MIN_PROJECTED_BASE_GAS_PRICE}
              max={MAX_PROJECTED_BASE_GAS_PRICE}
              value={projectedBaseGasPrice}
              step={1}
              onChange={handleProjectedBaseGasPriceChange}
            />
            <SliderMarkers
              markerList={baseFeeSliderMarkers}
              min={MIN_PROJECTED_BASE_GAS_PRICE}
              max={MAX_PROJECTED_BASE_GAS_PRICE}
            />
          </div>
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
