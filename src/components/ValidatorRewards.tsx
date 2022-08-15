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
import * as Format from "../format";
import { flow, O, pipe } from "../fp";
import { MoneyAmount, PercentAmount } from "./Amount";
import { BodyText, LabelText, TextRoboto } from "./Texts";
import { WidgetBackground, WidgetTitle } from "./WidgetSubcomponents";

const skeletonLoadingWidth = 0.1;

type CategorySegmentProps = {
  imgAlt: string;
  imgName: string;
  onHoverCategory: (hovering: boolean) => void;
  percentOfTotalRewards: O.Option<number>;
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
    className="flex flex-col items-center select-none"
    style={{
      width: pipe(
        percentOfTotalRewards,
        O.getOrElse(() => skeletonLoadingWidth),
        (percent) => `${percent * 100}%`,
      ),
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
      className={`h-2 bg-blue-spindle w-full color-animation ${
        rounded === "left"
          ? "rounded-l-full"
          : rounded === "right"
          ? "rounded-r-full"
          : ""
      }`}
      style={{
        backgroundColor: showHighlight ? Colors.white : Colors.spindle,
      }}
    ></div>
    <div style={{ marginTop: "9px" }}>
      {pipe(
        percentOfTotalRewards,
        O.match(
          () => <Skeleton width="1.5rem" />,
          (percentOfTotalRewards) => (
            <TextRoboto
              className="color-animation"
              style={{
                color: showHighlight ? Colors.white : Colors.spindle,
              }}
            >
              {Format.formatPercentNoDecimals(percentOfTotalRewards)}
            </TextRoboto>
          ),
        ),
      )}
    </div>
  </div>
);

type RewardRowProps = {
  amount: O.Option<number>;
  hovering?: boolean;
  link?: string;
  name: string;
  setHovering?: (bool: boolean) => void;
  apr: O.Option<number>;
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
    className="grid grid-cols-3 link-animation"
    onMouseEnter={() => setHovering?.(true)}
    onMouseLeave={() => setHovering?.(false)}
    style={{ opacity: hovering !== undefined && hovering ? 0.6 : 1 }}
    href={link}
    target="_blank"
    rel="noreferrer"
  >
    <BodyText>{name}</BodyText>
    <MoneyAmount className="font-light text-right">
      {pipe(
        amount,
        O.map(flow(Format.ethFromGwei, Format.formatOneDecimal)),
        O.toUndefined,
      )}
    </MoneyAmount>
    <PercentAmount className="text-right">
      {pipe(apr, O.map(Format.formatPercentOneDecimal), O.toUndefined)}
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
          <div className="absolute w-full h-2 bg-blue-dusk rounded-full"></div>
        </div>
      ) : (
        <div className="relative flex py-4 items-center">
          <div className="absolute w-full h-2 bg-blue-highlightbg rounded-full color-animation"></div>
          <div className="w-full flex flex-row top-0 left-0 items-center z-10">
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
            <div className="h-2 bg-blue-dusk w-0.5"></div>
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
            <div className="h-2 bg-blue-dusk w-0.5"></div>
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
            <hr className="border-blue-shipcove h-[1px]" />
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
