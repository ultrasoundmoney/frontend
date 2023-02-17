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
          <link rel="icon" href="/favicon.png" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/favicon.png"></link>
          <meta name="theme-color" content="#131827" />
          <meta property="og:image" content={SiteMetadata.image} />
        </Head>
        <body className="bg-slateus-800 text-slateus-200 [&_.next-error-h1]:border-slateus-200">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
