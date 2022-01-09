import { DateTime } from "luxon";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useFeeData } from "../../api";
import * as Format from "../../format";
import { useActiveBreakpoint } from "../../utils/use-active-breakpoint";
import { Unit } from "../ComingSoon/CurrencyControl";
import { AmountUnitSpace } from "../Spacing";
import { WidgetBackground } from "../WidgetBits";

type Props = { unit: Unit };

const LatestBlocks: FC<Props> = ({ unit }) => {
  const { latestBlockFees } = useFeeData();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const { md } = useActiveBreakpoint();

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
      <div className="flex flex-col gap-y-4">
        <div className="grid grid-cols-3">
          <span className="font-inter text-blue-spindle uppercase">block</span>
          <span className="font-inter text-blue-spindle text-right uppercase">
            gas
          </span>
          <span className="font-inter text-blue-spindle text-right uppercase">
            burn
          </span>
        </div>
        <ul className="flex flex-col gap-y-4">
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
                          <li className="grid grid-cols-3 hover:opacity-60 link-animation">
                            <span className="font-roboto text-white">
                              {Format.formatNoDigit(number)}
                            </span>
                            <div className="text-right">
                              <span className="font-roboto text-white">
                                {Format.formatZeroDigit(
                                  Format.gweiFromWei(baseFeePerGas)
                                )}
                              </span>
                              {md && (
                                <>
                                  <span className="font-inter">&thinsp;</span>
                                  <span className="font-roboto text-blue-spindle font-extralight">
                                    Gwei
                                  </span>
                                </>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="font-roboto text-white">
                                {unit === "eth"
                                  ? Format.formatWeiTwoDigit(fees)
                                  : `${Format.formatOneDigit(feesUsd / 1000)}K`}
                              </span>
                              <AmountUnitSpace />
                              <span className="font-roboto text-blue-spindle font-extralight">
                                {unit === "eth" ? "ETH" : "USD"}
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
        {/* spaces need to stay on the font-inter element to keep them consistent */}
        <span className="text-blue-spindle text-xs md:text-sm font-extralight">
          {"latest block "}
          <span className="font-roboto text-white font-light">
            {timeElapsed}s
          </span>
          {" old"}
        </span>
      </div>
    </WidgetBackground>
  );
};

export default memo(LatestBlocks);
