import { useState, useContext, FC, memo } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { TranslationsContext } from "../translations-context";
import Navigation from "../components/Navigation";
import useSWR from "swr";
import dapp1Img from "../assets/dapps/dapp1.png";
import dapp2Img from "../assets/dapps/dapp2.png";
import dapp3Img from "../assets/dapps/dapp3.png";
import dapp4Img from "../assets/dapps/dapp4.png";
import dapp5Img from "../assets/dapps/dapp5.png";
import dapp6Img from "../assets/dapps/dapp6.png";
import dapp7Img from "../assets/dapps/dapp7.png";
import dapp8Img from "../assets/dapps/dapp8.png";
import dapp9Img from "../assets/dapps/dapp9.png";
import dapp10Img from "../assets/dapps/dapp10.png";
import dapp11Img from "../assets/dapps/dapp11.png";
import dapp12Img from "../assets/dapps/dapp12.png";
import dapp13Img from "../assets/dapps/dapp13.png";

let imgs = [
  dapp1Img,
  dapp2Img,
  dapp3Img,
  dapp4Img,
  dapp5Img,
  dapp6Img,
  dapp7Img,
  dapp8Img,
  dapp9Img,
  dapp10Img,
  dapp11Img,
  dapp12Img,
  dapp13Img,
];

type FeePeriod = "24h" | "7d" | "30d" | "all";

type DashboardPageProps = {};

const feeFmt = new Intl.NumberFormat("en", { minimumFractionDigits: 2 });

const FeeUser: FC<{
  name?: string;
  address?: string;
  fees: number;
  image: string;
}> = memo(({ address, name, fees, image }) => {
  if (imgs.length === 0) {
    imgs = [
      dapp1Img,
      dapp2Img,
      dapp3Img,
      dapp4Img,
      dapp5Img,
      dapp6Img,
      dapp7Img,
      dapp8Img,
      dapp9Img,
      dapp10Img,
      dapp11Img,
      dapp12Img,
      dapp13Img,
    ];
  }
  const rImg = imgs[Math.floor(Math.random() * imgs.length)];
  imgs = imgs.filter((img) => img !== rImg);
  return (
    <div className="flex flex-row py-4 justify-between items-center">
      <div className="flex flex-row items-center overflow-hidden">
        <img
          className="w-8 h-8 flex-shrink-0 bg-white rounded-full"
          src={rImg}
          alt=""
        />
        <p
          className={`text-sm text-white pl-4 truncate md:text-lg ${
            typeof name === "string" ? "font-inter font-light" : "font-roboto"
          }`}
        >
          {name || address}
        </p>
      </div>
      <p className="font-inter font-light text-sm text-white ml-8 whitespace-nowrap md:text-lg">
        {feeFmt.format(fees)} <span className="text-blue-manatee">ETH</span>
      </p>
    </div>
  );
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type FeeUser = {
  name: string | undefined;
  address: string | undefined;
  image: string | undefined;
  fees: number;
};

const DashboardPage: NextPage<DashboardPageProps> = () => {
  const t = useContext(TranslationsContext);
  const [feePeriod, setFeePeriod] = useState<FeePeriod>("24h");

  const { data, error } = useSWR<FeeUser[], { msg: string }>(
    `https://api.ultrasound.money/fees/leaderboard?timeframe=${feePeriod}`,
    fetcher
  );

  const activeFeePeriodClasses =
    "text-white border-blue-highlightborder rounded-sm bg-blue-highlightbg";

  return (
    <>
      <Head>
        <title>
          {t.dashboard_title} | {t.title}
        </title>
        <link rel="icon" href="/favicon.png" />
        <meta name="description" content={t.meta_description} />
        <meta name="keywords" content={t.meta_keywords} />
        <meta property="og:title" content={t.title} />
        <meta property="og:description" content={t.meta_description} />
        <meta property="og:image" content={t.og_img} />
        <meta property="og:url" content={t.og_url} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@ultrasoundmoney" />
      </Head>
      <div className="wrapper bg-blue-midnightexpress">
        <div
          style={{
            opacity: 0.2,
            filter: "blur(50px)",
            backgroundImage: "linear-gradient(to top, #f85a89, #0037fa)",
            margin: "-80px 0px 0px -32px",
          }}
          className="absolute border w-2/5 h-1/5 left-1/4 z-0"
        ></div>
        <Navigation />
        <div className="container m-auto relative">
          <h1 className="font-inter font-light text-white text-4xl text-center mb-8">
            Dashboard
          </h1>
          <p className="font-inter font-light text-blue-shipcove text-center px-4 mb-16">
            Section for brief historical events and and current ETH state to set
            the scene for Ultrasound money. Graphics, Light data and simple
            carts
          </p>
          <div className="w-full px-4">
            <div className="bg-blue-tangaroa w-full rounded-md p-8 md:p-16">
              <div className="flex flex-col md:justify-between md:items-center md:flex-row md:mb-10">
                <h2 className="font-inter font-light text-white text-xl mb-8 md:mb-0 md:text-2xl">
                  burn leaderboard
                </h2>
                <div className="flex flex-row items-center mx-auto mb-8 md:m-0">
                  <button
                    className={`font-inter text-sm px-4 py-1 border border-transparent ${
                      feePeriod === "24h"
                        ? activeFeePeriodClasses
                        : "text-blue-manatee "
                    }`}
                    onClick={() => setFeePeriod("24h")}
                  >
                    24h
                  </button>
                  <button
                    className={`font-inter text-sm px-4 py-1 border border-transparent ${
                      feePeriod === "7d"
                        ? activeFeePeriodClasses
                        : "text-blue-manatee"
                    }`}
                    onClick={() => setFeePeriod("7d")}
                  >
                    7d
                  </button>
                  <button
                    className={`font-inter text-sm px-4 py-1 border border-transparent ${
                      feePeriod === "30d"
                        ? activeFeePeriodClasses
                        : "text-blue-manatee"
                    }`}
                    onClick={() => setFeePeriod("30d")}
                  >
                    30d
                  </button>
                  <button
                    className={`font-inter text-sm px-4 py-1 border border-transparent ${
                      feePeriod === "all"
                        ? activeFeePeriodClasses
                        : "text-blue-manatee"
                    }`}
                    onClick={() => setFeePeriod("all")}
                  >
                    all
                  </button>
                </div>
              </div>
              {error !== undefined ? (
                <p className="text-lg text-center text-gray-500 pt-16 pb-20">
                  error loading fees
                </p>
              ) : data === undefined ? (
                <p className="text-lg text-center text-gray-500 pt-16 pb-20">
                  loading...
                </p>
              ) : (
                data.map((feeUser) => (
                  <FeeUser
                    key={feeUser.address || feeUser.name}
                    name={feeUser.name}
                    address={feeUser.address}
                    image={feeUser.image}
                    fees={feeUser.fees}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DashboardPage;
