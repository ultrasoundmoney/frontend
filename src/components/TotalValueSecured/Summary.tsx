import type { FC } from "react";
import { useState } from "react";
import CountUp from "react-countup";
import { useTotalValueSecured } from "../../api/total-value-secured";
import * as Format from "../../format";
import {
  AmountAnimatedShell,
  AmountBillionsUsdAnimated,
  AmountTrillionsUsdAnimated,
} from "../Amount";
import DefaultLink from "../DefaultLink";
import Modal from "../Modal";
import BodyText from "../TextsNext/BodyText";
import { WidgetBackground, WidgetTitle } from "../WidgetSubcomponents";
import TooltipSecurityRatio from "./TooltipSecurityRatio";

const AssetType: FC<{
  alt?: string;
  icon: string;
  title: string;
  amount: number | undefined;
  href: string;
}> = ({ alt, href, icon, title, amount }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <DefaultLink
      className="relative flex items-center justify-between"
      href={href}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center">
        <img
          alt={alt}
          className={`select-none ${isHovering ? "invisible" : "visible"}`}
          src={`/round-${icon}-coloroff.svg`}
        />
        <img
          className={`absolute top-0 select-none ${
            isHovering ? "visible" : "invisible"
          }`}
          src={`/round-${icon}-coloron.svg`}
          alt={alt}
        />
        <BodyText
          className={`
            ml-4
          `}
        >
          {title}
        </BodyText>
      </div>
      <AmountBillionsUsdAnimated
        size="text-base md:text-lg"
        tooltip={
          amount === undefined
            ? undefined
            : `${Format.formatZeroDecimals(amount)} USD`
        }
      >
        {amount}
      </AmountBillionsUsdAnimated>
    </DefaultLink>
  );
};

const Summary: FC<{ className?: string }> = ({ className = "" }) => {
  const totalValueSecured = useTotalValueSecured();
  const [showSecurityRatioTooltip, setShowSecurityRatioTooltip] =
    useState(false);
  const [isHoveringNerd, setIsHoveringNerd] = useState(false);

  return (
    <>
      <WidgetBackground className={`h-min ${className}`}>
        <div className="-mt-1 mb-2 flex flex-col gap-y-4">
          <div className="flex flex-col  gap-y-4 md:flex-row md:justify-between">
            <div
              className="flex flex-col gap-y-4"
              title={
                totalValueSecured === undefined
                  ? undefined
                  : `${Format.formatZeroDecimals(totalValueSecured.sum)} USD`
              }
            >
              <WidgetTitle>total value secured</WidgetTitle>
              <AmountTrillionsUsdAnimated
                skeletonWidth="8rem"
                size="text-2xl md:text-3xl xl:text-4xl"
              >
                {totalValueSecured?.sum}
              </AmountTrillionsUsdAnimated>
            </div>
            <div
              className="flex cursor-pointer flex-col gap-y-4 md:items-end"
              onClick={() => setShowSecurityRatioTooltip(true)}
              onMouseEnter={() => setIsHoveringNerd(true)}
              onMouseLeave={() => setIsHoveringNerd(false)}
            >
              <div className="flex items-center">
                <WidgetTitle>security ratio</WidgetTitle>
                <img
                  alt="an emoji of a nerd"
                  className={`ml-2 select-none ${
                    isHoveringNerd ? "hidden" : ""
                  }`}
                  src={`/nerd-coloroff.svg`}
                />
                <img
                  alt="an colored emoji of a nerd"
                  className={`ml-2 select-none ${
                    isHoveringNerd ? "" : "hidden"
                  }`}
                  src={`/nerd-coloron.svg`}
                />
              </div>
              <AmountAnimatedShell
                skeletonWidth="5rem"
                size="text-2xl md:text-3xl xl:text-4xl"
              >
                {totalValueSecured?.securityRatio === undefined ? undefined : (
                  <CountUp
                    decimals={1}
                    duration={0.8}
                    end={totalValueSecured.securityRatio}
                    preserveValue
                    suffix="x"
                  />
                )}
              </AmountAnimatedShell>
            </div>
          </div>
          <WidgetTitle>ethereum secures</WidgetTitle>
          <AssetType
            amount={totalValueSecured?.ethTotal}
            href={"https://etherscan.io/stat/supply"}
            icon="eth"
            title="ETH"
          />
          <AssetType
            amount={totalValueSecured?.erc20Total}
            href={"https://www.coingecko.com/?asset_platform_id=ethereum"}
            icon="erc20"
            title="ERC20s"
          />
          <AssetType
            amount={totalValueSecured?.nftTotal}
            href={"https://nftgo.io/analytics/top-collections"}
            icon="nft"
            title="NFTs"
          />
        </div>
      </WidgetBackground>
      <Modal
        onClickBackground={() => setShowSecurityRatioTooltip(false)}
        show={showSecurityRatioTooltip}
      >
        <TooltipSecurityRatio
          onClickClose={() => setShowSecurityRatioTooltip(false)}
        />
      </Modal>
    </>
  );
};

export default Summary;
