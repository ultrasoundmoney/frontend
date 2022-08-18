import * as Sentry from "@sentry/nextjs";
import { BrowserTracing } from "@sentry/tracing";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import "tailwindcss/tailwind.css";

Sentry.init({
  dsn: "https://3ef07f75a826463a94510b8d676fd7e3@o920717.ingest.sentry.io/5866579",
  enabled: process.env.ENV !== "dev",
  environment: process.env.ENV,
  integrations: [new BrowserTracing()],
  tracesSampleRate: process.env.ENV === "stag" ? 1 : 0.1,
});

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <SessionProvider session={(pageProps as { session: Session }).session}>
      <Component {...pageProps} />
    </SessionProvider>
  </>
);
export default MyApp;
