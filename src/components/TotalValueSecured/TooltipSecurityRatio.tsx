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
import { BaseText, UnitText } from "../Texts";
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
        flex w-[22rem] flex-col
        gap-y-4 rounded-lg border
        border-slateus-400 bg-slateus-700
        p-8
      `}
    >
      <img
        alt="a close button, circular with an x in the middle"
        className="absolute right-5 top-5 w-6 cursor-pointer select-none hover:brightness-90 active:brightness-110"
        onClick={onClickClose}
        src="/close.svg"
      />
      <img
        alt=""
        className="mx-auto h-20 w-20 select-none rounded-full"
        src={"/round-nerd-large.svg"}
      />
      <BodyText className="font-semibold">security ratio</BodyText>
      <div>
        <BodyText className="whitespace-pre-wrap md:leading-normal">
          The ratio of total value secured (TVS) to economic security. It
          measures attacker leverage—lower is better.
        </BodyText>
      </div>
      <WidgetTitle>formula</WidgetTitle>
      <div className="flex items-center">
        <BodyText>=</BodyText>
        <div className="ml-2 flex flex-col">
          <BodyText>total value secured</BodyText>
          <hr className="h-[1px]" />
          <BodyText>economic security</BodyText>
        </div>
      </div>
      <div className="flex items-center">
        <BodyText>=</BodyText>
        <div className="ml-2 flex flex-col">
          <BodyText>value secured by Ethereum</BodyText>
          <hr className="h-[1px]" />
          <BodyText>value securing Ethereum</BodyText>
        </div>
      </div>
      <div className="flex items-center text-base">
        <BodyText>=</BodyText>
        <div className="ml-2 flex flex-col">
          <div>
            <BaseText font="font-roboto">
              {totalValueSecured === undefined || previewSkeletons ? (
                <Skeleton inline width="2.4rem" />
              ) : (
                Format.formatTwoDigit(totalValueSecured.sum / 1e12)
              )}
              T
            </BaseText>
            <AmountUnitSpace />
            <UnitText>USD</UnitText>
            <AmountUnitSpace />
            <BaseText
              font="font-inter"
              weight="font-extralight"
              color="text-slateus-200"
            >
              in ETH, ERC20s, NFTs
            </BaseText>
          </div>
          <hr className="h-[1px]" />
          {totalValueSecured === undefined ? (
            <Skeleton inline width="2rem" />
          ) : (
            <div>
              <BaseText font="font-roboto">
                {ethStaked === undefined || previewSkeletons ? (
                  <Skeleton inline width="2.4rem" />
                ) : (
                  formatEthPrice(ethPriceStats, ethStaked)
                )}
                T
              </BaseText>
              <AmountUnitSpace />
              <UnitText>USD</UnitText>
              <AmountUnitSpace />
              <BaseText
                color="text-slateus-200"
                font="font-inter"
                weight="font-extralight"
              >
                in staked ETH
              </BaseText>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TooltipSecurityRatio;
