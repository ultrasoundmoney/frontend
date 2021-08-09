import React, { memo, FC } from "react";
import SpanMoji from "../SpanMoji";
import CountUp from "react-countup";
import useSWR from "swr";

const weiToEth = (wei: number): number => wei / 10 ** 18;

const useTotalBurned = () => {
  const { data, error } = useSWR<{ totalFeesBurned: number }>(
    `https://api.ultrasound.money/fees/total-burned`,
    {
      refreshInterval: 8000,
    }
  );

  return {
    totalFeesBurned: data?.totalFeesBurned,
    isLoading: !error && !data,
    isError: error,
  };
};

const useBurnRates = () => {
  const { data, error } = useSWR<{
    burnRates: { burnRate1h: number; burnRate24h: number };
  }>(`https://api.ultrasound.money/fees/burn-rate`, {
    refreshInterval: 8000,
  });

  return {
    burnRate1h: data?.burnRates?.burnRate1h,
    burnRate24h: data?.burnRates?.burnRate24h,
    isLoading: !error && !data,
    isError: error,
  };
};

const CumulativeFeeBurn: FC = () => {
  const { totalFeesBurned } = useTotalBurned();
  const { burnRate1h, burnRate24h } = useBurnRates();

  return (
    <div className="bg-blue-tangaroa w-full rounded-lg p-8">
      <p className="font-inter font-light text-blue-shipcove md:text-xl mb-2">
        cumulative fee burn
      </p>
      {typeof totalFeesBurned === "number" ? (
        <div>
          <p className="font-roboto flex justify-between text-white text-3xl md:text-4xl lg:text-3xl xl:text-5xl">
            <CountUp
              decimals={2}
              duration={1.5}
              separator=","
              end={weiToEth(totalFeesBurned)}
              suffix=" ETH"
              preserveValue={true}
            />
            <SpanMoji emoji="🔥" />
          </p>
          <p className="font-roboto text-blue-spindle text-sm mt-3">
            <CountUp
              decimals={2}
              duration={1.5}
              separator=","
              end={
                weiToEth(totalFeesBurned) /
                ((new Date().getTime() - 1628166822000) / 1000 / 60)
              }
              suffix=" ETH/min"
              preserveValue={true}
            />{" "}
            average
          </p>
        </div>
      ) : (
        <p className="font-roboto text-white text-white text-3xl md:text-4xl lg:text-3xl xl:text-5xl">
          loading...
        </p>
      )}
      <div className="flex justify-between mt-8">
        <div>
          <p className="font-inter font-light text-blue-shipcove md:text-xl mb-2">
            burn rate 1h
          </p>
          {typeof burnRate1h === "number" ? (
            <p className="font-roboto flex justify-between text-white text-xl">
              <CountUp
                decimals={2}
                duration={1.5}
                separator=","
                end={weiToEth(burnRate1h)}
                suffix=" ETH/min"
                preserveValue={true}
              />
            </p>
          ) : (
            <p className="font-roboto text-white text-white text-base">
              loading...
            </p>
          )}
        </div>
        <div>
          <p className="font-inter font-light text-blue-shipcove md:text-xl mb-2">
            burn rate 24h
          </p>
          {typeof burnRate24h === "number" ? (
            <p className="font-roboto flex justify-between text-white text-xl">
              <CountUp
                decimals={2}
                duration={1.5}
                separator=","
                end={weiToEth(burnRate24h)}
                suffix=" ETH/min"
                preserveValue={true}
              />
            </p>
          ) : (
            <p className="font-roboto text-white text-white text-base">
              loading...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(CumulativeFeeBurn);
