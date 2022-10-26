import * as Sentry from "@sentry/nextjs";
import type { StaticImageData } from "next/image";
import Image from "next/image";
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
          rounded-lg border border-red-400 bg-blue-tangaroa px-4 py-2 text-center
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

  const gradientCss =
    baseFeePerGasStats !== undefined && baseFeePerGas.wei > barrier
      ? "from-orange-400 to-yellow-300"
      : "from-cyan-300 to-indigo-500";

  return (
    <PriceGasBoundary>
      <div
        className={`
          flex items-center
          rounded bg-blue-tangaroa
          px-3 py-2
          text-xs
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
        <BaseText font="font-roboto" className="pl-1">
          {baseFeePerGas === undefined ? (
            <SkeletonText width="0.5rem" />
          ) : (
            <CountUp
              className={`bg-gradient-to-r bg-clip-text text-transparent ${gradientCss}`}
              decimals={0}
              duration={0.8}
              end={Format.gweiFromWei(baseFeePerGas.wei)}
              preserveValue
              separator=","
              start={Format.gweiFromWei(baseFeePerGas.wei)}
            />
          )}
          <AmountUnitSpace />
          <span className="font-extralight text-blue-spindle">Gwei</span>
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
        <BaseText font="font-roboto" className="pl-1">
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
          <span className="font-extralight text-blue-spindle">USD</span>
          <AmountUnitSpace />
          <span className={`${color}`}>
            (<SkeletonText width="2.5rem">{ethUsd24hChange}</SkeletonText>)
          </span>
        </BaseText>
      </div>
    </PriceGasBoundary>
  );
};

export default PriceGasWidget;
