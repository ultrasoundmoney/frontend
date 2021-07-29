import React, { memo, FC, useRef, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import SpanMoji from "../SpanMoji";
import CountUp from "react-countup";

const weiToEth = (wei: number): number => wei / 10 ** 18;
const socketUrl = "ws://api.ultrasound.money/fees-ropsten/base-fee-feed";

const TotalFeeBurn: FC = () => {
  const { lastJsonMessage } = useWebSocket(socketUrl, { share: true });
  const totalFeesBurned = lastJsonMessage?.totalFeesBurned;

  const prevTotalFeesBurnedRef = useRef(0);
  useEffect(() => {
    if (typeof totalFeesBurned === "number")
      prevTotalFeesBurnedRef.current = totalFeesBurned;
  });
  const prevTotalFeesBurned = prevTotalFeesBurnedRef.current;

  return (
    <div className="bg-blue-tangaroa w-full rounded-lg p-8 md:p-16 md:w-2/3 md:mx-auto">
      <p className="text-blue-spindle mb-4 md:mb-8 md:text-xl">
        Fees Burned{" "}
        <span className="animate-pulse">
          <SpanMoji emoji="🔥" />
        </span>
      </p>

      {typeof totalFeesBurned === "number" ? (
        <CountUp
          start={weiToEth(prevTotalFeesBurned)}
          end={weiToEth(totalFeesBurned)}
          duration={5}
          decimals={4}
          suffix=" ETH"
        >
          {({ countUpRef }) => (
            <p
              className="text-white text-3xl md:text-4xl lg:text-5xl"
              ref={countUpRef}
            ></p>
          )}
        </CountUp>
      ) : (
        <h1 className="text-white text-3xl md:text-4xl">loading...</h1>
      )}
    </div>
  );
};

export default memo(TotalFeeBurn);
