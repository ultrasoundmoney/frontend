import * as DateFns from "date-fns";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useBaseFeePerGasBarrier } from "../../api/barrier";
import { useBlockLag } from "../../api/block-lag";
import type { LatestBlock } from "../../api/grouped-analysis-1";
import {
  decodeGroupedAnalysis1,
  useGroupedAnalysis1,
} from "../../api/grouped-analysis-1";
import type { Unit } from "../../../denomination";
import type { GweiNumber, WeiNumber } from "../../../eth-units";
import { WEI_PER_GWEI } from "../../../eth-units";
import * as Format from "../../../format";
import scrollbarStyles from "../../../styles/Scrollbar.module.scss";
import LabelText from "../../../components/TextsNext/LabelText";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import SkeletonText from "../../../components/TextsNext/SkeletonText";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../../components/WidgetSubcomponents";
import { LabelUnitText } from "../../../components/TextsNext/LabelUnitText";

const maxBlocks = 20;

const formatGas = (u: unknown) =>
  typeof u !== "number"
    ? undefined
    : Format.formatZeroDecimals(u / WEI_PER_GWEI);

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
  <LabelText className="animate-slow-pulse text-slateus-200">
    waiting for next analysis...
  </LabelText>
);

const LatestBlockAge: FC = () => {
  const groupedAnalysisF = useGroupedAnalysis1();
  const groupedAnalysis1 = decodeGroupedAnalysis1(groupedAnalysisF);
  const [timeElapsed, setTimeElapsed] = useState<number>();

  useEffect(() => {
    if (groupedAnalysis1 === undefined) {
      return;
    }

    const lastBlock = groupedAnalysis1.latestBlockFees[0];
    if (lastBlock === undefined) {
      return;
    }
    const latestMinedBlockDate = new Date(lastBlock?.minedAt);

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

  if (typeof timeElapsed === "number" && timeElapsed > 1800) {
    return <Resyncing />;
  }

  return (
    <div className="flex gap-x-2 items-baseline truncate">
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

type LatestBlockComponentProps = {
  barrier: GweiNumber;
  baseFeePerGas: WeiNumber | undefined;
  fees: number | undefined;
  feesUsd: number | undefined;
  number: number | undefined;
  unit: Unit;
};

const LatestBlockRow: FC<LatestBlockComponentProps> = ({
  barrier,
  baseFeePerGas,
  fees,
  feesUsd,
  number,
  unit,
}) => (
  <div className="transition-opacity duration-700 animate-fade-in">
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
        <QuantifyText color="text-slateus-400" size="text-base md:text-lg">
          <SkeletonText width="7rem">
            {number === undefined
              ? undefined
              : Format.formatZeroDecimals(number)}
          </SkeletonText>
        </QuantifyText>
        <QuantifyText
          className="mr-1 text-right"
          color={
            typeof baseFeePerGas === "number" &&
            baseFeePerGas / WEI_PER_GWEI > barrier
              ? "text-orange-400"
              : "text-blue-400"
          }
          size="text-base md:text-lg"
        >
          <SkeletonText width="1rem">{formatGas(baseFeePerGas)}</SkeletonText>
        </QuantifyText>
        <QuantifyText
          className="text-right"
          unitPostfix={unit.toUpperCase()}
          size="text-base md:text-lg"
        >
          <SkeletonText width="2rem">
            {formatFees(unit, fees, feesUsd)}
          </SkeletonText>
        </QuantifyText>
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
  const barrier = useBaseFeePerGasBarrier().barrier;

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
            -mr-3 flex max-h-[248px]
            flex-col gap-y-4 overflow-y-auto
            pr-1
            ${scrollbarStyles["styled-scrollbar-vertical"]}
            ${scrollbarStyles["styled-scrollbar"]}
          `}
        >
          {(latestBlockFees === undefined
            ? latestBlockFeesSkeletons
            : latestBlockFees
          )
            .slice(0, 6)
            .map(({ number, fees, feesUsd, baseFeePerGas }, index) => (
              <LatestBlockRow
                barrier={barrier}
                baseFeePerGas={baseFeePerGas}
                fees={fees}
                feesUsd={feesUsd}
                key={number || index}
                number={number}
                unit={unit}
              />
            ))}
        </ul>
        <div className="flex flex-wrap gap-y-2 justify-between">
          <LatestBlockAge />
          <div className="flex gap-x-2 items-baseline">
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
