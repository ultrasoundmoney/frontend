import JSBI from "jsbi";
import flow from "lodash/flow";
import type { FC } from "react";
import { useContext } from "react";
import Skeleton from "react-loading-skeleton";
import type { EthPriceStats } from "../../api/eth-price-stats";
import { useEthPriceStats } from "../../api/eth-price-stats";
import type { Scarcity } from "../../api/scarcity";
import { useScarcity } from "../../api/scarcity";
import { useTotalValueSecured } from "../../api/total-value-secured";
import { FeatureFlagsContext } from "../../feature-flags";
import * as Format from "../../format";
import { AmountUnitSpace } from "../Spacing";
import { TextInter, TextRoboto, UnitText } from "../Texts";
import BodyText from "../TextsNext/BodyText";
import { WidgetTitle } from "../WidgetSubcomponents";

const formatEthPrice = (
  ethPrice: EthPriceStats,
  ethStaked: Scarcity["engines"]["staked"],
) =>
  flow(
    // We scale up a little, the numbers are huge, let's not drop precision we have.
    () => Math.round(ethPrice.usd * 1e2),
    (ethPriceCentsFloat) => JSBI.BigInt(ethPriceCentsFloat),
    (ethPriceCentsBI) => JSBI.multiply(ethStaked.amount, ethPriceCentsBI),
    // 1e18 is Wei -> ETH, 1e12 is displaying in trillions, 1e2 is scaling down from using cents not dollars above.
    // We then leave four orders of size, because we expect a number < 0, which a bigint cannot hold.
    (num) => JSBI.divide(num, JSBI.BigInt(1e12 * 1e18 * 1e2 * 1e-4)),
    // We then leave
    (num) => JSBI.toNumber(num) / 1e4,
    Format.formatTwoDigit,
  )();

const TooltipSecurityRatio: FC<{
  onClickClose: () => void;
}> = ({ onClickClose }) => {
  const ethPriceStats = useEthPriceStats();
  const totalValueSecured = useTotalValueSecured();
  const ethStaked = useScarcity()?.engines.staked;
  const { previewSkeletons } = useContext(FeatureFlagsContext);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={`
        relative
        flex flex-col gap-y-4
        bg-blue-tangaroa p-8 rounded-lg
        border border-blue-shipcove
        w-[22rem]
      `}
    >
      <img
        alt="a close button, circular with an x in the middle"
        className="absolute w-6 right-5 top-5 hover:brightness-90 active:brightness-110 cursor-pointer select-none"
        onClick={onClickClose}
        src="/close.svg"
      />
      <img
        alt=""
        className="w-20 h-20 mx-auto rounded-full select-none"
        src={"/round-nerd-large.svg"}
      />
      <BodyText className="font-semibold">Security ratio</BodyText>
      <div>
        <BodyText className="whitespace-pre-wrap md:leading-normal">
          The ratio of total value secured (TVS) to economic security. It
          measures attacker leverage—lower is better.
        </BodyText>
      </div>
      <WidgetTitle>formula</WidgetTitle>
      <div className="flex items-center">
        <BodyText>=</BodyText>
        <div className="flex flex-col ml-2">
          <BodyText>total value secured</BodyText>
          <hr className="h-[1px]" />
          <BodyText>economic security</BodyText>
        </div>
      </div>
      <div className="flex items-center">
        <BodyText>=</BodyText>
        <div className="flex flex-col ml-2">
          <BodyText>value secured by Ethereum</BodyText>
          <hr className="h-[1px]" />
          <BodyText>value securing Ethereum</BodyText>
        </div>
      </div>
      <div className="flex items-center text-base">
        <BodyText>=</BodyText>
        <div className="flex flex-col ml-2">
          <div>
            <TextRoboto>
              {totalValueSecured === undefined || previewSkeletons ? (
                <Skeleton inline width="2.4rem" />
              ) : (
                Format.formatTwoDigit(totalValueSecured.sum / 1e12)
              )}
              T
            </TextRoboto>
            <AmountUnitSpace />
            <UnitText>USD</UnitText>
            <AmountUnitSpace />
            <TextInter className="font-inter font-extralight text-blue-spindle">
              in ETH, ERC20s, NFTs
            </TextInter>
          </div>
          <hr className="h-[1px]" />
          {totalValueSecured === undefined ? (
            <Skeleton inline width="2rem" />
          ) : (
            <div>
              <TextRoboto>
                {ethStaked === undefined || previewSkeletons ? (
                  <Skeleton inline width="2.4rem" />
                ) : (
                  formatEthPrice(ethPriceStats, ethStaked)
                )}
                T
              </TextRoboto>
              <AmountUnitSpace />
              <UnitText>USD</UnitText>
              <AmountUnitSpace />
              <TextInter className="font-inter font-extralight text-blue-spindle">
                in staked ETH
              </TextInter>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TooltipSecurityRatio;
