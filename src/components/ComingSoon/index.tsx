import * as React from "react";
import useSWR from "swr";
import EthBlocks from "../Blocks";
import CountDown from "../CountDown/index";
import TwitterCommunity from "../TwitterCommunity";
import EthLogo from "../../assets/ethereum-ultra-sound-bat.svg";

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

const ComingSoon: React.FC<{ Data?: Data }> = ({ Data }) => {
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
    <>
      <div className="wrapper bg-blue-midnightexpress coming-soon">
        <div className="container m-auto">
          <div className="block w-full text-center pt-14">
            <img
              className="text-center m-auto mb-8"
              src={EthLogo}
              alt={Data.title}
            />
            <h1 className="text-white font-extralight text-2xl md:text-3xl xl:text-41xl text-center mb-16">
              {Data.main_title}
            </h1>
          </div>
          <div className="flex">
            <div className="w-full md:w-5/6 lg:w-3/6 md:m-auto pb-4">
              <CountDown targetDate="July 28, 2021" targetTime="00:00:00" />
            </div>
          </div>
          <div className="flex">
            <div className="w-full md:w-5/6 lg:w-3/6 md:m-auto px-4 md:px-0">
              <EthBlocks
                Data={Data}
                currentBlockNr={currentBlockNumber && currentBlockNumber}
              />
            </div>
          </div>
          <div className="flex px-4 md:px-0 py-8 md:py-40">
            <div className="w-full md:w-5/6 lg:w-2/3 md:m-auto">
              <TwitterCommunity Data={Data} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComingSoon;
