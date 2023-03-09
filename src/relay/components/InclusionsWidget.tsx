import * as D from "date-fns";
import type { FC } from "react";
import { useEffect, useState } from "react";

import { BaseText } from "../../components/Texts";
import LabelText from "../../components/TextsNext/LabelText";
import QuantifyText from "../../components/TextsNext/QuantifyText";
import SkeletonText from "../../components/TextsNext/SkeletonText";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../components/WidgetSubcomponents";
import * as Format from "../../format";
import scrollbarStyles from "../../styles/Scrollbar.module.scss";
import { getEtherscanUrl } from "../config";
import type { Payload } from "../types";

const etherscanUrl = getEtherscanUrl();

const PayloadRow = ({ blockNumber, insertedAt, value }: Payload) => {
  const [inclusionAgo, setInclusionAgo] = useState<string | undefined>(
    undefined,
  );
  const truncatedValue = value.toString().substring(0, 4);

  useEffect(() => {
    const interval = setInterval(() => {
      setInclusionAgo(Format.formatTimeDistance(new Date(), insertedAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [insertedAt]);

  return (
    <a
      key={blockNumber}
      target="_blank"
      rel="noreferrer"
      href={`${etherscanUrl}/block/${blockNumber}`}
    >
      <li className="grid grid-cols-3 hover:opacity-60">
        <QuantifyText color="text-slateus-100">
          <SkeletonText width="7rem">
            {Format.formatBlockNumber(blockNumber)}
          </SkeletonText>
        </QuantifyText>
        <div className="mr-1 text-right">
          <BaseText font="font-roboto">
            <SkeletonText width="1rem">{truncatedValue}</SkeletonText>
          </BaseText>
          <div className="hidden md:inline">
            <span className="font-inter">&thinsp;</span>
            <span className="font-roboto font-extralight text-slateus-200">
              ETH
            </span>
          </div>
        </div>
        <div className="text-right">
          <QuantifyText unitPostfix="ago" unitPostfixColor="text-slateus-100">
            <SkeletonText width="2rem">{inclusionAgo}</SkeletonText>
          </QuantifyText>
        </div>
      </li>
    </a>
  );
};

// percentage of slots included since date
const calcPercentageOfSlotsIncluded = (payloadCount: number, since: Date) => {
  const SECONDS_PER_SLOT = 12;
  const secondsSinceFirstPayload = D.differenceInSeconds(new Date(), since);
  const slotsSinceFirstPayload = Math.round(
    secondsSinceFirstPayload / SECONDS_PER_SLOT,
  );
  return payloadCount / slotsSinceFirstPayload;
};

type Props = {
  payloadCount: number;
  totalValue: number;
  firstPayloadAt: Date;
  payloads: Array<Payload>;
};

const InclusionsWidget: FC<Props> = ({
  payloadCount,
  totalValue,
  firstPayloadAt,
  payloads,
}) => {
  const percentageSlotsIncluded = Format.formatPercentTwoDecimals(
    calcPercentageOfSlotsIncluded(payloadCount, firstPayloadAt),
  );
  const totalValueFormatted = Format.formatTwoDigit(totalValue);

  return (
    <div className="flex flex-col gap-y-4">
      <WidgetBackground>
        <LabelText>inclusions</LabelText>
        <p className="mt-4 text-3xl font-extralight tracking-wide">
          <span className="font-inter text-white">
            {Format.formatZeroDecimals(payloadCount)}
          </span>
          <span> </span>
          <span className="font-roboto text-slateus-200">blocks</span>
        </p>
        <div
          className={`
          mt-4 flex flex-row justify-between
          font-inter text-xs font-light uppercase
          tracking-widest text-slateus-400
         `}
        >
          <div>
            <span className="text-slateus-200">{percentageSlotsIncluded}</span>
            <span> of&nbsp;blocks</span>
          </div>
          <div>
            <span className="text-slateus-200">{`${totalValueFormatted} ETH`}</span>
            <span> total&nbsp;value</span>
          </div>
        </div>
      </WidgetBackground>
      <WidgetBackground>
        <div className="flex flex-col gap-y-4">
          <div className="grid grid-cols-3">
            <WidgetTitle>block</WidgetTitle>
            <WidgetTitle className="text-right">value</WidgetTitle>
            <WidgetTitle className="-mr-1 text-right">inclusion</WidgetTitle>
          </div>
          <ul
            className={`
            -mr-3 flex max-h-[184px]
            flex-col gap-y-4 overflow-y-auto
            pr-1 md:max-h-[214px]
            ${scrollbarStyles["styled-scrollbar-vertical"]}
            ${scrollbarStyles["styled-scrollbar"]}
          `}
          >
            {payloads.map(PayloadRow)}
          </ul>
        </div>
      </WidgetBackground>
    </div>
  );
};

export default InclusionsWidget;
