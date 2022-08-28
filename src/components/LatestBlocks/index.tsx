import * as DateFns from "date-fns";
import flow from "lodash/flow";
import type { FC } from "react";
import { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useBlockLag } from "../../api/block-lag";
import type { LatestBlock } from "../../api/grouped-analysis-1";
import { useGroupedAnalysis1 } from "../../api/grouped-analysis-1";
import type { Unit } from "../../denomination";
import { WEI_PER_GWEI } from "../../eth-units";
import { FeatureFlagsContext } from "../../feature-flags";
import * as Format from "../../format";
import scrollbarStyles from "../../styles/Scrollbar.module.scss";
import { useActiveBreakpoint } from "../../utils/use-active-breakpoint";
import { AmountUnitSpace } from "../Spacing";
import { LabelUnitText, TextRoboto } from "../Texts";
import BodyText from "../TextsNext/BodyText";
import LabelText from "../TextsNext/LabelText";
import { WidgetBackground, WidgetTitle } from "../WidgetSubcomponents";

const maxBlocks = 20;

const formatGas = flow((u: unknown) =>
  typeof u !== "number"
    ? undefined
    : Format.formatZeroDecimals(u / WEI_PER_GWEI),
);

const formatFees = (unit: Unit, fees: unknown, feesUsd: unknown) => {
  if (unit === "eth") {
    return typeof fees === "number"
      ? Format.formatWeiTwoDigit(fees)
      : undefined;
  }
  return typeof feesUsd === "number"
    ? `${Format.formatZeroDecimals(feesUsd)}`
    : undefined;
};

export const formatBlockNumber = (number: unknown) =>
  typeof number === "number"
    ? `#${Format.formatZeroDecimals(number)}`
    : undefined;

const latestBlockFeesSkeletons = new Array(maxBlocks).fill(
  {},
) as Partial<LatestBlock>[];

type Props = { unit: Unit };

const LatestBlocks: FC<Props> = ({ unit }) => {
  const latestBlockFees = useGroupedAnalysis1()?.latestBlockFees;
  const blockLag = useBlockLag()?.blockLag;
  const [timeElapsed, setTimeElapsed] = useState<number>();
  const { md } = useActiveBreakpoint();

  useEffect(() => {
    if (latestBlockFees === undefined) {
      return;
    }

    const latestMinedBlockDate = new Date(latestBlockFees[0].minedAt);

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

  const { previewSkeletons } = useContext(FeatureFlagsContext);

  return (
    <WidgetBackground>
      <div className="flex flex-col gap-y-4">
        <div className="grid grid-cols-3">
          <WidgetTitle>block</WidgetTitle>
          <WidgetTitle className="text-right">gas</WidgetTitle>
          <WidgetTitle className="text-right -mr-1">burn</WidgetTitle>
        </div>
        <ul
          className={`
            flex flex-col gap-y-4
            max-h-[184px] md:max-h-[209px] overflow-y-auto
            pr-1 -mr-3
            ${scrollbarStyles["styled-scrollbar"]}
          `}
        >
          {(latestBlockFees === undefined || previewSkeletons
            ? latestBlockFeesSkeletons
            : latestBlockFees
          ).map(({ number, fees, feesUsd, baseFeePerGas }, index) => (
            <div
              className="transition-opacity duration-700 font-light text-base md:text-lg animate-fade-in"
              key={number || index}
            >
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
                      <Skeleton inline={true} width="7rem" />
                    )}
                  </span>
                  <div className="text-right mr-1">
                    <TextRoboto className="font-roboto text-white">
                      {formatGas(baseFeePerGas) || (
                        <Skeleton
                          className="-mr-0.5 md:mr-0"
                          inline={true}
                          width="1rem"
                        />
                      )}
                    </TextRoboto>
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
                    <TextRoboto className="font-roboto text-white">
                      {formatFees(unit, fees, feesUsd) || (
                        <Skeleton inline={true} width="2rem" />
                      )}
                    </TextRoboto>
                    <AmountUnitSpace />
                    <span className="font-roboto text-blue-spindle font-extralight">
                      {unit === "eth" ? "ETH" : "USD"}
                    </span>
                  </div>
                </li>
              </a>
            </div>
          ))}
        </ul>
        <div className="flex justify-between flex-wrap gap-y-2">
          <div className="flex gap-x-2 items-baseline truncate">
            <LabelText className="text-slateus-400 whitespace-nowrap">
              latest block
            </LabelText>
            <LabelUnitText skeletonWidth="1rem">
              {!previewSkeletons && timeElapsed !== undefined
                ? String(timeElapsed)
                : undefined}
            </LabelUnitText>
            <LabelText className="truncate">seconds</LabelText>
            <LabelText className="text-slateus-400">old</LabelText>
          </div>
          <div className="flex gap-x-2 items-baseline">
            <LabelUnitText skeletonWidth="1rem">
              {!previewSkeletons && blockLag !== undefined
                ? String(blockLag)
                : undefined}
            </LabelUnitText>
            <LabelText className="text-slateus-400">block lag</LabelText>
          </div>
        </div>
        {typeof timeElapsed === "number" && timeElapsed > 1800 ? (
          <BodyText className="text-xs md:text-sm text-red-400">
            node error, busy resyncing...
          </BodyText>
        ) : null}
      </div>
    </WidgetBackground>
  );
};

export default LatestBlocks;
