import { useContext } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { TranslationsContext } from "../translations-context";
import Navigation from "../components/Navigation";
import BurnLeaderboard from "../components/BurnLeaderboard";

const DashboardPage: NextPage = () => {
  const t = useContext(TranslationsContext);

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
            <BurnLeaderboard unit={"eth"} />
          </div>
        </div>
      </div>
    </>
  );
};
export default DashboardPage;
