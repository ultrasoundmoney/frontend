import { FC } from "react";

import * as Format from "../../format";
import scrollbarStyles from "../../styles/Scrollbar.module.scss";
import LabelText from "../../components/TextsNext/LabelText";
import SkeletonText from "../../components/TextsNext/SkeletonText";
import { BaseText } from "../../components/Texts";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../components/WidgetSubcomponents";

type Validator = {
  insertedAt: Date;
  pubkeyFragment: string;
};

const ValidatorRow = ({ insertedAt, pubkeyFragment }: Validator) => {
  const registeredAgo = `${Format.formatDistance(new Date(), insertedAt)} ago`;

  return (
    <div key={pubkeyFragment}>
      <li className="grid grid-cols-2">
        <div className="mr-1">
          <BaseText font="font-roboto">
            <SkeletonText width="1rem">{pubkeyFragment}</SkeletonText>
          </BaseText>
        </div>
        <div className="text-right">
          <BaseText font="font-roboto">
            <SkeletonText width="2rem">{registeredAgo}</SkeletonText>
          </BaseText>
        </div>
      </li>
    </div>
  );
};

type Props = {
  validatorCount: number;
  validators: Array<Validator>;
};

const ValidatorWidget: FC<Props> = ({ validatorCount, validators }) => {
  return (
    <div className="flex flex-col gap-y-4">
      <WidgetBackground>
        <LabelText>registrations</LabelText>
        <p className="mt-4 text-3xl font-extralight tracking-wide">
          <span className="font-inter text-white">{validatorCount}</span>
          <span> </span>
          <span className="font-roboto text-slateus-200">validators</span>
        </p>
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
