import React, { memo, FC } from "react";
import SpanMoji from "../SpanMoji";
import CountUp from "react-countup";
import { Timeframe } from "../FeePeriodControl";
import { BurnRates, FeesBurned, useFeeData } from "../../api";
import { formatZeroDigit } from "../../format";
import { Unit } from "../ComingSoon";

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
      : feesBurned[timeframeFeesBurnedMap[timeframe][unit]];

  const selectedBurnRate =
    burnRates === undefined
      ? undefined
      : unit === "eth"
      ? weiToEth(burnRates[timeframeBurnRateMap[timeframe][unit]])
      : burnRates[timeframeBurnRateMap[timeframe][unit]];

  const LONDON_TIMESTAMP = Date.parse("Aug 5 2021 12:33:42 UTC");
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysSinceLondonFork = formatZeroDigit(
    Math.floor((Date.now() - LONDON_TIMESTAMP) / msPerDay)
  );

  return (
    <div className="bg-blue-tangaroa w-full rounded-lg p-8">
      <div className="flex flex-col justify-between items-start md:flex-row lg:flex-col xl:items-center xl:flex-row">
        <p className="font-inter font-light text-blue-spindle text-md mb-4 md:mb-0 lg:mb-4 xl:mb-0">
          <span className="uppercase">fee burn</span>{" "}
          <span className="text-blue-manatee font-normal text-sm pl-2">
            ({timeframe === "all" ? `${daysSinceLondonFork}d` : `${timeframe}`})
          </span>
        </p>
      </div>
      <div className="h-6"></div>
      {selectedFeesBurned !== undefined && selectedBurnRate !== undefined ? (
        <>
          <div className="flex justify-between items-center text-3xl md:text-4xl lg:text-3xl xl:text-5xl">
            <p className="font-roboto text-white">
              <CountUp
                decimals={2}
                duration={0.8}
                separator=","
                end={selectedFeesBurned}
                preserveValue={true}
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
                  decimals={2}
                  duration={0.8}
                  separator=","
                  end={selectedBurnRate}
                  preserveValue={true}
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
    </div>
  );
};

export default memo(CumulativeFeeBurn);
