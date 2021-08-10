import * as React from "react";
import TwitterCommunity from "../TwitterCommunity";
import FollowingYou from "../FollowingYou";
import SupplyView from "../SupplyView";
import { TranslationsContext } from "../../translations-context";
import BurnLeaderboard from "../BurnLeaderboard";
import CumulativeFeeBurn from "../CumulativeFeeBurn";
import LatestBlocks from "../LatestBlocks";
import FaqBlock from "../Landing/faq";
import useSWR from "swr";
import Link from "next/link";
import EthLogo from "../../assets/ethereum-logo-2014-5.svg";
import { weiToGwei } from "../../utils/metric-utils";
import SpanMoji from "../SpanMoji";
import useFeeData from "../../use-fee-data";

type EthPrice = {
  usd: number;
  usd24hChange: number;
  btc: number;
  btc24hChange: number;
};

const ethPriceFormatter = new Intl.NumberFormat("en-US", {
  currency: "usd",
  style: "currency",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const percentChangeFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  signDisplay: "always",
  style: "percent",
});

const ComingSoon: React.FC = () => {
  const t = React.useContext(TranslationsContext);
  const { baseFeePerGas } = useFeeData();
  const { data } = useSWR<EthPrice>(
    "https://api.ultrasound.money/fees/eth-price",
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  const ethUsdPrice = data?.usd && ethPriceFormatter.format(data?.usd);
  const ethUsd24hChange =
    data?.usd24hChange &&
    percentChangeFormatter.format(data?.usd24hChange / 100);
  const color =
    typeof data?.usd24hChange === "number" && data?.usd24hChange < 0
      ? "text-red-400"
      : "text-green-400";

  return (
    <div className="wrapper bg-blue-midnightexpress">
      <div className="container m-auto coming-soon">
        <div className="flex justify-between">
          <div className="w-full flex justify-between md:justify-start p-4">
            <Link href="/">
              <img className="relative" src={EthLogo} alt={t.title} />
            </Link>
            {data !== undefined && baseFeePerGas !== undefined && (
              <div className="flex text-white self-center rounded bg-blue-tangaroa px-3 py-2 text-xs lg:text-sm eth-price-gass-emoji font-roboto md:ml-4">
                {ethUsdPrice}
                <span className={`px-1 ${color}`}>({ethUsd24hChange})</span>
                <span className="px-1">•</span>
                <SpanMoji emoji="⛽️"></SpanMoji>
                {weiToGwei(baseFeePerGas).toFixed(1)} Gwei
              </div>
            )}
          </div>
          <a
            className="hidden md:block flex self-center whitespace-nowrap px-4 py-1 mr-4 font-medium text-white hover:text-blue-shipcove border-white border-solid border-2 rounded-3xl hover:border-blue-shipcove"
            href="#join-the-fam"
          >
            join the fam
          </a>
        </div>
        <div
          className={`ultra-sound-text w-full pt-16 text-6xl md:text-7xl md:w-1/2 lg:w-5/6 lg:pt-16 m-auto mb-8`}
        >
          ultra sound awakening
        </div>
        <p className="font-inter text-blue-shipcove text-xl md:text-2xl lg:text-3xl text-white text-center mb-16">
          track ETH become ultra sound
        </p>
        <video
          className="w-full md:w-3/6 lg:w-2/6 mx-auto -mt-32 -mb-4 mix-blend-lighten"
          playsInline
          autoPlay
          muted
          loop
          poster="/bat-no-wings.png"
        >
          <source src="/bat-no-wings.webm" type="video/webm; codecs='vp9'" />
          <source src="/bat-no-wings.mp4" type="video/mp4" />
        </video>
        {/* <video */}
        {/*   className="absolute left-0 -ml-24 top-8 md:top-128 lg:top-96 opacity-40 mix-blend-lighten" */}
        {/*   playsInline */}
        {/*   autoPlay */}
        {/*   muted */}
        {/*   loop */}
        {/*   poster="/moving-orbs.jpg" */}
        {/* > */}
        {/*   <source src="/moving-orbs.mp4" type="video/mp4" /> */}
        {/*   <source src="/moving-orbs.webm" type="video/webm; codecs='vp9'" /> */}
        {/* </video> */}
        <div className="flex flex-col px-4 md:w-5/6 mx-auto lg:w-full lg:flex-row lg:px-16 isolate">
          <div className="lg:w-1/2">
            <CumulativeFeeBurn />
            <span className="block w-4 h-4" />
            <LatestBlocks />
          </div>
          <span className="block w-4 h-4" />
          <div className="lg:w-1/2">
            <BurnLeaderboard />
          </div>
        </div>
        <div className="flex flex-col px-4 md:px-16 pt-40 mb-16">
          <h1 className="text-white font-light text-center text-2xl md:text-3xl xl:text-41xl mb-8">
            {t.teaser_supply_title}
          </h1>
          <p className="text-blue-shipcove text-center font-light text-base lg:text-lg mb-8">
            {t.teaser_supply_subtitle}
          </p>
          <div className="w-full md:m-auto relative bg-blue-tangaroa px-2 md:px-4 xl:px-12 py-4 md:py-8 xl:py-12 rounded-xl">
            <SupplyView />
          </div>
          <div
            id="join-the-fam"
            className="relative flex px-4 md:px-0 pt-8 pt-40 mb-16"
          >
            <div className="w-full md:w-5/6 lg:w-2/3 md:m-auto relative flex flex-col items-center">
              {/* <video */}
              {/*   className="absolute w-1/2 right-0 -mt-16 opacity-40 mix-blend-lighten" */}
              {/*   playsInline */}
              {/*   autoPlay */}
              {/*   muted */}
              {/*   loop */}
              {/*   poster="/bat-no-wings.png" */}
              {/* > */}
              {/*   <source */}
              {/*     src="/moving-orbs.webm" */}
              {/*     type="video/webm; codecs='vp9'" */}
              {/*   /> */}
              {/*   <source src="/moving-orbs.mp4" type="video/mp4" /> */}
              {/* </video> */}
              <TwitterCommunity />
            </div>
          </div>
          <div className="flex px-4 md:px-0 pt-20 pb-20">
            <div className="w-full md:w-5/6 lg:w-2/3 md:m-auto relative">
              <FollowingYou />
            </div>
          </div>
          <div className="flex px-4 md:px-0 pt-8 pb-60">
            <div className="w-full md:w-5/6 lg:w-2/3 md:m-auto relative">
              <FaqBlock />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
