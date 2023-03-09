import React from "react";
import Card from "./card";
import { weiToEth } from "../Helpers/helper";
import type { VidgetProps } from "./helpers";
import { convertToInternationalCurrencySystem } from "./helpers";
import type { EthPrice } from "../../api/grouped-analysis-1";
import { useGroupedAnalysis1 } from "../../api/grouped-analysis-1";
import useSWR from "swr";
import { fetchJsonSwr } from "../../api/fetchers";

const FouthVidget: React.FC<VidgetProps> = ({ name }) => {
  const feesBurned = useGroupedAnalysis1()?.feesBurned;

  const { data } = useSWR<EthPrice>(
    "https://api.ultrasound.money/fees/eth-price",
    fetchJsonSwr,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    },
  );

  const feeBurnedinEth =
    feesBurned !== undefined ? weiToEth(feesBurned.feesBurnedAll) : undefined;

  const getFeeBurdedinEthToUsd =
    feeBurnedinEth !== undefined &&
    data?.usd &&
    Math.floor(feeBurnedinEth * data?.usd);

  return (
    <Card name={name}>
      <div className="text-left font-roboto text-sm font-light text-white sm:text-base md:text-lg lg:text-base xl:text-21xl xl:leading-18">
        $
        {getFeeBurdedinEthToUsd
          ? convertToInternationalCurrencySystem(Number(getFeeBurdedinEthToUsd))
          : "2.63B"}
      </div>
    </Card>
  );
};

export default FouthVidget;
