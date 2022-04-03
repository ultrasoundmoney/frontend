import { FC, useState } from "react";
import CountUp from "react-countup";
import { useTotalValueSecured } from "../../api/total-value-secured";
import * as Format from "../../format";
import { flow, O, pipe } from "../../fp";
import {
  AmountAnimatedShell,
  AmountBillionsUsdAnimated,
  AmountTrillionsUsdAnimated,
} from "../Amount";
import Link from "../Link";
import Modal from "../Modal";
import { TextInter } from "../Texts";
import { WidgetBackground, WidgetTitle } from "../widget-subcomponents";
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
    <Link
      className="relative flex justify-between items-center opacity-100"
      enableHover={false}
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
        <TextInter
          className={`
            ml-4
            ${isHovering ? "opacity-60" : ""}`}
        >
          {title}
        </TextInter>
      </div>
      <AmountBillionsUsdAnimated
        textClassName={`
          text-base md:text-lg
          ${isHovering ? "opacity-60" : ""}
        `}
        tooltip={pipe(
          amount,
          O.fromNullable,
          O.map(flow(Format.formatZeroDigit, (str) => `${str} USD`)),
          O.toUndefined,
        )}
      >
        {amount}
      </AmountBillionsUsdAnimated>
    </Link>
  );
};

const Summary: FC<{ className?: string }> = ({ className = "" }) => {
  const totalValueSecured = useTotalValueSecured();
  const [showSecurityRatioTooltip, setShowSecurityRatioTooltip] =
    useState(false);

  return (
    <>
      <WidgetBackground className={`h-min ${className}`}>
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col  gap-y-4 md:flex-row md:justify-between">
            <div
              className="flex flex-col gap-y-4"
              title={pipe(
                totalValueSecured?.sum,
                O.fromNullable,
                O.map(Format.formatZeroDigit),
                O.map((str) => `${str} USD`),
                O.toUndefined,
              )}
            >
              <WidgetTitle>total value secured</WidgetTitle>
              <AmountTrillionsUsdAnimated
                skeletonWidth="8rem"
                textClassName="text-2xl md:text-3xl xl:text-4xl"
              >
                {totalValueSecured?.sum}
              </AmountTrillionsUsdAnimated>
            </div>
            <div
              className="flex flex-col gap-y-4 md:items-end cursor-pointer"
              onClick={() => setShowSecurityRatioTooltip(true)}
            >
              <div className="flex items-center">
                <WidgetTitle>security ratio</WidgetTitle>
                <img className="ml-2" src="/nerd-coloroff.svg" alt="" />
              </div>
              <AmountAnimatedShell
                skeletonWidth="5rem"
                textClassName="text-2xl md:text-3xl xl:text-4xl"
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
          <WidgetTitle>per asset type</WidgetTitle>
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
            title="ERC20"
          />
          <AssetType
            amount={totalValueSecured?.nftTotal}
            href={"https://nftgo.io/overview"}
            icon="nft"
            title="NFT"
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
