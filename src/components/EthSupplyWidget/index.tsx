import JSBI from "jsbi";
import type { FC } from "react";
import { useState } from "react";
import type { EthSupply } from "../../api/eth-supply";
import { getDateTimeFromSlot } from "../../beacon-time";
import UpdatedAgo from "../UpdatedAgo";
import { WidgetBackground, WidgetTitle } from "../WidgetSubcomponents";
import WidgetErrorBoundary from "../WidgetErrorBoundary";
import EthSupplyTooltip from "./EthSupplyTooltip";
import Nerd from "../Nerd";
import PreciseEth from "./PreciseEth";

type Props = { ethSupply: EthSupply };

const EthSupplyWidget: FC<Props> = ({ ethSupply }) => {
  const [showNerdTooltip, setShowNerdTooltip] = useState(false);

  const ethSupplySum = JSBI.subtract(
    JSBI.add(
      ethSupply.executionBalancesSum.balancesSum,
      ethSupply.beaconBalancesSum.balancesSum,
    ),
    ethSupply.beaconDepositsSum.depositsSum,
  );

  return (
    <WidgetErrorBoundary title="eth supply">
      <WidgetBackground className="flex">
        <div className="relative flex flex-col gap-y-4">
          <div
            className={`
                flex items-center
                cursor-pointer
                [&_.gray-nerd]:hover:opacity-0
                [&_.color-nerd]:active:brightness-75
            `}
            onClick={() => setShowNerdTooltip(true)}
          >
            <WidgetTitle>eth supply</WidgetTitle>
            <Nerd />
          </div>
          <div
            className={`
              tooltip ${showNerdTooltip ? "block" : "hidden"} fixed
              top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              w-[calc(100% + 96px)]
              whitespace-nowrap
              cursor-auto
              z-30
            `}
          >
            <EthSupplyTooltip
              ethSupply={ethSupply}
              onClickClose={() => setShowNerdTooltip(false)}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <PreciseEth>{ethSupplySum}</PreciseEth>
            <UpdatedAgo
              updatedAt={getDateTimeFromSlot(
                ethSupply.beaconDepositsSum.slot,
              ).toISOString()}
            />
          </div>
        </div>
        <div
          className={`
            fixed top-0 left-0 bottom-0 right-0
            flex justify-center items-center
            z-20
            bg-slateus-700/60
            backdrop-blur-sm
            ${showNerdTooltip ? "" : "hidden"}
          `}
          onClick={() => setShowNerdTooltip(false)}
        ></div>
      </WidgetBackground>
    </WidgetErrorBoundary>
  );
};

export default EthSupplyWidget;
