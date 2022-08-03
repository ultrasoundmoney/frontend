import { NextPage } from "next";
import Head from "next/head";
import Script from "next/script";
import * as React from "react";
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
    {/* When Justin shares the site on twitter, twitter adds our metadata, this adds little value, so Justin removes it. To not spend a lot of time removing our metadata from every shared link we're disabling twitter metadata for now. */}
    <meta property="og:title" content={SiteMetadata.title} />
    <meta property="og:description" content={SiteMetadata.description} />
    <meta property="og:image" content={SiteMetadata.image} />
    <meta property="og:url" content="https://ultrasound.money" />
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
    {/* This serves our Plausible analytics script. We use cloudflare workers to make this possible. */}
    <Script
      defer
      data-domain="ultrasound.money"
      data-api="/cfw/event"
      src="/cfw/script.js"
    />
    <Home />
  </>
);

export default IndexPage;
