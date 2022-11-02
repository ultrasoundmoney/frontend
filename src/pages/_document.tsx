import * as React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import SiteMetadata from "../site-metadata";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@100;200;300;400&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500&display=swap"
            rel="stylesheet"
          />
          <meta name="description" content={SiteMetadata.description} />
          <meta
            name="keywords"
            content="ultra sound money, ethereum, ETH, sound money, fee burn, EIP-1559"
          />
          {/* When sharing the site on twitter, twitter adds our metadata, this adds little value, so we remove it. To not spend a lot of time removing our metadata from every shared link we're disabling twitter metadata for now. */}
          <meta property="og:title" content={SiteMetadata.title} />
          <meta property="og:description" content={SiteMetadata.description} />
          <meta property="og:image" content={SiteMetadata.image} />
          <meta property="og:url" content="https://ultrasound.money" />
          <link rel="icon" href="/favicon.png" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/favicon.png"></link>
          <meta name="theme-color" content="#131827" />
          {/* This serves our Plausible analytics script. We use cloudflare workers to make this possible. The name is intentionally vague as suggested in the Plausible docs. */}
          <script
            defer
            data-domain="ultrasound.money"
            data-api="https://ultrasound.money/cfw/event"
            src="https://ultrasound.money/cfw/script.js"
          />
        </Head>
        <body className="bg-blue-midnightexpress [&_.next-error-h1]:border-slateus-200 text-slateus-200">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
