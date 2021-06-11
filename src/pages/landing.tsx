import * as React from "react";
import { NextPage } from "next";
import Head from "next/head";
import Data from "../../locales/en/data.json";
import LandingPage from "../components/Landing";

type IndexPageProps = {};
const IndexPage: NextPage<IndexPageProps> = () => {
  return (
    <>
      <Head>
        <title>{Data.title}</title>
        <link rel="icon" href="/favicon.webp" />
        <meta name="description" content={Data.title} />
        <meta name="keywords" content={Data.meta_keywords} />
        <meta property="og:title" content={Data.title} />
        <meta property="og:description" content={Data.meta_description} />
        <meta property="og:image" content={Data.og_img} />
        <meta property="og:url" content={Data.og_url} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@ultrasoundmoney" />
      </Head>
      <LandingPage Data={Data} />
    </>
  );
};
export default IndexPage;
