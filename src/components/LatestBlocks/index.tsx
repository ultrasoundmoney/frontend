import * as DateFns from "date-fns";
import { flow } from "lodash";
import React, { FC, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { TransitionGroup } from "react-transition-group";
import { LatestBlock, useGroupedStats1 } from "../../api/grouped-stats-1";
import { Unit } from "../../denomination";
import * as Format from "../../format";
import { NEA, O, OAlt, pipe } from "../../fp";
import { useActiveBreakpoint } from "../../utils/use-active-breakpoint";
import CSSTransition from "../CSSTransition";
import { AmountUnitSpace } from "../Spacing";
import { WidgetBackground } from "../widget-subcomponents";
import styles from "./LatestBlocks.module.scss";

const maxBlocks = 7;

const formatGas = flow(
  OAlt.numberFromUnknown,
  O.map(Format.gweiFromWei),
  O.map(Format.formatZeroDigit),
  O.toUndefined,
);

const formatFees = (unit: Unit, fees: unknown, feesUsd: unknown) =>
  unit === "eth"
    ? pipe(
        fees,
        OAlt.numberFromUnknown,
        O.map(Format.formatWeiTwoDigit),
        O.toUndefined,
      )
    : pipe(
        feesUsd,
        OAlt.numberFromUnknown,
        O.map((feesUsd) => `${Format.formatOneDigit(feesUsd / 1000)}K`),
        O.toUndefined,
      );

const formatTimeElapsed = flow(
  O.fromNullable,
  O.map((num: number) => `${num}s`),
  O.toUndefined,
);

export const formatBlockNumber = (number: unknown) =>
  pipe(
    number,
    O.fromPredicate(
      (unknown): unknown is number => typeof unknown === "number",
    ),
    O.map(Format.formatNoDigit),
    O.map((str) => `#${str}`),
    O.toUndefined,
  );

const latestBlockFeesSkeletons = new Array(maxBlocks).fill(
  {},
) as Partial<LatestBlock>[];

type Props = { unit: Unit };

const LatestBlocks: FC<Props> = ({ unit }) => {
  const latestBlockFees = useGroupedStats1()?.latestBlockFees;
  const [timeElapsed, setTimeElapsed] = useState<number>();
  const { md } = useActiveBreakpoint();

  useEffect(() => {
    if (latestBlockFees === undefined) {
      return;
    }

    const latestMinedBlockDate = new Date(NEA.head(latestBlockFees).minedAt);

    setTimeElapsed(
      DateFns.differenceInSeconds(new Date(), latestMinedBlockDate),
    );

    const intervalId = window.setInterval(() => {
      setTimeElapsed(
        DateFns.differenceInSeconds(new Date(), latestMinedBlockDate),
      );
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [latestBlockFees]);

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
          <TransitionGroup
            component={null}
            appear={true}
            enter={true}
            exit={false}
          >
            {(latestBlockFees || latestBlockFeesSkeletons).map(
              ({ number, fees, feesUsd, baseFeePerGas }, index) => (
                <CSSTransition
                  classNames={{ ...styles }}
                  timeout={2000}
                  key={number || index}
                >
                  <div className="transition-opacity duration-700 font-light text-base md:text-lg">
                    <a
                      href={
                        number === undefined
                          ? undefined
                          : `https://etherscan.io/block/${number}`
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      <li className="grid grid-cols-3 hover:opacity-60">
                        <span className="font-roboto text-white">
                          {formatBlockNumber(number) || (
                            <Skeleton inline={true} width="8rem" />
                          )}
                        </span>
                        <div className="text-right">
                          <span className="font-roboto text-white">
                            {formatGas(baseFeePerGas) || (
                              <Skeleton inline={true} width="3rem" />
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
                            {formatFees(unit, fees, feesUsd) || (
                              <Skeleton inline={true} width="3rem" />
                            )}
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
              ),
            )}
          </TransitionGroup>
        </ul>
        {/* spaces need to stay on the font-inter element to keep them consistent */}
        <span className="font-inter text-blue-spindle text-xs md:text-sm font-extralight">
          {"latest block "}
          <span className="font-roboto text-white font-light">
            {formatTimeElapsed(timeElapsed) || (
              <Skeleton inline={true} width="2rem" />
            )}
          </span>
          {" old"}
        </span>
      </div>
    </WidgetBackground>
  );
};

export default LatestBlocks;
