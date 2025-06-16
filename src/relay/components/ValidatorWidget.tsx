import type { FC } from "react";
import { BaseText } from "../../components/Texts";
import LabelText from "../../components/TextsNext/LabelText";
import SkeletonText from "../../components/TextsNext/SkeletonText";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../components/WidgetSubcomponents";
import * as Format from "../../format";
import { O, pipe } from "../../fp";
import { useNow } from "../../mainsite/hooks/use-now";
import scrollbarStyles from "../../styles/Scrollbar.module.scss";
import { getBeaconchainUrl } from "../config";

const beaconChainUrl = getBeaconchainUrl();

type Validator = {
  insertedAt: Date;
  index: string;
};

const ValidatorRow = ({ insertedAt, index }: Validator) => {
  const now = useNow();

  const registeredAgo = pipe(
    now,
    O.map((now) => `${Format.formatDurationToNow(now, insertedAt)} ago`),
  );

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
            <SkeletonText width="2rem">
              {O.toUndefined(registeredAgo)}
            </SkeletonText>
          </BaseText>
        </div>
      </li>
    </a>
  );
};

type Props = {
  validatorCount: number;
  knownValidatorCount: number;
  validators: Array<Validator>;
};

const ValidatorWidget: FC<Props> = ({
  validatorCount,
  knownValidatorCount,
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
        </div>
      </WidgetBackground>
      <WidgetBackground>
        <div className="flex flex-col gap-y-4">
          <div className="grid grid-cols-2">
            <WidgetTitle>validator</WidgetTitle>
            <WidgetTitle className="-mr-1 text-right">registration</WidgetTitle>
          </div>
          {validators.length > 0 ? (
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
          ) : (
            <div
              className="flex h-[184px] items-center justify-center md:h-[214px]"
            >
              <BaseText font="font-roboto" color="text-slateus-400">
                registrations unavailable
              </BaseText>
            </div>
          )}
        </div>
      </WidgetBackground>
    </div>
  );
};

export default ValidatorWidget;
