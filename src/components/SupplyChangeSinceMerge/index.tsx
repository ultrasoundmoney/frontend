import * as DateFns from "date-fns";
import type { FC } from "react";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import type { EthSupply } from "../../api/eth-supply";
import { getEthSupplyImprecise } from "../../api/eth-supply";
import type { MergeEstimate } from "../../api/merge-estimate";
import type { MergeStatus } from "../../api/merge-status";
import { getDateTimeFromSlot } from "../../beacon-time";
import { TextRoboto } from "../Texts";
import LabelText from "../TextsNext/LabelText";
import UpdatedAgo from "../UpdatedAgo";
import WidgetErrorBoundary from "../WidgetErrorBoundary";
import { WidgetBackground } from "../WidgetSubcomponents";

type Props = {
  ethSupply: EthSupply;
  mergeEstimate: MergeEstimate;
  mergeStatus: MergeStatus;
};

const SupplyChangeSinceMerge: FC<Props> = ({ ethSupply, mergeStatus }) => {
  const ethSupplyImprecise = getEthSupplyImprecise(ethSupply);
  const supplyDelta = ethSupplyImprecise - mergeStatus.supply;

  return (
    <WidgetErrorBoundary title="supply change since merge">
      <WidgetBackground>
        <div className={`relative flex flex-col gap-x-2 gap-y-4`}>
          <div className="flex flex-col gap-y-4">
            <LabelText>supply change since merge</LabelText>
          </div>
          <div className="flex">
            <TextRoboto
              className={`
                text-3xl text-transparent
                bg-clip-text bg-gradient-to-r
                ${
                  supplyDelta >= 0
                    ? "from-cyan-300 to-indigo-500"
                    : "from-orange-500 to-yellow-300"
                }
              `}
            >
              {supplyDelta >= 0 && "+"}
              <CountUp
                preserveValue
                end={supplyDelta ?? 0}
                separator=","
                decimals={2}
              />
            </TextRoboto>
            <span className="font-roboto font-light text-3xl text-slateus-400 ml-2">
              ETH
            </span>
          </div>
          <UpdatedAgo
            updatedAt={getDateTimeFromSlot(
              ethSupply.beaconBalancesSum.slot,
            ).toISOString()}
          />
        </div>
      </WidgetBackground>
    </WidgetErrorBoundary>
  );
};

export default SupplyChangeSinceMerge;
