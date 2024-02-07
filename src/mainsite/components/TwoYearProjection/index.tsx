import dynamic from "next/dynamic";
import TranslationsContext from "../../contexts/TranslationsContext";
import { formatOneDecimal } from "../../../format";
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
import { useBaseFeeOverTime } from "../../api/base-fee-over-time";
import { useEffectiveBalanceSum } from "../../api/effective-balance-sum";
import { TimeFrameText } from "../../../components/Texts";
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

  const effectiveBalanceSum = useEffectiveBalanceSum();
  const baseFeesOverTime = useBaseFeeOverTime();
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentStakedEth, setCurrentStakedEth] = useState<number | undefined>(
    undefined,
  );

  const currentStakedEthPercent =
    currentStakedEth !== undefined
      ? ((currentStakedEth - MIN_PROJECTED_ETH_STAKING) /
          MAX_PROJECTED_ETH_STAKING) *
        100
      : undefined;

  const [currentBaseFee, setCurrentBaseFee] = useState<number | undefined>(
    undefined,
  );

  const currentBaseFeePercent =
    currentBaseFee !== undefined
      ? ((currentBaseFee - MIN_PROJECTED_BASE_GAS_PRICE) /
          MAX_PROJECTED_BASE_GAS_PRICE) *
        100
      : undefined;

  useEffect(() => {
    if (
      isInitialized ||
      effectiveBalanceSum === undefined ||
      baseFeesOverTime === undefined
    ) {
      return;
    }
    const intialStakingAmount = Math.round(effectiveBalanceSum.sum / 1e9);
    console.log("intialStakingAmount", intialStakingAmount);
    setCurrentStakedEth(intialStakingAmount);
    setProjectedStaking(intialStakingAmount);
    console.log("baseFeesOverTime:", baseFeesOverTime);
    const latestBaseFee =
      baseFeesOverTime.m5[baseFeesOverTime.m5.length - 1]?.wei;
    if (latestBaseFee === undefined) {
      return;
    }
    setCurrentBaseFee(latestBaseFee / 1e9);
    setProjectedBaseGasPrice(latestBaseFee / 1e9);
    setIsInitialized(true);
  }, [baseFeesOverTime, effectiveBalanceSum]);

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
              {formatOneDecimal(projectedStaking / 1e6)}
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
          <div className="relative z-10">
            <Slider
              min={MIN_PROJECTED_ETH_STAKING}
              max={MAX_PROJECTED_ETH_STAKING}
              value={projectedStaking}
              step={1e6}
              onChange={handleProjectedStakingChange}
              onPointerDown={handleProjectedStakingPointerDown}
              onPointerUp={handleProjectedStakingPointerUp}
            />
            <div
              className={`
                  relative  flex
                  -translate-x-1/2 select-none flex-col
                  items-center
                  ${
                    currentStakedEthPercent === undefined
                      ? "invisible"
                      : "visible"
                  }
                `}
              style={{
                // Positions the marker along the track whilst compensating for the thumb width as the browser natively does. 7 being half the thumb width.
                left: `calc(${currentStakedEthPercent}% - ${
                  (((currentStakedEthPercent ?? 0) / 100) * 2 - 1) * 7
                }px)`,
              }}
            >
              <div className="-mt-0.5 h-2 w-0.5 rounded-b-full bg-slateus-200"></div>
              <TimeFrameText className="mt-0.5 text-slateus-200">
                now
              </TimeFrameText>
            </div>
          </div>
        </Param>

        <Param
          title={t.base_gas_price}
          value={<>{formatOneDecimal(projectedBaseGasPrice)} Gwei</>}
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
          <div className="relative z-10">
            <Slider
              min={MIN_PROJECTED_BASE_GAS_PRICE}
              max={MAX_PROJECTED_BASE_GAS_PRICE}
              value={projectedBaseGasPrice}
              step={1}
              onChange={handleProjectedBaseGasPriceChange}
            />
            <div
              className={`
                  relative flex
                  -translate-x-1/2 select-none flex-col
                  items-center
                  ${
                    currentBaseFeePercent === undefined
                      ? "invisible"
                      : "visible"
                  }
                `}
              style={{
                // Positions the marker along the track whilst compensating for the thumb width as the browser natively does. 7 being half the thumb width.
                left: `calc(${currentBaseFeePercent}% - ${
                  (((currentBaseFeePercent ?? 0) / 100) * 2 - 1) * 7
                }px)`,
              }}
            >
              <div className="-mt-0.5 h-2 w-0.5 rounded-b-full bg-slateus-200"></div>
              <TimeFrameText className="mt-0.5 text-slateus-200">
                now
              </TimeFrameText>
            </div>
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
