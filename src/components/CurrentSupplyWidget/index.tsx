import type { FC } from "react";
import { useState } from "react";
import { ethSupplyFromParts, useSupplyParts } from "../../api/eth-supply";
import { dateTimeFromSlot } from "../../beacon-time";
import Nerd from "../Nerd";
import HoverTooltip from "../HoverTooltip";
import UpdatedAgo from "../UpdatedAgo";
import WidgetErrorBoundary from "../WidgetErrorBoundary";
import { WidgetBackground, WidgetTitle } from "../WidgetSubcomponents";
import CurrentSupplyTooltip from "./CurrentSupplyTooltip";
import PreciseEth from "./PreciseEth";

const EthSupplyWidget: FC = () => {
  const ethSupplyParts = useSupplyParts();
  const ethSupply = ethSupplyFromParts(ethSupplyParts);
  const [showNerdTooltip, setShowNerdTooltip] = useState(false);

  return (
    <WidgetErrorBoundary title="current supply">
      <WidgetBackground className="flex">
        <div className="relative flex flex-col gap-y-4">
          <div
            className={`
                flex cursor-pointer
                items-center
                [&_.gray-nerd]:hover:opacity-0
                [&_.color-nerd]:active:brightness-75
            `}
            onClick={() => setShowNerdTooltip(true)}
          >
            <WidgetTitle>current supply</WidgetTitle>
            <HoverTooltip
              customAlign="-left-16"
              text="learn how the current supply is calculated"
            >
              <Nerd />
            </HoverTooltip>
          </div>
          <div
            className={`
              tooltip
              w-[calc(100% + 96px)] fixed top-1/2
              left-1/2 z-30 -translate-x-1/2 -translate-y-1/2
              cursor-auto
              whitespace-nowrap
              ${showNerdTooltip ? "block" : "hidden"}
            `}
          >
            <CurrentSupplyTooltip
              ethSupply={ethSupplyParts}
              onClickClose={() => setShowNerdTooltip(false)}
            />
          </div>
          <div className="flex flex-col gap-y-4 transition-colors">
            <PreciseEth amount={ethSupply} />
            <UpdatedAgo
              updatedAt={dateTimeFromSlot(
                ethSupplyParts.beaconDepositsSum.slot,
              ).toISOString()}
            />
          </div>
        </div>
        <div
          className={`
            fixed top-0 left-0 bottom-0 right-0
            z-20 flex items-center
            justify-center
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
