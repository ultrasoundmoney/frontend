import * as DateFns from "date-fns";
import JSBI from "jsbi";
import { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useEthSupply } from "../../api/eth-supply";
import { getDateTimeFromSlot } from "../../beacon-time";
import { FeatureFlagsContext } from "../../feature-flags";
import Modal from "../Modal";
import { WidgetBackground, WidgetTitle } from "../WidgetSubcomponents";
import EthSupplyTooltip from "./EthSupplyTooltip";
import PreciseEth from "./PreciseEth";

const EthSupplyWidget = () => {
  const ethSupply = useEthSupply();
  const [isHoveringNerd, setIsHoveringNerd] = useState(false);
  const [showEthSupplyTooltip, setShowEthSupplyTooltip] = useState(false);
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
        <div className="flex flex-col gap-y-6">
          <button
            className="flex items-center"
            onMouseEnter={() => setIsHoveringNerd(true)}
            onMouseLeave={() => setIsHoveringNerd(false)}
            onClick={() => setShowEthSupplyTooltip(true)}
          >
            <WidgetTitle>eth supply</WidgetTitle>
            <img
              alt="an emoji of a nerd"
              className={`ml-2 select-none ${isHoveringNerd ? "hidden" : ""}`}
              src={`/nerd-coloroff.svg`}
            />
            <img
              alt="an colored emoji of a nerd"
              className={`ml-2 select-none ${isHoveringNerd ? "" : "hidden"}`}
              src={`/nerd-coloron.svg`}
            />
          </button>
          <PreciseEth>{ethSupplySum}</PreciseEth>
          <span className="font-inter text-blue-spindle text-xs md:text-sm font-extralight">
            {"updated "}
            <span className="font-roboto text-white font-light [word-spacing:-0.3em]">
              {ethSupply === undefined || previewSkeletons ? (
                <Skeleton inline={true} width="2rem" />
              ) : (
                `${timeElapsed} seconds`
              )}
            </span>
            {" ago"}
          </span>
        </div>
      </WidgetBackground>
      <Modal
        onClickBackground={() => setShowEthSupplyTooltip(false)}
        show={showEthSupplyTooltip}
      >
        <EthSupplyTooltip onClickClose={() => setShowEthSupplyTooltip(false)} />
      </Modal>
    </>
  );
};

export default EthSupplyWidget;
