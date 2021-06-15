import * as React from "react";
import { NextPage } from "next";
import Head from "next/head";
import Data from "../../locales/en/data.json";
import Dashboard from "../components/Dashboard";

type DashboardPageProps = {};
const DashboardPage: NextPage<DashboardPageProps> = () => {
  return (
    <>
      <Head>
        <title>
          {Data.dashboard_title} | {Data.title}
        </title>
        <link rel="icon" href="/favicon.png" />
        <meta name="description" content={Data.title} />
        <meta name="keywords" content={Data.meta_keywords} />
        <meta property="og:title" content={Data.title} />
        <meta property="og:description" content={Data.meta_description} />
        <meta property="og:image" content={Data.og_img} />
        <meta property="og:url" content={Data.og_url} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@ultrasoundmoney" />
      </Head>
      <Dashboard Data={Data} />
    </>
  );
};
export default DashboardPage;
