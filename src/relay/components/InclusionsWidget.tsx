import type { FC } from "react";

import * as Format from "../../format";
import { getEtherscanUrl } from "../config";
import scrollbarStyles from "../../styles/Scrollbar.module.scss";
import LabelText from "../../components/TextsNext/LabelText";
import SkeletonText from "../../components/TextsNext/SkeletonText";
import { BaseText } from "../../components/Texts";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../components/WidgetSubcomponents";

const etherscanUrl = getEtherscanUrl();

type Payload = {
  blockNumber: number;
  insertedAt: Date;
  value: number;
};

const PayloadRow = ({ blockNumber, insertedAt, value }: Payload) => {
  const inclusionAgo = `${Format.formatDistance(new Date(), insertedAt)} ago`;
  const truncatedValue = value.toString().substring(0, 4);

  return (
    <a
      key={blockNumber}
      target="_blank"
      rel="noreferrer"
      href={`${etherscanUrl}/block/${blockNumber}`}
    >
      <li className="grid grid-cols-3 hover:opacity-60">
        <span className="font-roboto text-white">
          <SkeletonText width="7rem">
            {Format.formatBlockNumber(blockNumber)}
          </SkeletonText>
        </span>
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
          <BaseText font="font-roboto">
            <SkeletonText width="2rem">{inclusionAgo}</SkeletonText>
          </BaseText>
        </div>
      </li>
    </a>
  );
};

type Props = {
  payloadCount: number;
  payloads: Array<Payload>;
};

const InclusionsWidget: FC<Props> = ({ payloadCount, payloads }) => (
  <div className="flex flex-col gap-y-4">
    <WidgetBackground>
      <LabelText>inclusions</LabelText>
      <p className="mt-4 text-3xl font-extralight tracking-wide">
        <span className="font-inter text-white">{payloadCount}</span>
        <span> </span>
        <span className="font-roboto text-slateus-200">blocks</span>
      </p>
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

export default InclusionsWidget;
