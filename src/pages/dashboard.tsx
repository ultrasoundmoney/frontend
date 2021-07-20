import * as React from "react";
import { NextPage } from "next";
import Head from "next/head";
import { TranslationsContext } from "../translations-context";
import Dashboard from "../components/Dashboard";

type DashboardPageProps = {};
const DashboardPage: NextPage<DashboardPageProps> = () => {
  const t = React.useContext(TranslationsContext);
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
      <Dashboard />
    </>
  );
};
export default DashboardPage;
