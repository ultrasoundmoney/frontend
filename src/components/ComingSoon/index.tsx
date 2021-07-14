import * as React from "react";
import useSWR from "swr";
import EthBlocks from "../Blocks";
import CountDown from "../CountDown/index";
import TwitterCommunity from "../TwitterCommunity";
import EthLogo from "../../assets/ethereum-ultra-sound-bat.svg";
import FollowingYou from "../FollowingYou";
import SpanMoji from "../SpanMoji";
import SupplyView from "../SupplyView";
import { TranslationsContext } from "../../translations-context";

const fetcher = (url: string) =>
  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_blockNumber",
      params: [],
      id: 0,
    }),
  }).then((r) => r.json());

const ComingSoon: React.FC = () => {
  const t = React.useContext(TranslationsContext);
  const { data } = useSWR(
    "https://eth-mainnet.alchemyapi.io/v2/H74MQLJkSLBJDyaDS2kyH7bXIBvjiTVe",
    fetcher,
    {
      refreshInterval: 5000,
    }
  );
  const result = data && data.result;
  const currentBlockNumber = parseInt(result, 16);
  return (
    <div className="wrapper bg-blue-midnightexpress coming-soon">
      <div className="container m-auto">
        <div className="block w-full text-center pt-14">
          <img
            className="text-center m-auto mb-8"
            src={EthLogo}
            alt={t.title}
          />
          <h1 className="text-white font-extralight text-xl md:text-3xl xl:text-41xl text-center mb-16">
            <SpanMoji emoji="🔥 " />
            {t.main_title}
            <SpanMoji emoji=" 🔥" />
          </h1>
        </div>
        <div className="flex">
          <div className="w-full md:w-5/6 lg:w-3/6 md:m-auto pb-4">
            <CountDown targetDate="August 4, 2021" targetTime="15:00:00" />
          </div>
        </div>
        <div className="flex mb-16">
          <div className="w-full md:w-5/6 lg:w-3/6 md:m-auto px-4 md:px-0">
            <EthBlocks
              currentBlockNr={currentBlockNumber && currentBlockNumber}
            />
          </div>
        </div>
        <div className="flex flex-col px-4 md:px-0 md:pt-40 mb-16">
          <h1 className="text-white font-extralight text-2xl md:text-3xl xl:text-41xl text-center mb-4 mb-8">
            supply graph
          </h1>
          <p className="text-white text-center font-light text-base lg:text-lg mb-8">
            ready to discover the future of ETH?
          </p>
          <div className="w-full md:w-5/6 lg:w-5/6 md:m-auto relative bg-blue-tangaroa md:px-8 py-4 md:py-8 md:py-16 rounded-xl">
            <SupplyView />
          </div>
        </div>
        <div className="flex px-4 md:px-0 pt-8 md:pt-40 mb-16">
          <div className="w-full md:w-5/6 lg:w-2/3 md:m-auto relative">
            <TwitterCommunity />
          </div>
        </div>
        <div className="flex px-4 md:px-0">
          <div className="w-full md:w-5/6 lg:w-2/3 md:m-auto relative">
            <FollowingYou />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
