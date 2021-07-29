import React, { memo, FC, useRef, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import SpanMoji from "../SpanMoji";
import CountUp from "react-countup";

const weiToEth = (wei: number): number => wei / 10 ** 18;
const weiToGwei = (wei: number): number => wei / 10 ** 9;
const socketUrl = "ws://api.ultrasound.money/fees-ropsten/base-fee-feed";

const TotalFeeBurn: FC = () => {
  const { lastJsonMessage } = useWebSocket(socketUrl, { share: true });
  const totalFeesBurned = lastJsonMessage?.totalFeesBurned;
  const blockNr = lastJsonMessage?.number;

  const prevTotalFeesBurnedRef = useRef(undefined);
  useEffect(() => {
    if (typeof totalFeesBurned === "number")
      prevTotalFeesBurnedRef.current = totalFeesBurned;
  });
  const prevTotalFeesBurned = prevTotalFeesBurnedRef.current;

  return (
    <div className="bg-blue-tangaroa w-full rounded-lg p-8 md:p-16 md:w-2/3 md:mx-auto">
      <div className="flex justify-between">
        <p className="text-blue-spindle mb-4 md:mb-8 md:text-xl">
          Fees Burned{" "}
          <span className="animate-pulse">
            <SpanMoji emoji="🔥" />
          </span>
        </p>
      </div>

      {typeof totalFeesBurned === "number" ? (
        <p className="text-white text-3xl md:text-4xl lg:text-5xl">
          <CountUp
            decimals={2}
            duration={4}
            end={weiToEth(totalFeesBurned)}
            suffix=" ETH"
            preserveValue={true}
          />
        </p>
      ) : (
        <h1 className="text-white text-3xl md:text-4xl">loading...</h1>
      )}
      <p className="text-blue-spindle mt-8 md:text-xl">
        block {blockNr}
        {typeof totalFeesBurned === "number" &&
          typeof prevTotalFeesBurned === "number" &&
          `, added ${weiToGwei(totalFeesBurned - prevTotalFeesBurned)} Gwei`}
      </p>
    </div>
  );
};

export default memo(TotalFeeBurn);
