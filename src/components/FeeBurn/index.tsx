import React, { memo, FC } from "react";
import SpanMoji from "../SpanMoji";
import CountUp from "react-countup";
import { TimeFrame } from "../TimeFrameControl";
import { BurnRates, FeesBurned, useFeeData } from "../../api";
import { Unit } from "../ComingSoon";
import { WidgetBackground, WidgetTitle } from "../WidgetBits";

const weiToEth = (wei: number): number => wei / 10 ** 18;

const timeframeFeesBurnedMap: Record<
  TimeFrame,
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
  TimeFrame,
  { eth: keyof BurnRates; usd: keyof BurnRates }
> = {
  "5m": { eth: "burnRate5m", usd: "burnRate5mUsd" },
  "1h": { eth: "burnRate1h", usd: "burnRate1hUsd" },
  "24h": { eth: "burnRate24h", usd: "burnRate24hUsd" },
  "7d": { eth: "burnRate7d", usd: "burnRate7dUsd" },
  "30d": { eth: "burnRate30d", usd: "burnRate30dUsd" },
  all: { eth: "burnRateAll", usd: "burnRateAllUsd" },
};

type Props = { onClickTimeFrame: () => void; timeFrame: TimeFrame; unit: Unit };

const CumulativeFeeBurn: FC<Props> = ({
  onClickTimeFrame,
  timeFrame,
  unit,
}) => {
  const { feesBurned, burnRates } = useFeeData();

  const selectedFeesBurned =
    feesBurned === undefined
      ? undefined
      : unit === "eth"
      ? weiToEth(feesBurned[timeframeFeesBurnedMap[timeFrame][unit]])
      : feesBurned[timeframeFeesBurnedMap[timeFrame][unit]] / 1000;

  const selectedBurnRate =
    burnRates === undefined
      ? undefined
      : unit === "eth"
      ? weiToEth(burnRates[timeframeBurnRateMap[timeFrame][unit]])
      : burnRates[timeframeBurnRateMap[timeFrame][unit]] / 1000;

  return (
    <WidgetBackground>
      <WidgetTitle
        onClickTimeFrame={onClickTimeFrame}
        timeFrame={timeFrame}
        title="fee burn"
      />
      <div className="h-4"></div>
      <div className="flex flex-col gap-y-8">
        <div className="flex gap-x-4 items-center font-roboto text-2xl md:text-4xl lg:text-3xl xl:text-4xl">
          {selectedFeesBurned !== undefined ? (
            <>
              <p className="text-white">
                <CountUp
                  decimals={unit === "eth" ? 2 : 1}
                  duration={0.8}
                  separator=","
                  end={selectedFeesBurned}
                  preserveValue={true}
                  suffix={unit === "eth" ? undefined : "K"}
                />
              </p>
              <p className="font-extralight text-blue-spindle">
                {unit === "eth" ? "ETH" : "USD"}
              </p>
            </>
          ) : (
            <p className="font-roboto text-white text-2xl md:text-4xl lg:text-3xl xl:text-4xl">
              loading...
            </p>
          )}
          <SpanMoji emoji="🔥" />
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-inter font-light text-blue-spindle uppercase md:text-md mb-2">
              burn rate
            </p>
            {selectedBurnRate !== undefined ? (
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
            ) : (
              <p className="font-roboto text-white text-2xl">loading...</p>
            )}
          </div>
        </div>
      </div>
    </WidgetBackground>
  );
};

export default memo(CumulativeFeeBurn);
