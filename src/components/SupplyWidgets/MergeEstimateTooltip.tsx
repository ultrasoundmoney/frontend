import type { FC } from "react";
import { BodyText, LabelText, QuantifyText, TooltipTitle } from "../Texts";
import * as Format from "../../format";
import roundNerdLarge from "./round-nerd-large.svg";
import type { StaticImageData } from "next/image";
import Image from "next/image";

const TOTAL_TERMINAL_DIFFICULTY = 58750000000;

type Props = {
  className?: string;
  fancyFormulaFormatting: boolean;
  latestBlockDifficulty: string | undefined;
  onClickClose?: () => void;
  totalDifficulty: string | undefined;
};

const MergeEstimateTooltip: FC<Props> = ({
  className = "",
  latestBlockDifficulty,
  totalDifficulty,
}) => (
  <div
    onClick={(e) => {
      e.stopPropagation();
    }}
    // Somehow this absolute element has lost selectability and cursor-text, we hack it back in.
    className={`
      relative
      flex flex-col gap-y-4
      bg-blue-tangaroa p-8 rounded-lg
      border border-blue-shipcove
      text-left
      select-text
      [&>*]:cursor-text
      ${className}
    `}
  >
    <Image
      alt=""
      className="w-20 h-20 mx-auto rounded-full select-none [&]:cursor-default"
      src={roundNerdLarge as StaticImageData}
      height={80}
      width={80}
    />
    <TooltipTitle>blocks til merge (estimate)</TooltipTitle>
    <LabelText>formula</LabelText>
    <div className="flex flex-col">
      <BodyText>blocks = (TTD - Total Difficulty)</BodyText>
      <div className="ml-[69px] md:ml-[77px]">
        <BodyText inline={false}>/ latest block difficulty</BodyText>
      </div>
    </div>
    <LabelText>Total Terminal Difficulty (TTD)</LabelText>
    <QuantifyText amountPostfix="T" className="text-right text-xl">
      {Format.formatZeroDecimals(TOTAL_TERMINAL_DIFFICULTY)}
    </QuantifyText>
    <LabelText>total difficulty</LabelText>
    <QuantifyText amountPostfix="T" className="text-right text-xl">
      {totalDifficulty !== undefined
        ? Format.formatZeroDecimals(Number(totalDifficulty) / 1e12)
        : undefined}
    </QuantifyText>
    <LabelText>latest block difficulty</LabelText>
    <QuantifyText amountPostfix="T" className="text-right text-xl">
      {latestBlockDifficulty !== undefined
        ? Format.formatZeroDecimals(Number(latestBlockDifficulty) / 1e12)
        : undefined}
    </QuantifyText>
  </div>
);

export default MergeEstimateTooltip;
