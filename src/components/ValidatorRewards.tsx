import type { FC } from "react";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import {
  getAnnualRewards,
  getApr,
  getPercentOfTotal,
  getTotalAnnualReward,
  getTotalApr,
  useValidatorRewards,
} from "../api/validator-rewards";
import Colors from "../colors";
import { GWEI_PER_ETH } from "../eth-units";
import * as Format from "../format";
import { MoneyAmount, PercentAmount } from "./Amount";
import { BaseText } from "./Texts";
import BodyText from "./TextsNext/BodyText";
import LabelText from "./TextsNext/LabelText";
import { WidgetBackground, WidgetTitle } from "./WidgetSubcomponents";

const skeletonLoadingWidth = 0.1;

type CategorySegmentProps = {
  imgAlt: string;
  imgName: string;
  onHoverCategory: (hovering: boolean) => void;
  percentOfTotalRewards: number | undefined;
  rounded?: "left" | "right";
  showHighlight: boolean;
};

const CategorySegment: FC<CategorySegmentProps> = ({
  imgAlt,
  imgName,
  onHoverCategory,
  percentOfTotalRewards,
  rounded,
  showHighlight,
}) => (
  <div
    className="flex select-none flex-col items-center"
    style={{
      width: `${(percentOfTotalRewards ?? skeletonLoadingWidth) * 100}%`,
    }}
    onMouseEnter={() => onHoverCategory(true)}
    onMouseLeave={() => onHoverCategory(false)}
  >
    {imgName === undefined ? (
      <Skeleton height="16px" width="1.4rem" className="mb-3" />
    ) : (
      <>
        <img
          className="relative w-6"
          src={`/${imgName}-coloroff.svg`}
          alt={imgAlt}
          style={{
            height: "21px",
            marginBottom: "12px",
          }}
        />
        <img
          className="absolute w-6"
          src={`/${imgName}-coloron.svg`}
          alt="colored ice crystal, signifying staked ETH"
          style={{
            height: "21px",
            marginBottom: "12px",
            visibility: showHighlight ? "visible" : "hidden",
          }}
        />
      </>
    )}
    <div
      className={`color-animation h-2 w-full bg-slateus-200 ${
        rounded === "left"
          ? "rounded-l-full"
          : rounded === "right"
          ? "rounded-r-full"
          : ""
      }`}
      style={{
        backgroundColor: showHighlight ? Colors.white : Colors.slateus200,
      }}
    ></div>
    <div style={{ marginTop: "9px" }}>
      {percentOfTotalRewards !== undefined ? (
        <BaseText
          font="font-roboto"
          className="color-animation"
          style={{
            color: showHighlight ? Colors.white : Colors.slateus200,
          }}
        >
          {Format.formatPercentNoDecimals(percentOfTotalRewards)}
        </BaseText>
      ) : (
        <Skeleton width="1.5rem" />
      )}
    </div>
  </div>
);

type RewardRowProps = {
  amount: number | undefined;
  hovering?: boolean;
  link?: string;
  name: string;
  setHovering?: (bool: boolean) => void;
  apr: number | undefined;
};

const RewardRow: FC<RewardRowProps> = ({
  amount,
  hovering,
  link,
  name,
  setHovering,
  apr,
}) => (
  <a
    className="link-animation grid grid-cols-3"
    onMouseEnter={() => setHovering?.(true)}
    onMouseLeave={() => setHovering?.(false)}
    style={{ opacity: hovering !== undefined && hovering ? 0.6 : 1 }}
    href={link}
    target="_blank"
    rel="noreferrer"
  >
    <BodyText>{name}</BodyText>
    <MoneyAmount className="text-right font-light">
      {amount === undefined
        ? undefined
        : Format.formatOneDecimal(amount / GWEI_PER_ETH)}
    </MoneyAmount>
    <PercentAmount className="text-right">
      {apr === undefined ? undefined : Format.formatPercentOneDecimal(apr)}
    </PercentAmount>
  </a>
);

const ValidatorRewardsWidget = () => {
  const validatorRewards = useValidatorRewards();
  const [highlightIssuance, setHighlightIssuance] = useState(false);
  const [highlightTips, setHighlightTips] = useState(false);
  const [highlightMev, setHighlightMev] = useState(false);

  return (
    <WidgetBackground>
      <WidgetTitle>validator rewards</WidgetTitle>
      {validatorRewards === undefined ? (
        <div className="relative py-16">
          <div className="absolute h-2 w-full rounded-full bg-slateus-500"></div>
        </div>
      ) : (
        <div className="relative flex items-center py-4">
          <div className="color-animation absolute h-2 w-full rounded-full bg-slateus-600"></div>
          <div className="top-0 left-0 z-10 flex w-full flex-row items-center">
            <CategorySegment
              imgAlt={
                "a droplet symbolizing ETH issuance on the beacon chain paid to block proposers"
              }
              imgName={"drop"}
              onHoverCategory={setHighlightIssuance}
              percentOfTotalRewards={getPercentOfTotal(
                validatorRewards,
                "issuance",
              )}
              rounded="left"
              showHighlight={highlightIssuance}
            />
            <div className="h-2 w-0.5 bg-slateus-500"></div>
            <CategorySegment
              imgAlt={"an ETH coin symbolizing tips paid to block proposers"}
              imgName={"coin"}
              onHoverCategory={setHighlightTips}
              percentOfTotalRewards={getPercentOfTotal(
                validatorRewards,
                "tips",
              )}
              showHighlight={highlightTips}
            />
            <div className="h-2 w-0.5 bg-slateus-500"></div>
            <CategorySegment
              imgAlt={"a robot symbolizing MEV paid to block proposers"}
              imgName={"mev"}
              onHoverCategory={setHighlightMev}
              percentOfTotalRewards={getPercentOfTotal(validatorRewards, "mev")}
              rounded="right"
              showHighlight={highlightMev}
            />
          </div>
        </div>
      )}
      <div className="flex flex-col gap-y-3">
        <div className="grid grid-cols-3">
          <LabelText className="col-span-2 text-right">yearly</LabelText>
          <LabelText className="text-right">APR</LabelText>
        </div>
        {validatorRewards && (
          <>
            <RewardRow
              amount={getAnnualRewards(validatorRewards, "issuance")}
              hovering={highlightIssuance}
              link="https://beaconscan.com/stat/validatortotaldailyincome"
              name="issuance"
              setHovering={setHighlightIssuance}
              apr={getApr(validatorRewards, "issuance")}
            />
            <RewardRow
              amount={getAnnualRewards(validatorRewards, "tips")}
              hovering={highlightTips}
              name="tips"
              setHovering={setHighlightTips}
              apr={getApr(validatorRewards, "tips")}
            />
            <RewardRow
              amount={getAnnualRewards(validatorRewards, "mev")}
              hovering={highlightMev}
              link="https://explore.flashbots.net/"
              name="MEV estimate"
              setHovering={setHighlightMev}
              apr={getApr(validatorRewards, "mev")}
            />
            <hr className="h-[1px] border-slateus-400" />
            <RewardRow
              amount={getTotalAnnualReward(validatorRewards)}
              name="total"
              apr={getTotalApr(validatorRewards)}
            />
          </>
        )}
      </div>
    </WidgetBackground>
  );
};

export default ValidatorRewardsWidget;
