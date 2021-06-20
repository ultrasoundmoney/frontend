import * as React from "react";
import { NextPage } from "next";
import Head from "next/head";
import Data from "../../locales/en/data.json";
import ComingSoon from "../components/ComingSoon";

type IndexPageProps = {};
const IndexPage: NextPage<IndexPageProps> = () => {
  return (
    <>
      <Head>
        <title>{Data.title}</title>
        <meta httpEquiv="cache-control" content="max-age=0" />
        <meta httpEquiv="cache-control" content="no-cache" />
        <meta httpEquiv="expires" content="0" />
        <meta httpEquiv="pragma" content="no-cache" />
        <meta name="description" content={Data.title} />
        <meta name="keywords" content={Data.meta_keywords} />
        <meta property="og:title" content={Data.title} />
        <meta property="og:description" content={Data.meta_description} />
        <meta property="og:image" content={Data.og_img} />
        <meta property="og:url" content={Data.og_url} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@ultrasoundmoney" />
        <link rel="icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/favicon.png"></link>
        <meta name="theme-color" content="#131827" />
      </Head>
      <ComingSoon Data={Data} />
    </>
  );
};
export default IndexPage;
