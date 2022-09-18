import * as Sentry from "@sentry/nextjs";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import type { FC, ReactNode } from "react";
import CountUp from "react-countup";
import type { BaseFeePerGas } from "../../api/base-fee-per-gas";
import type { EthPriceStats } from "../../api/eth-price-stats";
import * as Format from "../../format";
import { AmountUnitSpace } from "../Spacing";
import { TextRoboto } from "../Texts";
import ethSvg from "./eth-slateus.svg";
import gasSvg from "./gas-slateus.svg";

const PriceGasBoundary: FC<{ children: ReactNode }> = ({ children }) => (
  <Sentry.ErrorBoundary
    fallback={
      <div
        className={`
          px-4 py-2 rounded-lg font-roboto text-white text-xs text-center
          bg-blue-tangaroa
          border border-red-400
        `}
      >
        gas / price widget crashed
      </div>
    }
  >
    {children}
  </Sentry.ErrorBoundary>
);

type PriceGasWidgetProps = {
  baseFeePerGas: BaseFeePerGas;
  ethPriceStats: EthPriceStats;
  initialBaseFeePerGas: number;
  initialEthPrice: number;
};

const PriceGasWidget: FC<PriceGasWidgetProps> = ({
  baseFeePerGas,
  ethPriceStats,
  initialBaseFeePerGas,
  initialEthPrice,
}) => {
  const ethUsd24hChange = Format.formatPercentOneDecimalSigned(
    ethPriceStats.h24Change,
  );

  const color = ethPriceStats.h24Change < 0 ? "text-red-400" : "text-green-400";

  return (
    <PriceGasBoundary>
      <div
        className={`
          text-xs lg:text-sm
          flex items-center
          px-3 py-2
          bg-blue-tangaroa
          rounded
        `}
      >
        <div className="select-none flex items-center">
          <Image
            src={gasSvg as StaticImageData}
            alt="gas pump icon"
            width="14"
            height="14"
          />
        </div>
        <TextRoboto className="pl-1">
          <CountUp
            decimals={0}
            duration={0.8}
            separator=","
            start={Format.gweiFromWei(initialBaseFeePerGas)}
            end={Format.gweiFromWei(baseFeePerGas.wei)}
          />
          <AmountUnitSpace />
          <span className="font-extralight text-blue-spindle">Gwei</span>
        </TextRoboto>
        <div className="mr-4"></div>
        <div className="select-none flex items-center">
          <Image
            className="select-none"
            src={ethSvg as StaticImageData}
            alt="Ethereum Ether icon"
            width="14"
            height="14"
          />
        </div>
        <TextRoboto className="pl-1">
          <CountUp
            decimals={0}
            duration={0.8}
            separator=","
            start={initialEthPrice}
            end={ethPriceStats.usd}
          />
          <AmountUnitSpace />
          <span className="text-blue-spindle font-extralight">USD</span>
          <AmountUnitSpace />
          <span className={`${color}`}>({ethUsd24hChange})</span>
        </TextRoboto>
      </div>
    </PriceGasBoundary>
  );
};

export default PriceGasWidget;
