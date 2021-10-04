import dayjs from "dayjs";
import React, { memo, FC, useState, useEffect, useCallback } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useFeeData } from "../../api";
import {
  formatNoDigit,
  formatWeiTwoDigit,
  formatZeroDigit,
} from "../../format";
import { weiToGwei } from "../../utils/metric-utils";

type LatestBlocks = {
  number: number;
  fees: number;
  baseFeePerGas: number;
}[];

const LatestBlocks: FC = () => {
  const { latestBlockFees } = useFeeData();
  const [timeElapsed, setTimeElapsed] = useState(0);

  const getTimeElapsed = useCallback((timeStamp: string): number => {
    return dayjs(Date.now()).diff(timeStamp, "s");
  }, []);

  useEffect(() => {
    setTimeElapsed(getTimeElapsed(latestBlockFees[0]?.minedAt));

    const intervalId = window.setInterval(() => {
      setTimeElapsed(getTimeElapsed(latestBlockFees[0].minedAt));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [getTimeElapsed, latestBlockFees]);

  return (
    <div className="bg-blue-tangaroa w-full rounded-lg p-8 text-white">
      <div className="flex justify-between pb-2 lg:pb-6 xl:pb-2 font-inter text-blue-spindle ">
        <span className="w-5/12 flex flex-col">
          <span className="uppercase">block&nbsp;</span>
          <span className="text-blue-manatee font-normal text-sm fadein-animation">
            ({timeElapsed}s since last block)
          </span>
        </span>
        <span className="w-3/12 uppercase">gas</span>
        <span className="w-4/12 text-right uppercase">burn</span>
      </div>
      <ul>
        {latestBlockFees !== undefined && latestBlockFees.length === 0 ? (
          <p className="font-roboto text-white md:text-4xl">loading...</p>
        ) : (
          <TransitionGroup
            component={null}
            appear={true}
            enter={true}
            exit={false}
          >
            {latestBlockFees !== undefined &&
              latestBlockFees
                .sort((a, b) => b.number - a.number)
                .slice(0, 7)
                .map(({ number, fees, baseFeePerGas }) => (
                  <CSSTransition
                    classNames="fee-block"
                    timeout={2000}
                    key={number}
                  >
                    <div className="fee-block text-base md:text-lg">
                      <a
                        href={`https://etherscan.io/block/${number}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <li className="flex justify-between mt-3 hover:opacity-60 link-animation">
                          <p className="w-5/12">
                            <span className="font-roboto">
                              {formatNoDigit(number)}
                            </span>
                          </p>
                          <p className="w-3/12">
                            <span className="font-roboto">
                              {formatZeroDigit(weiToGwei(baseFeePerGas))}
                            </span>{" "}
                            <span className="text-blue-spindle font-extralight">
                              Gwei
                            </span>
                          </p>
                          <p className="w-4/12 text-right">
                            <span className="font-roboto">
                              {formatWeiTwoDigit(fees)}{" "}
                            </span>
                            <span className="text-blue-spindle font-extralight">
                              ETH
                            </span>
                          </p>
                        </li>
                      </a>
                    </div>
                  </CSSTransition>
                ))}
          </TransitionGroup>
        )}
      </ul>
    </div>
  );
};

export default memo(LatestBlocks);
