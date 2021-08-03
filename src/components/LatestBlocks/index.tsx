import React, { memo, FC, useRef, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { CSSTransition } from "react-transition-group";

const weiToGwei = (wei: number): number => wei / 10 ** 9;
const formatter = Intl.NumberFormat("en", {
  minimumFractionDigits: 4,
});
const formatFee = (fee: number) => formatter.format(weiToGwei(fee));

type FeeBlock = { number: number; fees: number };

const LatestBlocks: FC = () => {
  const { lastJsonMessage } = useWebSocket(
    "ws://api.ultrasound.money/fees-ropsten/base-fee-feed",
    {
      share: true,
      filter: (message) => JSON.parse(message.data).type === "base-fee-update",
    }
  );
  const latestBlocks = useRef<FeeBlock[]>([]);

  if (
    typeof lastJsonMessage?.fees === "number" &&
    typeof lastJsonMessage?.number === "number"
  ) {
    latestBlocks.current.push({
      number: lastJsonMessage.number,
      fees: lastJsonMessage.fees,
    });
  }

  if (latestBlocks.current.length > 5) {
    latestBlocks.current.shift();
  }

  console.log(latestBlocks);

  const Block: FC<FeeBlock> = ({ number, fees }) => (
    <li className="flex justify-between my-8">
      <p className="text-white">Block {number}</p>
      <p className="text-white">
        {formatFee(fees)} <span className="text-blue-spindle">Gwei</span>
      </p>
    </li>
  );

  return (
    <div className="bg-blue-tangaroa w-full rounded-lg p-8 md:p-16 md:w-2/3 md:mx-auto">
      <p className="font-inter font-light text-blue-spindle mb-8 md:mb-8 md:text-xl">
        latest blocks
      </p>
      <ul>
        {latestBlocks.current.length === 0 ? (
          <p className="text-white md:text-4xl">loading...</p>
        ) : (
          latestBlocks.current.map(({ number, fees }) => (
            <CSSTransition
              in={true}
              classNames="enter-fee-block"
              timeout={500}
              appear={true}
              key={number}
            >
              <Block number={number} fees={fees} />
            </CSSTransition>
          ))
        )}
      </ul>
    </div>
  );
};

export default memo(LatestBlocks);
