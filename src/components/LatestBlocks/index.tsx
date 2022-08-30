import * as DateFns from "date-fns";
import flow from "lodash/flow";
import type { FC } from "react";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useBlockLag } from "../../api/block-lag";
import type {
  GroupedAnalysis1,
  LatestBlock,
} from "../../api/grouped-analysis-1";
import type { Unit } from "../../denomination";
import { WEI_PER_GWEI } from "../../eth-units";
import * as Format from "../../format";
import scrollbarStyles from "../../styles/Scrollbar.module.scss";
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

const Resyncing = () => (
  <BodyText className="text-xs md:text-sm text-red-400 animate-slow-pulse">
    node error, busy resyncing...
  </BodyText>
);

const LatestBlockAge: FC<{ groupedAnalysis1: GroupedAnalysis1 }> = ({
  groupedAnalysis1,
}) => {
  const [timeElapsed, setTimeElapsed] = useState<number>();

  useEffect(() => {
    if (groupedAnalysis1 === undefined) {
      return;
    }

    const latestMinedBlockDate = new Date(
      groupedAnalysis1.latestBlockFees[0].minedAt,
    );

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
  }, [groupedAnalysis1]);

  return typeof timeElapsed === "number" && timeElapsed > 1800 ? (
    <Resyncing />
  ) : (
    <div className="flex gap-x-2 items-baseline truncate">
      <LabelText className="text-slateus-400 whitespace-nowrap">
        latest block
      </LabelText>
      <LabelUnitText skeletonWidth="1rem">
        {timeElapsed !== undefined ? String(timeElapsed) : undefined}
      </LabelUnitText>
      <LabelText className="truncate">seconds</LabelText>
      <LabelText className="text-slateus-400">old</LabelText>
    </div>
  );
};

const LatestBlockComponent: FC<{
  number: number | undefined;
  baseFeePerGas: number | undefined;
  fees: number | undefined;
  feesUsd: number | undefined;
  unit: Unit;
}> = ({ number, baseFeePerGas, fees, feesUsd, unit }) => (
  <div className="transition-opacity duration-700 font-light text-base md:text-lg animate-fade-in">
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
          {formatBlockNumber(number) || <Skeleton inline={true} width="7rem" />}
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
          <div className="hidden md:inline">
            <span className="font-inter">&thinsp;</span>
            <span className="font-roboto text-blue-spindle font-extralight">
              Gwei
            </span>
          </div>
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
);

type Props = { groupedAnalysis1: GroupedAnalysis1; unit: Unit };

const LatestBlocks: FC<Props> = ({ groupedAnalysis1, unit }) => {
  const latestBlockFees = groupedAnalysis1.latestBlockFees;
  const blockLag = useBlockLag()?.blockLag;

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
            max-h-[184px] md:max-h-[214px] overflow-y-auto
            pr-1 -mr-3
            ${scrollbarStyles["styled-scrollbar"]}
          `}
        >
          {(latestBlockFees === undefined
            ? latestBlockFeesSkeletons
            : latestBlockFees
          ).map(({ number, fees, feesUsd, baseFeePerGas }, index) => (
            <LatestBlockComponent
              key={number || index}
              number={number}
              fees={fees}
              feesUsd={feesUsd}
              baseFeePerGas={baseFeePerGas}
              unit={unit}
            />
          ))}
        </ul>
        <div className="flex justify-between flex-wrap gap-y-2">
          <LatestBlockAge groupedAnalysis1={groupedAnalysis1} />
          <div className="flex gap-x-2 items-baseline">
            <LabelUnitText skeletonWidth="1rem">
              {blockLag !== undefined ? String(blockLag) : undefined}
            </LabelUnitText>
            <LabelText className="text-slateus-400">block lag</LabelText>
          </div>
        </div>
      </div>
    </WidgetBackground>
  );
};

export default LatestBlocks;
