import * as React from "react";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
// const LandingPage = dynamic(() => import("../components/Landing"));
const LandingPage = dynamic(() => import("../components/Landing/landing"));
import { TranslationsContext } from "../translations-context";

type IndexPageProps = {};
const IndexPage: NextPage<IndexPageProps> = () => {
  const t = React.useContext(TranslationsContext);
  return (
    <>
      <Head>
        <title>{t.title}</title>
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
      <LandingPage />
    </>
  );
};
export default IndexPage;
