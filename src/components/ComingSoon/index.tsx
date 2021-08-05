import * as React from "react";
import TwitterCommunity from "../TwitterCommunity";
import FollowingYou from "../FollowingYou";
import SupplyView from "../SupplyView";
import { TranslationsContext } from "../../translations-context";
import BurnLeaderboard from "../BurnLeaderboard";
import TotalFeeBurn from "../TotalFeeBurn";
import LatestBlocks, { useBlockHistory } from "../LatestBlocks";
import FaqBlock from "../Landing/faq";
import useSWR from "swr";
import noFullWingsPoster from "../../assets/no-full-wings.jpg";
import twemoji from "twemoji";
import Link from "next/link";
import EthLogo from "../../assets/ethereum-logo-2014-5.svg";
import _ from "lodash";
import { weiToGwei } from "../../utils/metric-utils";

const ComingSoon: React.FC = () => {
  const t = React.useContext(TranslationsContext);
  const latestBlocks = useBlockHistory();
  const { data } = useSWR(
    "https://api.ultrasound.money/fees/eth-price",
    (url: string) => fetch(url).then((r) => r.json()),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );
  const ethUsdPrice = data?.usd;
  const ethUsd24hChange = data?.usd24hChange?.toFixed(2);
  const baseFeePerGas = _.last(latestBlocks)?.baseFeePerGas;
  const ethPrice = `$${ethUsdPrice} <span class="px-1 text-green-400">(+${ethUsd24hChange}%)</span> • ⛽️${weiToGwei(
    baseFeePerGas
  ).toFixed(1)} Gwei</span>`;

  return (
    <div className="wrapper bg-blue-midnightexpress">
      <div className="container m-auto coming-soon">
        <div className="w-full md:w-5/12 relative flex justify-start lg:static lg:justify-start p-4">
          <div className="pr-2 lg:pr-8">
            <Link href="/">
              <img className="max-w-max" src={EthLogo} alt={t.title} />
            </Link>
          </div>
          {ethUsdPrice !== undefined && baseFeePerGas !== undefined && (
            <div
              className="flex-initial flex text-white self-center bg-blue-tangaroa px-2 md:px-3 py-2 text-xs lg:text-sm eth-price-gass-emoji font-roboto"
              dangerouslySetInnerHTML={{
                __html: twemoji.parse(ethPrice),
              }}
            />
          )}
        </div>

        <div
          className={`ultra-sound-text w-full pt-16 text-6xl md:text-7xl md:w-1/2 lg:w-5/6 lg:pt-16 m-auto mb-8`}
        >
          ultra sound awakening
        </div>
        <p className="font-inter text-xl md:text-2xl lg:text-3xl text-white text-center mb-16">
          track ETH become ultra sound
        </p>
        <div className="w-full">
          <video
            className="w-full md:w-4/6 lg:w-3/6 mx-auto mb-8 pr-4 -mt-24 mix-blend-lighten"
            playsInline
            autoPlay
            muted
            loop
            poster={noFullWingsPoster}
          >
            <source src="/no-full-wings.mp4" type="video/mp4" />
            <source src="/no-full-wings.webm" type="video/webm" />
            <source src="/no-full-wings.ogv" type="video/ogg" />
          </video>
        </div>
        <div className="flex flex-col px-4 md:w-5/6 mx-auto lg:w-full lg:flex-row lg:px-16">
          <div className="lg:w-1/2">
            <div className="md:pt-20 mb-4">
              <TotalFeeBurn />
            </div>
            <div className="mb-4">
              <LatestBlocks />
            </div>
          </div>
          <div className="lg:w-1/2 lg:pt-20 lg:pl-4">
            <BurnLeaderboard />
          </div>
        </div>
        <div className="flex flex-col px-4 md:px-2 pt-40 mb-16">
          <h1 className="text-white font-light text-center text-2xl md:text-3xl xl:text-41xl mb-8">
            {t.teaser_supply_title}
          </h1>
          <p className="text-white text-center font-light text-base lg:text-lg mb-8">
            {t.teaser_supply_subtitle}
          </p>
          <div className="w-full lg:w-5/6 md:m-auto relative bg-blue-tangaroa px-2 md:px-4 xl:px-12 py-4 md:py-8 xl:py-12 rounded-xl">
            <SupplyView />
          </div>
          <div className="flex px-4 md:px-0 pt-8 pt-40 mb-16">
            <div className="w-full md:w-5/6 lg:w-2/3 md:m-auto relative">
              <TwitterCommunity />
            </div>
          </div>
          <div className="flex px-4 md:px-0 pt-20 pb-40">
            <div className="w-full md:w-5/6 lg:w-2/3 md:m-auto relative">
              <FollowingYou />
            </div>
          </div>
          <div className="flex px-4 md:px-0 pt-20 pb-60">
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
