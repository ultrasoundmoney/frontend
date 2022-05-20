import React from "react";
import Card from "./card";
import { weiToEth } from "../Helpers/helper";
import { VidgetProps, convertToInternationalCurrencySystem } from "./helpers";
import { EthPrice, useFeeData } from "../../api";
import useSWR from "swr";

const FouthVidget: React.FC<VidgetProps> = ({ name }) => {
  const { feesBurned } = useFeeData();
  const { data } = useSWR<EthPrice>(
    "https://api.ultrasound.money/fees/eth-price",
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );
  const feeBurnedinEth =
    feesBurned !== undefined ? weiToEth(feesBurned.feesBurnedAll) : undefined;

  const getFeeBurdedinEthToUsd =
    feeBurnedinEth !== undefined &&
    data?.usd &&
    Math.floor(feeBurnedinEth * data?.usd);

  return (
    <Card name={name}>
      <div className="text-sm sm:text-base md:text-lg lg:text-base xl:text-21xl xl:leading-18 font-light text-white text-left font-roboto">
        ${convertToInternationalCurrencySystem(Number(getFeeBurdedinEthToUsd))}
      </div>
    </Card>
  );
};

export default FouthVidget;
