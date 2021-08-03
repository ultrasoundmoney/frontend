import React, { memo, FC, useRef, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import SpanMoji from "../SpanMoji";
import CountUp from "react-countup";
import { CSSTransition } from "react-transition-group";

const weiToEth = (wei: number): number => wei / 10 ** 18;
const weiToGwei = (wei: number): number => wei / 10 ** 9;

const TotalFeeBurn: FC = () => {
  const { lastJsonMessage } = useWebSocket(
    "ws://api.ultrasound.money/fees-ropsten/base-fee-feed",
    {
      share: true,
      filter: (message) => JSON.parse(message.data).type === "base-fee-update",
    }
  );
  const totalFeesBurned: number | undefined = lastJsonMessage?.totalFeesBurned;
  const blockNr = lastJsonMessage?.number;

  const prevTotalFeesBurnedRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (typeof totalFeesBurned === "number")
      prevTotalFeesBurnedRef.current = totalFeesBurned;
  });
  const prevTotalFeesBurned = prevTotalFeesBurnedRef.current;

  return (
    <div className="bg-blue-tangaroa w-full rounded-lg p-8 md:p-16 md:w-2/3 md:mx-auto">
      <div className="flex justify-between">
        <p className="font-inter font-light text-white md:text-xl mb-2">
          cumulative fee burn
        </p>
      </div>
      {typeof totalFeesBurned === "number" ? (
        <p className="font-roboto flex justify-between text-white text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
          <CountUp
            decimals={2}
            duration={2.5}
            separator=","
            end={weiToEth(totalFeesBurned)}
            suffix=" ETH"
            preserveValue={true}
          />
          <SpanMoji emoji="🔥" />
        </p>
      ) : (
        <p className="font-roboto text-white text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
          loading...
        </p>
      )}
      {/* {typeof totalFeesBurned === "number" && */}
      {/*   typeof prevTotalFeesBurned === "number" && ( */}
      {/*     <CSSTransition */}
      {/*       in={prevTotalFeesBurned !== totalFeesBurned} */}
      {/*       classNames="burn-block-update" */}
      {/*       timeout={3000} */}
      {/*       appear={true} */}
      {/*     > */}
      {/*       <p className="text-blue-spindle mt-8 md:text-xl"> */}
      {/*         block {blockNr} */}
      {/*         {`, added ${weiToGwei( */}
      {/*           totalFeesBurned - prevTotalFeesBurned */}
      {/*         )} Gwei`} */}
      {/*       </p> */}
      {/*     </CSSTransition> */}
      {/*   )} */}
    </div>
  );
};

export default memo(TotalFeeBurn);
