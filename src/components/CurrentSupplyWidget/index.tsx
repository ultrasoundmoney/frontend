import type { FC } from "react";
import { useState } from "react";
import { getDateTimeFromSlot } from "../../beacon-time";
import { ethSupplyFromParts, useEthSupplyParts } from "../../api/eth-supply";
import UpdatedAgo from "../UpdatedAgo";
import { WidgetBackground, WidgetTitle } from "../WidgetSubcomponents";
import WidgetErrorBoundary from "../WidgetErrorBoundary";
import CurrentSupplyTooltip from "./CurrentSupplyTooltip";
import Nerd from "../Nerd";
import PreciseEth from "./PreciseEth";

const EthSupplyWidget: FC = () => {
  const ethSupplyParts = useEthSupplyParts();
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
            <Nerd />
          </div>
          <div
            className={`
              tooltip ${showNerdTooltip ? "block" : "hidden"} w-[calc(100%
              + 96px)] fixed top-1/2
              left-1/2 z-30 -translate-x-1/2
              -translate-y-1/2
              cursor-auto
              whitespace-nowrap
            `}
          >
            <CurrentSupplyTooltip
              ethSupply={ethSupplyParts}
              onClickClose={() => setShowNerdTooltip(false)}
            />
          </div>
          <div className="flex flex-col gap-y-4">
            <PreciseEth>{ethSupply}</PreciseEth>
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
