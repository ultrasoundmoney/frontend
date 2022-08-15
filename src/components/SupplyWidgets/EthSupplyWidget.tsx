import * as DateFns from "date-fns";
import JSBI from "jsbi";
import { useContext, useEffect, useState } from "react";
import { useEthSupply } from "../../api/eth-supply";
import { getDateTimeFromSlot } from "../../beacon-time";
import { FeatureFlagsContext } from "../../feature-flags";
import { LabelText, LabelUnitText } from "../Texts";
import { WidgetBackground, WidgetTitle } from "../WidgetSubcomponents";
import EthSupplyTooltip from "./EthSupplyTooltip";
import Nerd from "./Nerd";
import PreciseEth from "./PreciseEth";

const EthSupplyWidget = () => {
  const ethSupply = useEthSupply();
  const [showNerdTooltip, setShowNerdTooltip] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState<number>();
  const { previewSkeletons } = useContext(FeatureFlagsContext);

  const ethSupplySum =
    ethSupply === undefined
      ? undefined
      : JSBI.subtract(
          JSBI.add(
            ethSupply.executionBalancesSum.balancesSum,
            ethSupply.beaconBalancesSum.balancesSum,
          ),
          ethSupply.beaconDepositsSum.depositsSum,
        );

  useEffect(() => {
    if (ethSupply === undefined) {
      return;
    }

    const lastAnalyzedSlotDateTime = getDateTimeFromSlot(
      ethSupply.beaconBalancesSum.slot,
    );

    setTimeElapsed(
      DateFns.differenceInSeconds(new Date(), lastAnalyzedSlotDateTime),
    );

    const intervalId = window.setInterval(() => {
      setTimeElapsed(
        DateFns.differenceInSeconds(new Date(), lastAnalyzedSlotDateTime),
      );
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [ethSupply]);

  return (
    <>
      <WidgetBackground>
        <div className="relative flex flex-col gap-y-4">
          <div
            className={`
                flex items-center
                cursor-pointer
                [&>.gray-nerd]:hover:opacity-0
                [&>.color-nerd]:active:brightness-90
            `}
            onClick={() => setShowNerdTooltip(true)}
          >
            <WidgetTitle>eth supply</WidgetTitle>
            <Nerd />
          </div>
          <div
            className={`
              tooltip ${showNerdTooltip ? "block" : "hidden"} absolute
              top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2
              w-[calc(100% + 96px)] max-w-sm
              whitespace-nowrap
              cursor-auto
              z-30
            `}
          >
            <EthSupplyTooltip onClickClose={() => setShowNerdTooltip(false)} />
          </div>
          <div className="flex flex-col gap-y-2">
            <PreciseEth>{ethSupplySum}</PreciseEth>
            <div className="flex gap-x-1 items-center">
              <LabelText className="text-slateus-400">updated</LabelText>
              <div className="flex items-baseline">
                <LabelUnitText>
                  {!previewSkeletons ? timeElapsed : undefined}
                </LabelUnitText>
                <LabelText className="ml-1">seconds</LabelText>
              </div>
              <LabelText className="text-slateus-400">ago</LabelText>
            </div>
          </div>
        </div>
      </WidgetBackground>
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
    </>
  );
};

export default EthSupplyWidget;
