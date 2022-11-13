import type { FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ethSupplyFromParts,
  impreciseEthSupplyFromParts,
  useEthSupplyParts,
} from "../../api/eth-supply";
import { dateTimeFromSlot } from "../../beacon-time";
import Nerd from "../Nerd";
import UpdatedAgo from "../UpdatedAgo";
import WidgetErrorBoundary from "../WidgetErrorBoundary";
import { WidgetBackground, WidgetTitle } from "../WidgetSubcomponents";
import CurrentSupplyTooltip from "./CurrentSupplyTooltip";
import PreciseEth from "./PreciseEth";

const EthSupplyWidget: FC = () => {
  const ethSupplyParts = useEthSupplyParts();
  const ethSupply = ethSupplyFromParts(ethSupplyParts);
  const [showNerdTooltip, setShowNerdTooltip] = useState(false);
  const [blinkOrange, setBlinkOrange] = useState(false);
  const [blinkBlue, setBlinkBlue] = useState(false);
  const lastSupply = useRef(impreciseEthSupplyFromParts(ethSupplyParts));

  const handleBlinkOrange = useCallback(() => {
    setBlinkOrange(true);
    const id = setTimeout(() => {
      setBlinkOrange(false);
    }, 1000);
    return () => window.clearTimeout(id);
  }, []);

  const handleBlinkBlue = useCallback(() => {
    setBlinkBlue(true);
    const id = setTimeout(() => {
      setBlinkBlue(false);
    }, 1000);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const ethSupply = impreciseEthSupplyFromParts(ethSupplyParts);
    if (lastSupply.current === ethSupply) {
      return;
    }

    const isPositiveDelta = ethSupply - lastSupply.current > 0;
    if (isPositiveDelta) {
      handleBlinkBlue();
    } else {
      handleBlinkOrange();
    }

    lastSupply.current = ethSupply;
  }, [ethSupplyParts, handleBlinkBlue, handleBlinkOrange]);

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
          <div className="flex flex-col gap-y-4 transition-colors">
            <PreciseEth
              className={
                blinkBlue
                  ? "animate-flash-blue"
                  : blinkOrange
                  ? "animate-flash-orange"
                  : ""
              }
            >
              {ethSupply}
            </PreciseEth>
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
