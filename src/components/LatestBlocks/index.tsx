import React, { memo, FC, useRef, useMemo } from "react";
import useWebSocket from "react-use-websocket";
import { CSSTransition } from "react-transition-group";
import _ from "lodash";

const weiToGwei = (wei: number): number => wei / 10 ** 9;
const formatter = Intl.NumberFormat("en", {
  minimumFractionDigits: 4,
});
const formatFee = (fee: number) => formatter.format(weiToGwei(fee));

const LatestBlocks: FC = () => {
  const { lastJsonMessage } = useWebSocket(
    "ws://api.ultrasound.money/fees-ropsten/base-fee-feed",
    {
      share: true,
      filter: (message) => JSON.parse(message.data).type === "base-fee-update",
    }
  );
  const messageHistory = useRef([]);

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

    return messageHistory.current.concat(lastJsonMessage);
  }, [lastJsonMessage]);

  const latestBlocks = _.takeRight(
    messageHistory.current.filter((msg) => msg !== null),
    5
  );

  return (
    <div className="bg-blue-tangaroa w-full rounded-lg p-8 md:p-16 md:w-2/3 md:mx-auto">
      <p className="font-inter font-light text-white mb-8 md:mb-8">
        latest blocks
      </p>
      <ul>
        {messageHistory.current.length === 0 ? (
          <p className="text-white md:text-4xl">loading...</p>
        ) : (
          latestBlocks.map(({ number, fees }) => (
            <CSSTransition
              in={latestBlocks.some((block) => block.number === number)}
              classNames="fee-block"
              timeout={500}
              appear={true}
              key={number}
              unmountOnExit={true}
              enter={false}
            >
              <li className="flex justify-between my-8 fee-block">
                <p className="text-white">Block {number}</p>
                <p className="text-white">
                  {formatFee(fees)}{" "}
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
