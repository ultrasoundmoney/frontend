import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import "tailwindcss/tailwind.css";
import { env } from "../config";

Sentry.init({
  dsn: "https://3ef07f75a826463a94510b8d676fd7e3@o920717.ingest.sentry.io/5866579",
  enabled: process.env.ENV !== "dev",
  environment: process.env.ENV,
  integrations: [new BrowserTracing()],
  tracesSampleRate: process.env.ENV === "staging" ? 1 : 0.1,
});

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      {/* This serves our Plausible analytics script. We use cloudflare workers to make this possible. */}
      {env !== "dev" ? (
        <Script
          defer
          data-domain="ultrasound.money"
          data-api="/cfw/event"
          src="/cfw/script.js"
        />
      ) : null}
    </Head>
    <Component {...pageProps} />
  </>
);
export default MyApp;
