import { NextPage } from "next";
import Head from "next/head";
import Script from "next/script";
import "tailwindcss/tailwind.css";
import Home from "../components/Home";
import SiteMetadata from "../site-metadata";

// Could this be moved to one of Next's magical wrappers _app or _document?
export const SharedHead = () => (
  <Head>
    <title>ultrasound.money</title>
    <meta name="description" content={SiteMetadata.description} />
    <meta
      name="keywords"
      content="ultra sound money, ethereum, ETH, sound money, fee burn, EIP-1559"
    />
    <meta property="og:title" content={SiteMetadata.title} />
    <meta property="og:description" content={SiteMetadata.description} />
    <meta property="og:image" content={SiteMetadata.image} />
    <meta property="og:url" content="https://ultrasound.money" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:creator" content="@ultrasoundmoney" />
    <meta name="twitter:site" content="@ultrasoundmoney" />
    <link rel="icon" href="/favicon.png" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="apple-touch-icon" href="/favicon.png"></link>
    <meta name="theme-color" content="#131827" />
    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
  </Head>
);

const IndexPage: NextPage = () => (
  <>
    <SharedHead />
    <Script
      defer
      data-domain="ultrasound.money"
      src="https://plausible.io/js/plausible.js"
    ></Script>
    <Home />
  </>
);

export default IndexPage;
