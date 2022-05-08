import { FC, useState } from "react";
import Skeleton from "react-loading-skeleton";
import {
  useValidatorRewards,
  ValidatorRewards,
} from "../api/validator-rewards";
import Colors from "../colors";
import * as Format from "../format";
import { formatNoDigit } from "../format";
import { flow, O, pipe } from "../fp";
import { MoneyAmount } from "./Amount";
import { LabelText, TextInter, TextRoboto } from "./Texts";
import { WidgetBackground, WidgetTitle } from "./widget-subcomponents";

type CategorySegmentProps = {
  imgAlt: string;
  imgName: string;
  onHoverCategory: (hovering: boolean) => void;
  percentOfTotalRewards: number | undefined;
  rounded?: "left" | "right";
  showHighlight: boolean;
};

const alwaysShowImgPercentThreshold = 0.04;
const skeletonLoadingWidth = 0.1;

const CategorySegment: FC<CategorySegmentProps> = ({
  imgAlt,
  imgName,
  onHoverCategory,
  percentOfTotalRewards: percentOfTotalBurn,
  rounded,
  showHighlight,
}) => (
  <div
    className="flex flex-col items-center select-none"
    style={{
      width: `${(percentOfTotalBurn ?? skeletonLoadingWidth) * 100}%`,
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
            visibility:
              percentOfTotalBurn === undefined
                ? "hidden"
                : percentOfTotalBurn < alwaysShowImgPercentThreshold
                ? "hidden"
                : "visible",
          }}
        />
        <img
          className="absolute w-6"
          src={`/${imgName}-coloron.svg`}
          alt="colored ice crystal, signifying staked ETH"
          style={{
            height: "21px",
            marginBottom: "12px",
            visibility:
              percentOfTotalBurn === undefined
                ? "hidden"
                : showHighlight
                ? "visible"
                : "hidden",
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
      {percentOfTotalBurn === undefined ? (
        <Skeleton width="1.5rem" />
      ) : (
        <TextRoboto
          className={`color-animation ${
            !showHighlight && percentOfTotalBurn < alwaysShowImgPercentThreshold
              ? "invisible"
              : "visible"
          }`}
          style={{
            color: showHighlight ? Colors.white : Colors.spindle,
          }}
        >
          {formatNoDigit((percentOfTotalBurn ?? skeletonLoadingWidth) * 100)}%
        </TextRoboto>
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

const callIfDefined = function <A>(fn: ((a: A) => void) | undefined, arg: A) {
  return fn === undefined ? () => undefined : () => fn(arg);
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
    onMouseEnter={callIfDefined(setHovering, true)}
    onMouseLeave={callIfDefined(setHovering, false)}
    style={{ opacity: hovering !== undefined && hovering ? 0.6 : 1 }}
    href={link}
    target="_blank"
    rel="noreferrer"
  >
    <TextInter>{name}</TextInter>
    <MoneyAmount className="font-light text-right" unit="eth">
      {pipe(
        amount,
        O.map(flow(Format.ethFromGwei, Format.formatOneDigit)),
        O.toUndefined,
      )}
    </MoneyAmount>

    <TextRoboto className="text-right">
      {pipe(apr, O.map(Format.formatPercentOneDigit), O.toUndefined)}
    </TextRoboto>
  </a>
);

const getPercentsOfTotal = (validatorRewards: ValidatorRewards) =>
  pipe(
    validatorRewards.issuance.annualReward +
      validatorRewards.tips.annualReward +
      validatorRewards.mev.annualReward,
    (total) => ({
      issuance: validatorRewards.issuance.annualReward / total,
      tips: validatorRewards.tips.annualReward / total,
      mev: validatorRewards.mev.annualReward / total,
    }),
  );

const ValidatorRewards = () => {
  const validatorRewards = useValidatorRewards();
  const [highlightIssuance, setHighlightIssuance] = useState(false);
  const [highlightTips, setHighlightTips] = useState(false);
  const [highlightMev, setHighlightMev] = useState(false);

  const percentsOfTotal = pipe(
    validatorRewards,
    O.map(getPercentsOfTotal),
    O.toUndefined,
  );

  const total = pipe(
    validatorRewards,
    O.map((validatorRewards) => ({
      annualReward:
        validatorRewards.issuance.annualReward +
        validatorRewards.tips.annualReward +
        validatorRewards.mev.annualReward,
      apr:
        validatorRewards.issuance.apr +
        validatorRewards.tips.apr +
        validatorRewards.mev.apr,
    })),
  );

  const selectAnnualRewards = (field: keyof ValidatorRewards) =>
    pipe(
      validatorRewards,
      O.map((validatorRewards) => validatorRewards[field].annualReward),
    );

  const selectApr = (field: keyof ValidatorRewards) =>
    pipe(
      validatorRewards,
      O.map((validatorRewards) => validatorRewards[field].apr),
    );

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
              percentOfTotalRewards={percentsOfTotal?.issuance}
              rounded="left"
              showHighlight={highlightIssuance}
            />
            <div className="h-2 bg-blue-dusk w-0.5"></div>
            <CategorySegment
              imgAlt={"an ETH coin symbolizing tips paid to block proposers"}
              imgName={"coin"}
              onHoverCategory={setHighlightTips}
              percentOfTotalRewards={percentsOfTotal?.tips}
              showHighlight={highlightTips}
            />
            <div className="h-2 bg-blue-dusk w-0.5"></div>
            <CategorySegment
              imgAlt={"a robot symbolizing MEV paid to block proposers"}
              imgName={"mev"}
              onHoverCategory={setHighlightMev}
              percentOfTotalRewards={percentsOfTotal?.mev}
              rounded="right"
              showHighlight={highlightMev}
            />
          </div>
        </div>
      )}
      <div className="flex flex-col gap-y-3">
        <div className="grid grid-cols-3">
          <LabelText className="col-span-2 text-right">annual reward</LabelText>
          <LabelText className="text-right">APR</LabelText>
        </div>
        {validatorRewards && (
          <>
            <RewardRow
              amount={selectAnnualRewards("issuance")}
              hovering={highlightIssuance}
              link="https://beaconcha.in/"
              name="issuance"
              setHovering={setHighlightIssuance}
              apr={selectApr("issuance")}
            />
            <RewardRow
              amount={selectAnnualRewards("tips")}
              hovering={highlightTips}
              link="https://dune.com/msilb7/EIP1559-Base-Fee-x-Tip-by-Block"
              name="tips"
              setHovering={setHighlightTips}
              apr={selectApr("tips")}
            />
            <RewardRow
              amount={selectAnnualRewards("mev")}
              hovering={highlightMev}
              link="https://explore.flashbots.net/"
              name="MEV (estimated)"
              setHovering={setHighlightMev}
              apr={selectApr("mev")}
            />
            <hr className="border-blue-shipcove h-[1px]" />
            <RewardRow
              amount={pipe(
                total,
                O.map((total) => total.annualReward),
              )}
              name="total"
              apr={pipe(
                total,
                O.map((total) => total.apr),
              )}
            />
          </>
        )}
      </div>
    </WidgetBackground>
  );
};

export default ValidatorRewards;
