import React, { memo, FC, useRef, useMemo } from "react";
import useWebSocket from "react-use-websocket";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import _ from "lodash";
import styles from "./LatestBlocks.module.scss";
import { weiToEth } from "../../utils/metric-utils";

const formatter = Intl.NumberFormat("en", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const formatFee = (fee: number) => formatter.format(weiToEth(fee));

type BaseFeeUpdate = {
  baseFeePerGas: number;
  fees: number;
  number: number;
  totalFeesBurned: number;
  type: "base-fee-update";
};

export const useBlockHistory = () => {
  const { lastJsonMessage } = useWebSocket(
    "wss://api.ultrasound.money/fees/base-fee-feed",
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

  const latestBlocks = _.takeRight(messageHistory.current, 7)
    .sort((a, b) => a.number - b.number)
    .reverse();
  return latestBlocks;
};

const LatestBlocks: FC = () => {
  const latestBlocks = useBlockHistory();

  return (
    <div
      className={`bg-blue-tangaroa w-full rounded-lg p-8 ${styles["balance-padding"]}`}
    >
      <span className="font-inter text-blue-spindlefont-light text-blue-shipcove text-xl float-left">
        latest blocks
      </span>
      <span className="font-inter text-blue-spindlefont-light text-blue-shipcove text-xl float-right">
        burn
      </span>
      <div className="py-6"></div>
      <ul>
        {latestBlocks.length === 0 ? (
          <p className="font-roboto text-white md:text-4xl">loading...</p>
        ) : (
          <TransitionGroup
            component={null}
            appear={true}
            enter={false}
            exit={false}
          >
            {latestBlocks.map(({ number, fees }) => (
              <CSSTransition classNames="fee-block" timeout={500} key={number}>
                <li className="flex justify-between mt-5 fee-block">
                  <p className="text-white">
                    block{" "}
                    <span className="font-roboto">
                      #{new Intl.NumberFormat().format(number)}
                    </span>
                  </p>
                  <p className="text-white">
                    <span className="font-roboto">{formatFee(fees)} </span>
                    <span className="text-blue-spindle">ETH</span>
                  </p>
                </li>
              </CSSTransition>
            ))}
          </TransitionGroup>
        )}
      </ul>
    </div>
  );
};

export default memo(LatestBlocks);
