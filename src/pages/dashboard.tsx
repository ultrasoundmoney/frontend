import { useState, useContext, FC } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { TranslationsContext } from "../translations-context";
import Navigation from "../components/Navigation";
import { intlFormat } from "../utils/number-utils";
// import useSWR from "swr";

type FeePeriod = "24h" | "week" | "month";

type DashboardPageProps = {};

const FeeUser: FC<{ name: string; fees: number; image: string }> = ({
  name,
  fees,
  image,
}) => {
  return (
    <div className="flex flex-row py-4 justify-between items-center">
      <div className="flex flex-row items-center overflow-hidden">
        <img className="w-8 h-8 bg-white" src={image} alt="" />
        <p className="font-inter font-light text-sm text-white pl-4 truncate md:text-lg">
          {name}
        </p>
      </div>
      <p className="font-inter font-light text-sm text-white ml-8 whitespace-nowrap md:text-lg">
        {intlFormat(fees)} <span className="text-blue-manatee">ETH</span>
      </p>
    </div>
  );
};

// const fetcher = (url: string) => fetch(url).then((res) => res.json());

type FeeUser = {
  name: string | undefined;
  address: string | undefined;
  image: string | undefined;
  fees: number;
};

const data: FeeUser[] = [
  {
    fees: 34.327563687930414,
    name: "contract creation",
    address: undefined,
    image: undefined,
  },
  {
    fees: 6.0340657204846035,
    name: "eth transfers",
    address: undefined,
    image: undefined,
  },
  {
    address: "0x4a0c59cccae7b4f0732a4a1b9a7bda49cc1d88f9",
    fees: 4.7835984269999985,
    image: undefined,
    name: undefined,
  },
  {
    address: "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
    fees: 3.390202023397285,
    image: undefined,
    name: undefined,
  },
  {
    address: "0xe592427a0aece92de3edee1f18e0157c05861564",
    fees: 3.3118619696657725,
    image: undefined,
    name: undefined,
  },
  {
    address: "0xa0d797a7f805b2eca06dd5680ee07edbbcdebc94",
    fees: 1.78495346,
    image: undefined,
    name: undefined,
  },
  {
    address: "0x7ed35d2d77ccc6c8c23ddf9d1b03fdd1e6597feb",
    fees: 1.076164999216379,
    image: undefined,
    name: undefined,
  },
  {
    address: "0x83b8a69a49e73a2b40bf62ff38b3ab3958b3b793",
    fees: 1.0478895599999947,
    image: undefined,
    name: undefined,
  },
  {
    address: "0xe0172ecc463ee52e1217d670ae9fa11037c1aef7",
    fees: 1.0397126,
    image: undefined,
    name: undefined,
  },
  {
    address: "0x516de3a7a567d81737e3a46ec4ff9cfd1fcb0136",
    fees: 0.9767422345962563,
    image: undefined,
    name: undefined,
  },
];
const error: undefined = undefined;

const DashboardPage: NextPage<DashboardPageProps> = () => {
  const t = useContext(TranslationsContext);
  const [feePeriod, setFeePeriod] = useState<FeePeriod>("24h");

  // const { data, error } = useSWR<FeeUser[], { msg: string }>(
  //   "https://api.ultrasound.money/fees/top-fee-users",
  //   fetcher
  // );

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
        <Navigation />
        <div className="container m-auto">
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
                  Burn Leaderboard
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
                      feePeriod === "week"
                        ? activeFeePeriodClasses
                        : "text-blue-manatee "
                    }`}
                    onClick={() => setFeePeriod("week")}
                  >
                    Week
                  </button>
                  <button
                    className={`font-inter text-sm px-4 py-1 border border-transparent ${
                      feePeriod === "month"
                        ? activeFeePeriodClasses
                        : "text-blue-manatee "
                    }`}
                    onClick={() => setFeePeriod("month")}
                  >
                    Month
                  </button>
                </div>
              </div>
              {error !== undefined && (
                <p className="text-lg text-center text-gray-500 text-center pt-18 pb-20">
                  error loading fees
                </p>
              )}
              {data !== undefined &&
                data.map((feeUser) => (
                  <FeeUser
                    key={feeUser.address || feeUser.name}
                    name={feeUser.name || feeUser.address}
                    image={feeUser.image}
                    fees={feeUser.fees}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DashboardPage;
