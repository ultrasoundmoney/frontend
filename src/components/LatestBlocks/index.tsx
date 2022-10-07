import * as DateFns from "date-fns";
import flow from "lodash/flow";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useBlockLag } from "../../api/block-lag";
import type { LatestBlock } from "../../api/grouped-analysis-1";
import {
  decodeGroupedAnalysis1,
  useGroupedAnalysis1,
} from "../../api/grouped-analysis-1";
import type { Unit } from "../../denomination";
import { WEI_PER_GWEI } from "../../eth-units";
import * as Format from "../../format";
import scrollbarStyles from "../../styles/Scrollbar.module.scss";
import { AmountUnitSpace } from "../Spacing";
import { BaseText, LabelUnitText } from "../Texts";
import BodyTextV2 from "../TextsNext/BodyTextV2";
import LabelText from "../TextsNext/LabelText";
import SkeletonText from "../TextsNext/SkeletonText";
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

const latestBlockFeesSkeletons = new Array(maxBlocks).fill(
  {},
) as Partial<LatestBlock>[];

const Resyncing = () => (
  <BodyTextV2 className="animate-slow-pulse text-red-400 md:text-sm">
    node error, busy resyncing...
  </BodyTextV2>
);

const LatestBlockAge: FC = () => {
  const groupedAnalysisF = useGroupedAnalysis1();
  const groupedAnalysis1 = decodeGroupedAnalysis1(groupedAnalysisF);
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
    <div className="flex items-baseline gap-x-2 truncate">
      <LabelText color="text-slateus-400" className="whitespace-nowrap">
        latest block
      </LabelText>
      <LabelUnitText>
        <SkeletonText width="1rem">
          {timeElapsed !== undefined ? String(timeElapsed) : undefined}
        </SkeletonText>
      </LabelUnitText>
      <LabelText className="truncate">seconds</LabelText>
      <LabelText color="text-slateus-400">old</LabelText>
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
  <div className="animate-fade-in text-base font-light transition-opacity duration-700 md:text-lg">
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
          <SkeletonText width="7rem">
            {Format.formatBlockNumber(number)}
          </SkeletonText>
        </span>
        <div className="mr-1 text-right">
          <BaseText font="font-roboto">
            <SkeletonText width="1rem">{formatGas(baseFeePerGas)}</SkeletonText>
          </BaseText>
          <div className="hidden md:inline">
            <span className="font-inter">&thinsp;</span>
            <span className="font-roboto font-extralight text-blue-spindle">
              Gwei
            </span>
          </div>
        </div>
        <div className="text-right">
          <BaseText font="font-roboto">
            <SkeletonText width="2rem">
              {formatFees(unit, fees, feesUsd)}
            </SkeletonText>
          </BaseText>
          <AmountUnitSpace />
          <span className="font-roboto font-extralight text-blue-spindle">
            {unit === "eth" ? "ETH" : "USD"}
          </span>
        </div>
      </li>
    </a>
  </div>
);

type Props = { unit: Unit };

const LatestBlocks: FC<Props> = ({ unit }) => {
  const groupedAnalysis1F = useGroupedAnalysis1();
  const groupedAnalysis1 = decodeGroupedAnalysis1(groupedAnalysis1F);
  const latestBlockFees = groupedAnalysis1?.latestBlockFees;
  const blockLag = useBlockLag()?.blockLag;

  return (
    <WidgetBackground>
      <div className="flex flex-col gap-y-4">
        <div className="grid grid-cols-3">
          <WidgetTitle>block</WidgetTitle>
          <WidgetTitle className="text-right">gas</WidgetTitle>
          <WidgetTitle className="-mr-1 text-right">burn</WidgetTitle>
        </div>
        <ul
          className={`
            -mr-3 flex max-h-[184px]
            flex-col gap-y-4 overflow-y-auto
            pr-1 md:max-h-[214px]
            ${scrollbarStyles["styled-scrollbar-vertical"]}
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
        <div className="flex flex-wrap justify-between gap-y-2">
          <LatestBlockAge />
          <div className="flex items-baseline gap-x-2">
            <LabelUnitText>
              <SkeletonText width="0.5rem">{blockLag}</SkeletonText>
            </LabelUnitText>
            <LabelText color="text-slateus-400">block lag</LabelText>
          </div>
        </div>
      </div>
    </WidgetBackground>
  );
};

export default LatestBlocks;
