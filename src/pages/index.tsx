import { NextPage } from "next";
import Head from "next/head";
import * as React from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Colors from "../colors";
import ComingSoon from "../components/ComingSoon";
import { TranslationsContext } from "../translations-context";

type IndexPageProps = {};
const IndexPage: NextPage<IndexPageProps> = () => {
  const t = React.useContext(TranslationsContext);
  return (
    <>
      <Head>
        <title>{t.title}</title>
        <meta name="description" content={t.meta_description} />
        <meta name="keywords" content={t.meta_keywords} />
        <meta property="og:title" content={t.title} />
        <meta property="og:description" content={t.meta_description} />
        <meta property="og:image" content={t.og_img} />
        <meta property="og:url" content={t.og_url} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@ultrasoundmoney" />
        <link rel="icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/favicon.png"></link>
        <meta name="theme-color" content="#131827" />
        <script
          defer
          data-domain="ultrasound.money"
          src="https://plausible.io/js/plausible.js"
        ></script>
      </Head>
      <SkeletonTheme
        baseColor={Colors.dusk}
        highlightColor="#565b7f"
        enableAnimation={true}
      >
        <ComingSoon />
      </SkeletonTheme>
    </>
  );
};
export default IndexPage;
