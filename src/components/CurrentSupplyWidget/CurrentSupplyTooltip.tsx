import type { FC, ReactNode } from "react";
import type { SupplyParts } from "../../api/eth-supply";
import { BaseText, TooltipTitle } from "../Texts";
import LabelText from "../TextsNext/LabelText";
import PreciseEth from "./PreciseEth";

const FormulaText: FC<{
  className?: string;
  inline?: boolean;
  children: ReactNode;
}> = ({ className, inline, children }) => (
  <BaseText
    font="font-inter"
    className={className}
    size="text-base md:text-lg"
    inline={inline}
  >
    {children}
  </BaseText>
);

const CurrentSupplyTooltip: FC<{
  ethSupply: SupplyParts;
  onClickClose: () => void;
}> = ({ ethSupply, onClickClose }) => (
  <div
    className={`
      relative
      flex w-[22rem] flex-col
      gap-y-4 rounded-lg border
      border-slateus-400 bg-slateus-700
      p-8
    `}
  >
    <img
      alt="a close button, circular with an x in the middle"
      className="absolute right-5 top-5 w-6 cursor-pointer select-none hover:brightness-90 active:brightness-110"
      onClick={onClickClose}
      src="/close.svg"
    />
    <img
      alt=""
      className="mx-auto h-20 w-20 select-none rounded-full"
      src={"/round-nerd-large.svg"}
    />
    <TooltipTitle>ETH supply breakdown</TooltipTitle>
    <LabelText>formula</LabelText>
    <div className="flex flex-col">
      <FormulaText>supply = EVM balances +</FormulaText>
      <div className="ml-[69px] md:ml-[77px]">
        <FormulaText inline={false}>beacon balances -</FormulaText>
        <FormulaText>beacon chain deposits</FormulaText>
      </div>
    </div>
    <LabelText>EVM balances</LabelText>
    <PreciseEth
      amount={ethSupply.executionBalancesSum.balancesSum}
      justify="justify-end"
    />
    <LabelText>beacon chain balances</LabelText>
    <PreciseEth
      amount={ethSupply.beaconBalancesSum.balancesSum}
      justify="justify-end"
    />
    <LabelText>beacon chain deposits</LabelText>
    <PreciseEth
      amount={ethSupply.beaconDepositsSum.depositsSum}
      justify="justify-end"
    />
  </div>
);

export default CurrentSupplyTooltip;
