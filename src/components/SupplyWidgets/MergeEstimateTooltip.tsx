import type { FC } from "react";
import { BodyText, LabelText, QuantifyText, TooltipTitle } from "../Texts";
import * as Format from "../../format";
import roundNerdLarge from "./round-nerd-large.svg";
import type { StaticImageData } from "next/image";
import Image from "next/image";

type Props = {
  className?: string;
  latestBlockDifficulty: string | undefined;
  onClickClose?: () => void;
  totalDifficulty: string | undefined;
  totalTerminalDifficulty: number;
};

const MergeEstimateTooltip: FC<Props> = ({
  className = "",
  latestBlockDifficulty,
  totalDifficulty,
  totalTerminalDifficulty,
}) => (
  <div
    onClick={(e) => {
      e.stopPropagation();
    }}
    // Because this element is rendered as a child of a button it has
    // select-none and cursor-pointer. We force overwrite so text is selectable
    // and changes the cursor.
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
      <BodyText>blocks = (TTD - total difficulty)</BodyText>
      <div className="ml-[69px] md:ml-[77px]">
        <BodyText inline={false}>/ latest block difficulty</BodyText>
      </div>
    </div>
    <LabelText>Total Terminal Difficulty (TTD)</LabelText>
    <QuantifyText amountPostfix="T" className="text-right text-xl">
      {Format.formatZeroDecimals(totalTerminalDifficulty)}
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
