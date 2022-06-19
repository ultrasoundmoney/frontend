import React, { useContext } from "react";
import Link from "next/link";
import CountUp from "react-countup";
import EthLogo from "../../assets/ethereum-logo-2014-5.svg";
import { TranslationsContext } from "../../translations-context";
import { useGroupedStats1 } from "../../api/grouped-stats-1";
import { formatPercentOneDigitSigned } from "../../format";
import { weiToGwei } from "../../utils/metric-utils";

import SpanMoji from "../SpanMoji";

let startGasPrice = 0;
let startGasPriceCached = 0;
let startEthPrice = 0;
let startEthPriceCached = 0;

const GweiDynamicBlock: React.FC = () => {
  const t = useContext(TranslationsContext);
  const ethPrices = useGroupedStats1()?.ethPrice;
  const baseFeePerGas = useGroupedStats1()?.baseFeePerGas;
  const ethUsd24hChange =
    ethPrices?.usd24hChange &&
    formatPercentOneDigitSigned(ethPrices?.usd24hChange / 100);
  const color =
    typeof ethPrices?.usd24hChange === "number" && ethPrices?.usd24hChange < 0
      ? "text-red-400"
      : "text-green-400";

  if (baseFeePerGas && baseFeePerGas !== startGasPrice) {
    startGasPriceCached = startGasPrice;
    startGasPrice = baseFeePerGas;
  }
  if (ethPrices?.usd && ethPrices?.usd !== startEthPrice) {
    startEthPriceCached = startEthPrice;
    startEthPrice = ethPrices?.usd;
  }
  return (
    <div className="w-full flex justify-between md:justify-start p-4">
      <div className="hidden md:block">
        <Link href="/">
          <img className="relative" src={EthLogo.src} alt={t.title} />
        </Link>
      </div>
      {ethPrices !== undefined && baseFeePerGas !== undefined && (
        <div className="flex text-white self-center rounded bg-blue-tangaroa px-3 py-2 text-xs lg:text-sm font-roboto md:ml-4">
          $
          <CountUp
            decimals={0}
            duration={0.8}
            separator=","
            start={
              startEthPriceCached === 0 ? ethPrices?.usd : startEthPriceCached
            }
            end={ethPrices?.usd}
          />
          <span className={`px-1 ${color}`}>({ethUsd24hChange})</span>
          <span className="px-1">•</span>
          <SpanMoji className="px-0.5" emoji="⛽️"></SpanMoji>
          <span className="">
            <CountUp
              decimals={0}
              duration={0.8}
              separator=","
              start={
                startGasPriceCached === 0
                  ? weiToGwei(baseFeePerGas)
                  : weiToGwei(startGasPriceCached)
              }
              end={weiToGwei(baseFeePerGas)}
            />{" "}
            <span className="font-extralight text-blue-spindle">Gwei</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default GweiDynamicBlock;
