import React, { memo, FC, useRef, useMemo } from "react";
import useWebSocket from "react-use-websocket";
import { CSSTransition } from "react-transition-group";
import _ from "lodash";

const weiToGwei = (wei: number): number => wei / 10 ** 9;
const formatter = Intl.NumberFormat("en", {
  minimumFractionDigits: 4,
});
const formatFee = (fee: number) => formatter.format(weiToGwei(fee));

type BaseFeeUpdate = {
  baseFeePerGas: number;
  fees: number;
  number: number;
  totalFeesBurned: number;
  type: "base-fee-update";
};

const LatestBlocks: FC = () => {
  const { lastJsonMessage } = useWebSocket(
    "ws://api.ultrasound.money/fees-ropsten/base-fee-feed",
    {
      share: true,
      filter: (message) => JSON.parse(message.data).type === "base-fee-update",
      retryOnError: true,
      shouldReconnect: () => true,
    }
  );
  const messageHistory = useRef<BaseFeeUpdate[]>([]);

  messageHistory.current = useMemo(() => {
    // Initially the message is null. We don't need that one.
    if (lastJsonMessage === null) {
      return messageHistory.current;
    }

    // Sometimes the hook calls us with a message that passes the memo check, yet contains the same values, extra guard here.
    if (
      !_.isEmpty(messageHistory.current) &&
      _.last(messageHistory.current).number === lastJsonMessage.number
    ) {
      return messageHistory.current;
    }

    return [...messageHistory.current, lastJsonMessage];
  }, [lastJsonMessage]);

  const latestBlocks = _.takeRight(messageHistory.current, 5);

  return (
    <div className="bg-blue-tangaroa w-full rounded-lg p-8 md:p-16">
      <span className="font-inter text-blue-spindlefont-light text-white text-xl float-left">
        latest blocks
      </span>
      <span className="font-inter text-blue-spindlefont-light text-white text-xl float-right">
        burn
      </span>
      <div className="py-6"></div>
      <ul>
        {messageHistory.current.length === 0 ? (
          <p className="text-white md:text-4xl">loading...</p>
        ) : (
          latestBlocks.map(({ number, fees }) => (
            <CSSTransition
              classNames="fee-block"
              timeout={500}
              key={number}
              appear
              enter={false}
            >
              <li className="flex justify-between mt-5 fee-block">
                <p className="text-white">
                  block{" "}
                  <span className="font-roboto">
                    #{new Intl.NumberFormat().format(number)}
                  </span>
                </p>
                <p className="text-white">
                  <span className="font-roboto">{formatFee(fees)} </span>
                  <span className="text-blue-spindle">Gwei</span>
                </p>
              </li>
            </CSSTransition>
          ))
        )}
      </ul>
    </div>
  );
};

export default memo(LatestBlocks);
