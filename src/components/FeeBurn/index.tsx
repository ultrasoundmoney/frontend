import React, { memo, FC } from "react";
import SpanMoji from "../SpanMoji";
import CountUp from "react-countup";
import { Timeframe } from "../FeePeriodControl";
import { BurnRates, FeesBurned, useFeeData } from "../../api";
import { Unit } from "../ComingSoon";
import { WidgetBackground, WidgetTitle } from "../WidgetBits";

const weiToEth = (wei: number): number => wei / 10 ** 18;

const timeframeFeesBurnedMap: Record<
  Timeframe,
  { eth: keyof FeesBurned; usd: keyof FeesBurned }
> = {
  "5m": { eth: "feesBurned5m", usd: "feesBurned5mUsd" },
  "1h": { eth: "feesBurned1h", usd: "feesBurned1hUsd" },
  "24h": { eth: "feesBurned24h", usd: "feesBurned24hUsd" },
  "7d": { eth: "feesBurned7d", usd: "feesBurned7dUsd" },
  "30d": { eth: "feesBurned30d", usd: "feesBurned30dUsd" },
  all: { eth: "feesBurnedAll", usd: "feesBurnedAllUsd" },
};

export const timeframeBurnRateMap: Record<
  Timeframe,
  { eth: keyof BurnRates; usd: keyof BurnRates }
> = {
  "5m": { eth: "burnRate5m", usd: "burnRate5mUsd" },
  "1h": { eth: "burnRate1h", usd: "burnRate1hUsd" },
  "24h": { eth: "burnRate24h", usd: "burnRate24hUsd" },
  "7d": { eth: "burnRate7d", usd: "burnRate7dUsd" },
  "30d": { eth: "burnRate30d", usd: "burnRate30dUsd" },
  all: { eth: "burnRateAll", usd: "burnRateAllUsd" },
};

const CumulativeFeeBurn: FC<{ timeframe: Timeframe; unit: Unit }> = ({
  timeframe,
  unit,
}) => {
  const { feesBurned, burnRates } = useFeeData();

  const selectedFeesBurned =
    feesBurned === undefined
      ? undefined
      : unit === "eth"
      ? weiToEth(feesBurned[timeframeFeesBurnedMap[timeframe][unit]])
      : feesBurned[timeframeFeesBurnedMap[timeframe][unit]] / 1000;

  const selectedBurnRate =
    burnRates === undefined
      ? undefined
      : unit === "eth"
      ? weiToEth(burnRates[timeframeBurnRateMap[timeframe][unit]])
      : burnRates[timeframeBurnRateMap[timeframe][unit]] / 1000;

  return (
    <WidgetBackground>
      <WidgetTitle timeframe={timeframe} title="fee burn" />
      {selectedFeesBurned !== undefined && selectedBurnRate !== undefined ? (
        <>
          <div className="flex justify-between items-center text-2xl md:text-3xl xl:text-4xl">
            <p className="font-roboto text-white">
              <CountUp
                decimals={unit === "eth" ? 2 : 1}
                duration={0.8}
                separator=","
                end={selectedFeesBurned}
                preserveValue={true}
                suffix={unit === "eth" ? undefined : "K"}
              />
              <span className="font-extralight text-blue-spindle pl-4">
                {unit === "eth" ? "ETH" : "USD"}
              </span>
            </p>
            <SpanMoji emoji="🔥" />
          </div>
          <div className="flex justify-between mt-8">
            <div>
              <p className="font-inter font-light text-blue-spindle uppercase md:text-md mb-2">
                burn rate
              </p>
              <p className="font-roboto flex text-white text-2xl">
                <CountUp
                  decimals={unit === "eth" ? 2 : 1}
                  duration={0.8}
                  separator=","
                  end={selectedBurnRate}
                  preserveValue={true}
                  suffix={unit === "eth" ? undefined : "K"}
                />
                <span className="font-extralight text-blue-spindle pl-4">
                  {unit === "eth" ? "ETH/min" : "USD/min"}
                </span>
              </p>
            </div>
          </div>
        </>
      ) : (
        <p className="font-roboto text-white text-3xl md:text-4xl lg:text-3xl xl:text-5xl">
          loading...
        </p>
      )}
    </WidgetBackground>
  );
};

export default memo(CumulativeFeeBurn);
