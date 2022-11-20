import * as Sentry from "@sentry/nextjs";
import type { StaticImageData } from "next/legacy/image";
import Image from "next/legacy/image";
import type { FC, ReactNode } from "react";
import CountUp from "react-countup";
import { useBaseFeePerGas } from "../../api/base-fee-per-gas";
import { useBaseFeePerGasStats } from "../../api/base-fee-per-gas-stats";
import { useEthPriceStats } from "../../api/eth-price-stats";
import { WEI_PER_GWEI } from "../../eth-units";
import * as Format from "../../format";
import { AmountUnitSpace } from "../Spacing";
import { BaseText } from "../Texts";
import SkeletonText from "../TextsNext/SkeletonText";
import ethSvg from "./eth-slateus.svg";
import gasSvg from "./gas-slateus.svg";

const PriceGasBoundary: FC<{ children: ReactNode }> = ({ children }) => (
  <Sentry.ErrorBoundary
    fallback={
      <div
        className={`
          rounded-lg border border-red-400 bg-slateus-700 px-4 py-2 text-center
          font-roboto
          text-xs text-white
        `}
      >
        gas / price widget crashed
      </div>
    }
  >
    {children}
  </Sentry.ErrorBoundary>
);

const PriceGasWidget: FC = () => {
  const baseFeePerGas = useBaseFeePerGas();
  const baseFeePerGasStats = useBaseFeePerGasStats();
  const barrier = baseFeePerGasStats.barrier * WEI_PER_GWEI;
  const ethPriceStats = useEthPriceStats();
  const ethUsd24hChange =
    ethPriceStats === undefined
      ? undefined
      : Format.formatPercentOneDecimalSigned(ethPriceStats.h24Change);

  const color =
    ethPriceStats === undefined
      ? undefined
      : ethPriceStats.h24Change < 0
      ? "text-red-400"
      : "text-green-400";

  const gweiColor =
    baseFeePerGasStats !== undefined && baseFeePerGas.wei > barrier
      ? "text-orange-400"
      : "text-blue-400";

  return (
    <PriceGasBoundary>
      <div
        className={`
          flex items-center
          rounded bg-slateus-700
          px-3 py-2
          text-xs
          font-normal
          lg:text-sm
        `}
      >
        <div className="flex select-none items-center">
          <Image
            src={gasSvg as StaticImageData}
            alt="gas pump icon"
            width="14"
            height="14"
            priority
          />
        </div>
        <BaseText font="font-roboto" weight="font-normal" className="pl-1">
          {baseFeePerGas === undefined ? (
            <SkeletonText width="0.5rem" />
          ) : (
            <CountUp
              className={gweiColor}
              decimals={0}
              duration={0.8}
              end={Format.gweiFromWei(baseFeePerGas.wei)}
              preserveValue
              separator=","
              start={Format.gweiFromWei(baseFeePerGas.wei)}
            />
          )}
          <AmountUnitSpace />
          <BaseText
            font="font-roboto"
            color="text-slateus-400"
            weight="font-normal"
          >
            Gwei
          </BaseText>
        </BaseText>
        <div className="mr-4"></div>
        <div className="flex select-none items-center">
          <Image
            className="select-none"
            src={ethSvg as StaticImageData}
            alt="Ethereum Ether icon"
            width="14"
            height="14"
            priority
          />
        </div>
        <BaseText font="font-roboto" className="pl-1" weight="font-normal">
          {ethPriceStats === undefined ? (
            <SkeletonText width="2.65rem" />
          ) : (
            <CountUp
              decimals={0}
              duration={0.8}
              end={ethPriceStats.usd}
              preserveValue
              separator=","
              start={ethPriceStats.usd}
            />
          )}
          <AmountUnitSpace />
          <BaseText
            font="font-roboto"
            color="text-slateus-400"
            weight="font-normal"
          >
            USD
          </BaseText>
          <AmountUnitSpace />
          <BaseText
            font="font-roboto"
            weight="font-normal"
            className={`${color}`}
          >
            (<SkeletonText width="2.5rem">{ethUsd24hChange}</SkeletonText>)
          </BaseText>
        </BaseText>
      </div>
    </PriceGasBoundary>
  );
};

export default PriceGasWidget;
