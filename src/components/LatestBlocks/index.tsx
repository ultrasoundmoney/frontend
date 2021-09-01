import React, { memo, FC } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useFeeData } from "../../api";
import { formatNoDigit, formatWeiTwoDigit } from "../../format";

type LatestBlocks = {
  fees: number;
  number: number;
}[];

const LatestBlocks: FC = () => {
  const { latestBlockFees } = useFeeData();
  return (
    <div className="bg-blue-tangaroa w-full rounded-lg p-8">
      <div className="flex justify-between pb-2">
        <span className="font-inter text-blue-spindle uppercase text-md float-left">
          latest blocks
        </span>
        <span className="font-inter uppercase text-blue-spindle text-md float-right">
          burn
        </span>
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
                .map(({ number, fees }) => (
                  <CSSTransition
                    classNames="fee-block"
                    timeout={2000}
                    key={number}
                  >
                    <a
                      href={`https://etherscan.io/block/${number}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <li className="flex justify-between mt-3 fee-block hover:opacity-60 link-animation">
                        <p className="text-white">
                          block{" "}
                          <span className="font-roboto">
                            #{formatNoDigit(number)}
                          </span>
                        </p>
                        <p className="text-white text-base md:text-lg">
                          <span className="font-roboto">
                            {formatWeiTwoDigit(fees)}{" "}
                          </span>
                          <span className="text-blue-spindle font-extralight">
                            ETH
                          </span>
                        </p>
                      </li>
                    </a>
                  </CSSTransition>
                ))}
          </TransitionGroup>
        )}
      </ul>
    </div>
  );
};

export default memo(LatestBlocks);
