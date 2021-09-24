import React, { memo, FC, useState, useCallback } from "react";
import SpanMoji from "../SpanMoji";
import CountUp from "react-countup";
import FeePeriodControl, { Timeframe } from "../FeePeriodControl";
import { BurnRates, FeesBurned, useFeeData } from "../../api";
import { formatZeroDigit } from "../../format";

const weiToEth = (wei: number): number => wei / 10 ** 18;

const timeframeFeesBurnedMap: Record<Timeframe, keyof FeesBurned> = {
  "5m": "feesBurned5m",
  "1h": "feesBurned1h",
  "24h": "feesBurned24h",
  "7d": "feesBurned7d",
  "30d": "feesBurned30d",
  all: "feesBurnedAll",
};

const timeframeBurnRateMap: Record<Timeframe, keyof BurnRates> = {
  "5m": "burnRate5m",
  "1h": "burnRate1h",
  "24h": "burnRate24h",
  "7d": "burnRate7d",
  "30d": "burnRate30d",
  all: "burnRateAll",
};

const CumulativeFeeBurn: FC = () => {
  const { feesBurned, burnRates } = useFeeData();
  const [timeframe, setFeePeriod] = useState<string>("all");

  const onSetFeePeriod = useCallback(setFeePeriod, [setFeePeriod]);

  const selectedFeesBurned =
    feesBurned !== undefined && feesBurned[timeframeFeesBurnedMap[timeframe]];
  const selectedBurnRate =
    burnRates !== undefined && burnRates[timeframeBurnRateMap[timeframe]];

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
          {timeframe === "tAll" ? (
            <span className="text-blue-manatee font-normal text-sm fadein-animation pl-2">
              ({daysSinceLondonFork}d)
            </span>
          ) : (
            ""
          )}
        </p>
        <FeePeriodControl
          timeframes={["5m", "1h", "24h", "7d", "30d", "all"]}
          selectedTimeframe={timeframe}
          onSetFeePeriod={onSetFeePeriod}
        />
      </div>
      <div className="h-6"></div>
      {selectedFeesBurned !== undefined && selectedBurnRate !== undefined ? (
        <>
          <div className="flex justify-between items-center text-3xl md:text-4xl lg:text-3xl xl:text-5xl">
            <p className="font-roboto text-white">
              <CountUp
                decimals={2}
                duration={1}
                separator=","
                end={weiToEth(selectedFeesBurned)}
                preserveValue={true}
              />
              <span className="font-extralight text-blue-spindle pl-4">
                ETH
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
                  duration={1.5}
                  separator=","
                  end={weiToEth(selectedBurnRate)}
                  preserveValue={true}
                />
                <span className="font-extralight text-blue-spindle pl-4">
                  ETH/min
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
