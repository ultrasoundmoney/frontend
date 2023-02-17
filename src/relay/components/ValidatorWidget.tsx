import type { FC } from "react";

import * as Format from "../../format";
import scrollbarStyles from "../../styles/Scrollbar.module.scss";
import LabelText from "../../components/TextsNext/LabelText";
import SkeletonText from "../../components/TextsNext/SkeletonText";
import { BaseText } from "../../components/Texts";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../components/WidgetSubcomponents";
import { getBeaconchainUrl } from "../config";

const beaconChainUrl = getBeaconchainUrl();

type Validator = {
  insertedAt: Date;
  index: string;
};

const ValidatorRow = ({ insertedAt, index }: Validator) => {
  const registeredAgo = `${Format.formatDistance(new Date(), insertedAt)} ago`;

  return (
    <a
      key={index}
      target="_blank"
      rel="noreferrer"
      href={`${beaconChainUrl}/validator/${index}`}
    >
      <li className="grid grid-cols-2 hover:opacity-60">
        <div className="mr-1">
          <BaseText font="font-roboto">
            <SkeletonText width="1rem">
              {Format.formatZeroDecimals(parseInt(index))}
            </SkeletonText>
          </BaseText>
        </div>
        <div className="text-right">
          <BaseText font="font-roboto">
            <SkeletonText width="2rem">{registeredAgo}</SkeletonText>
          </BaseText>
        </div>
      </li>
    </a>
  );
};

type Props = {
  validatorCount: number;
  knownValidatorCount: number;
  recipientCount: number;
  validators: Array<Validator>;
};

const ValidatorWidget: FC<Props> = ({
  validatorCount,
  knownValidatorCount,
  recipientCount,
  validators,
}) => {
  const percentageOfValidators = Format.formatPercentTwoDecimals(
    validatorCount / knownValidatorCount,
  );

  return (
    <div className="flex flex-col gap-y-4">
      <WidgetBackground>
        <LabelText>registrations</LabelText>
        <p className="mt-4 text-3xl font-extralight tracking-wide">
          <span className="font-inter text-white">
            {Format.formatZeroDecimals(validatorCount)}
          </span>
          <span> </span>
          <span className="font-roboto text-slateus-200">validators</span>
        </p>
        <div
          className={`
          mt-4 flex flex-row justify-between
          font-inter text-xs font-light uppercase
          tracking-widest text-slateus-400
         `}
        >
          <div>
            <span className="text-slateus-200">{percentageOfValidators}</span>
            <span> of&nbsp;validators</span>
          </div>
          <div>
            <span className="text-slateus-200">
              {Format.formatZeroDecimals(recipientCount)}
            </span>
            <span> fee&nbsp;recipients</span>
          </div>
        </div>
      </WidgetBackground>
      <WidgetBackground>
        <div className="flex flex-col gap-y-4">
          <div className="grid grid-cols-2">
            <WidgetTitle>validator</WidgetTitle>
            <WidgetTitle className="-mr-1 text-right">registration</WidgetTitle>
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
            {validators.map(ValidatorRow)}
          </ul>
        </div>
      </WidgetBackground>
    </div>
  );
};

export default ValidatorWidget;
