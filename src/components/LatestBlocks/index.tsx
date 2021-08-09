import React, { memo, FC, useRef, useMemo } from "react";
import useWebSocket from "react-use-websocket";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import _ from "lodash";
import { weiToEth } from "../../utils/metric-utils";
import useSWR from "swr";

const formatter = Intl.NumberFormat("en", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const formatFee = (fee: number) => formatter.format(weiToEth(fee));

type LatestBlocks = {
  fees: number;
  number: number;
}[];

const useLatestBlocks = () => {
  const { data, error } = useSWR<LatestBlocks>(
    `https://api.ultrasound.money/fees/latest-blocks`,
    {
      refreshInterval: 8000,
    }
  );

  return {
    latestBlocks: data,
    isLoading: !error && !data,
    isError: error,
  };
};

const LatestBlocks: FC = () => {
  const { latestBlocks } = useLatestBlocks();
  return (
    <div className="bg-blue-tangaroa w-full rounded-lg p-8">
      <div className="flex justify-between pb-2">
        <span className="font-inter text-blue-shipcove text-xl float-left">
          latest blocks
        </span>
        <span className="font-inter text-blue-shipcove text-xl float-right">
          burn
        </span>
      </div>
      <ul>
        {latestBlocks !== undefined && latestBlocks.length === 0 ? (
          <p className="font-roboto text-white md:text-4xl">loading...</p>
        ) : (
          <TransitionGroup
            component={null}
            appear={true}
            enter={false}
            exit={false}
          >
            {latestBlocks !== undefined &&
              latestBlocks
                .reverse()
                .slice(0, 7)
                .map(({ number, fees }) => (
                  <CSSTransition
                    classNames="fee-block"
                    timeout={500}
                    key={number}
                  >
                    <li className="flex justify-between mt-4 fee-block">
                      <p className="text-white">
                        block{" "}
                        <span className="font-roboto">
                          #{new Intl.NumberFormat().format(number)}
                        </span>
                      </p>
                      <p className="text-white text-base md:text-lg">
                        <span className="font-roboto">{formatFee(fees)} </span>
                        <span className="text-blue-spindle font-extralight">
                          ETH
                        </span>
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
