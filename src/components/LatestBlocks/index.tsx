import { DateTime } from "luxon";
import React, { memo, FC, useState, useEffect, useCallback } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useFeeData } from "../../api";
import {
  formatNoDigit,
  formatOneDigit,
  formatWeiTwoDigit,
  formatZeroDigit,
} from "../../format";
import { weiToGwei } from "../../utils/metric-utils";
import { Unit } from "../ComingSoon";
import { WidgetBackground } from "../WidgetBits";

const LatestBlocks: FC<{ unit: Unit }> = ({ unit }) => {
  const { latestBlockFees } = useFeeData();
  const [timeElapsed, setTimeElapsed] = useState(0);

  const getTimeElapsed = useCallback((dt: Date): number => {
    const secondsDiff = DateTime.fromJSDate(dt)
      .diffNow("seconds")
      .as("seconds");
    return Math.round(secondsDiff * -1);
  }, []);

  useEffect(() => {
    const latestMinedBlockDate = new Date(latestBlockFees[0]?.minedAt);

    if (latestMinedBlockDate === undefined) {
      return;
    }

    setTimeElapsed(getTimeElapsed(latestMinedBlockDate));

    const intervalId = window.setInterval(() => {
      setTimeElapsed(getTimeElapsed(latestMinedBlockDate));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [getTimeElapsed, latestBlockFees]);

  return (
    <WidgetBackground>
      <div className="pb-4 text-white relative">
        <div className="flex justify-between mb-4 lg:mb-6 xl:mb-2 font-inter text-blue-spindle ">
          <span className="w-5/12 uppercase">block</span>
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
                  .map(({ number, fees, feesUsd, baseFeePerGas }) => (
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
                          <li className="flex justify-between mt-4 hover:opacity-60 link-animation">
                            <span className="w-5/12 font-roboto text-white">
                              {formatNoDigit(number)}
                            </span>
                            <div className="w-3/12">
                              <span className="font-roboto text-white">
                                {formatZeroDigit(weiToGwei(baseFeePerGas))}
                              </span>{" "}
                              <span className="text-blue-spindle font-extralight">
                                Gwei
                              </span>
                            </div>
                            <div className="w-4/12 text-right">
                              <span className="font-roboto text-white">
                                {unit === "eth"
                                  ? formatWeiTwoDigit(fees)
                                  : `${formatOneDigit(feesUsd / 1000)}K`}
                              </span>
                              <span className="text-blue-spindle font-extralight">
                                {unit === "eth" ? " ETH" : " USD"}
                              </span>
                            </div>
                          </li>
                        </a>
                      </div>
                    </CSSTransition>
                  ))}
            </TransitionGroup>
          )}
        </ul>
        <span className="text-blue-spindle text-xs md:text-sm font-extralight absolute -bottom-4 left-0">
          latest block{" "}
          <span className="font-roboto text-white font-light">
            {timeElapsed}s
          </span>{" "}
          old
        </span>
      </div>
    </WidgetBackground>
  );
};

export default memo(LatestBlocks);
