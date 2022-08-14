import type { FC } from "react";
import React, { useContext } from "react";
import CountUp from "react-countup";
import Skeleton from "react-loading-skeleton";
import type { EthPrice } from "../api/grouped-analysis-1";
import { FeatureFlagsContext } from "../feature-flags";
import * as Format from "../format";
import { O, pipe } from "../fp";
import { AmountUnitSpace } from "./Spacing";
import { TextRoboto } from "./Texts";

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

  const ethUsd24hChange = pipe(
    ethPrice?.usd24hChange,
    O.fromNullable,
    O.map((num) => num / 100),
    O.map(Format.formatPercentOneDecimalSigned),
    O.toUndefined,
  );

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
      <img
        className="select-none"
        src="/gas-icon.svg"
        alt="gas pump icon"
        width="13"
        height="14"
      />
      <TextRoboto className="pl-1">
        {baseFeePerGas === undefined || previewSkeletons ? (
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
      <img
        className="select-none"
        src="/eth-icon.svg"
        alt="Ethereum Ether icon"
        width="11"
        height="16"
      />
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
