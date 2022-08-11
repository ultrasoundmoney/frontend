import { FC } from "react";
import { useEthSupply } from "../../api/eth-supply";
import { BodyText } from "../Texts";
import { WidgetTitle } from "../WidgetSubcomponents";
import PreciseEth from "./PreciseEth";

const EthSupplyTooltip: FC<{ onClickClose: () => void }> = ({
  onClickClose,
}) => {
  const ethSupply = useEthSupply();

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={`
        relative
        flex flex-col gap-y-4
        bg-blue-tangaroa p-8 rounded-lg
        border border-blue-shipcove
        w-[22rem]
      `}
    >
      <img
        alt="a close button, circular with an x in the middle"
        className="absolute w-6 right-5 top-5 hover:brightness-90 active:brightness-110 cursor-pointer select-none"
        onClick={onClickClose}
        src="/close.svg"
      />
      <img
        alt=""
        className="w-20 h-20 mx-auto rounded-full select-none"
        src={"/round-nerd-large.svg"}
      />
      <BodyText className="font-semibold">ETH supply breakdown</BodyText>
      <WidgetTitle>formula</WidgetTitle>
      <div className="flex flex-col">
        <BodyText>supply = EVM balances +</BodyText>
        <div className="ml-[69px] md:ml-[77px]">
          <BodyText inline={false}>beacon balances -</BodyText>
          <BodyText>beacon chain deposits</BodyText>
        </div>
      </div>
      <WidgetTitle>EVM balances</WidgetTitle>
      <PreciseEth justify="justify-end">
        {ethSupply?.executionBalancesSum.balancesSum}
      </PreciseEth>
      <WidgetTitle>beacon chain balances</WidgetTitle>
      <PreciseEth justify="justify-end">
        {ethSupply?.beaconBalancesSum.balancesSum}
      </PreciseEth>
      <WidgetTitle>beacon chain deposits</WidgetTitle>
      <PreciseEth justify="justify-end">
        {ethSupply?.beaconDepositsSum.depositsSum}
      </PreciseEth>
    </div>
  );
};

export default EthSupplyTooltip;
