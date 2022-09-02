import type { StaticImageData } from "next/image";
import Image from "next/image";
import type { FC } from "react";
import { useContext } from "react";
import CountUp from "react-countup";
import Skeleton from "react-loading-skeleton";
import type { EthPrice } from "../../api/grouped-analysis-1";
import { FeatureFlagsContext } from "../../feature-flags";
import * as Format from "../../format";
import { AmountUnitSpace } from "../Spacing";
import { TextRoboto } from "../Texts";
import ethSvg from "./eth-slateus.svg";
import gasSvg from "./gas-slateus.svg";

let startGasPrice = 0;
let startGasPriceCached = 0;
let startEthPrice = 0;
let startEthPriceCached = 0;

type PriceGasWidgetProps = {
  baseFeePerGas: number | undefined;
  ethPrice: EthPrice | undefined;
};

const PriceGasWidget: FC<PriceGasWidgetProps> = ({
  baseFeePerGas,
  ethPrice,
}) => {
  if (baseFeePerGas && baseFeePerGas !== startGasPrice) {
    startGasPriceCached = startGasPrice;
    startGasPrice = baseFeePerGas;
  }

  if (ethPrice?.usd && ethPrice?.usd !== startEthPrice) {
    startEthPriceCached = startEthPrice;
    startEthPrice = ethPrice?.usd;
  }

  const ethUsd24hChange =
    ethPrice === undefined
      ? undefined
      : Format.formatPercentOneDecimalSigned(ethPrice.usd24hChange / 100);

  const color =
    typeof ethPrice?.usd24hChange === "number" && ethPrice?.usd24hChange < 0
      ? "text-red-400"
      : "text-green-400";

  const { previewSkeletons } = useContext(FeatureFlagsContext);

  return (
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
        {previewSkeletons || baseFeePerGas === undefined ? (
          <Skeleton width="17px" inline />
        ) : (
          <CountUp
            decimals={0}
            duration={0.8}
            separator=","
            start={
              startGasPriceCached === 0
                ? Format.gweiFromWei(baseFeePerGas)
                : Format.gweiFromWei(startGasPriceCached)
            }
            end={Format.gweiFromWei(baseFeePerGas)}
          />
        )}
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
        {ethPrice === undefined || previewSkeletons ? (
          <Skeleton width="42px" inline />
        ) : (
          <CountUp
            decimals={0}
            duration={0.8}
            separator=","
            start={
              startEthPriceCached === 0 ? ethPrice?.usd : startEthPriceCached
            }
            end={ethPrice?.usd}
          />
        )}
        <AmountUnitSpace />
        <span className="text-blue-spindle font-extralight">USD</span>
        <AmountUnitSpace />
        {ethUsd24hChange === undefined || previewSkeletons ? (
          <>
            (<Skeleton width="34px" inline />
            %)
          </>
        ) : (
          <span className={`${color}`}>({ethUsd24hChange})</span>
        )}
      </TextRoboto>
    </div>
  );
};

export default PriceGasWidget;
