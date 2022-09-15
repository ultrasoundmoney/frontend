import type { FC } from "react";
import { TooltipTitle } from "../Texts";
import * as Format from "../../format";
import roundNerdLarge from "../../assets/round-nerd-large.svg";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import closeSvg from "../../assets/close.svg";
import LabelText from "../TextsNext/LabelText";
import BodyText from "../TextsNext/BodyText";
import QuantifyText from "../TextsNext/QuantifyText";

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
  onClickClose,
  totalDifficulty,
  totalTerminalDifficulty,
}) => (
  <div
    onClick={(e) => {
      e.stopPropagation();
    }}
    className={`
      relative
      flex flex-col gap-y-4
      bg-blue-tangaroa p-8 rounded-lg
      border border-blue-shipcove
      text-left
      ${className}
    `}
  >
    <button
      className={`
        flex w-6
        active:brightness-90 hover:brightness-110
        select-none self-end
      `}
    >
      <Image
        alt="a close button, circular with an x in the middle"
        draggable={false}
        height={24}
        layout="fixed"
        onClick={onClickClose}
        src={closeSvg as StaticImageData}
        width={24}
      />
    </button>
    <Image
      alt="a nerd emoji symbolizing a knowledge deep-dive"
      className="w-20 h-20 mx-auto rounded-full select-none"
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
    <LabelText>Terminal Total Difficulty (TTD)</LabelText>
    <QuantifyText amountPostfix="T" className="text-right text-xl">
      {Format.formatZeroDecimals(totalTerminalDifficulty / 1e12)}
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
