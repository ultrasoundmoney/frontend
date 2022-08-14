import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import styles from "./tailwind.css";
import { useEffect, useState } from "react";

const title = "Ultra Sound Money";
const description = "watch ETH become ultra sound money";
const image = "https://ultrasound.money/og-image.png";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title,
  viewport: "width=device-width,initial-scale=1",
  description,
  image,
  keywords:
    "ultra sound money,ethereum,ETH,sound money, fee burn,EIP-1559,crypto,economics",
  // {/* When Justin shares the site on twitter, twitter adds our metadata, this adds little value, so Justin removes it. To not spend a lot of time removing our metadata from every shared link we're disabling twitter metadata for now. */}
  "og:title": title,
  "og:description": description,
  "og:image": image,
  "og:url": "https://ultrasound.money",
  "theme-color": "#131827",
});

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@100;200;300;400&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500&display=swap",
  },
  {
    rel: "icon",
    href: "/favicon.png",
  },
  { rel: "manifest", href: "/manifest.json" },
  { rel: "apple-touch-icon", href: "/favicon.png" },
];

type Env = "dev" | "prod" | "staging";
const getEnv = (): Env => {
  const rawEnv = process.env.ENV;

  switch (rawEnv) {
    case "prod":
      return "prod";
    case "dev":
      return "dev";
    case "staging":
      return "staging";
    case "stag":
      return "staging";
    default:
      console.warn("no ENV in env, defaulting to dev");
      return "dev";
  }
};

export const loader: LoaderFunction = () => {
  const ENVIRONMENT_VARIABLES: EnvironmentVariables = {
    ENV: getEnv(),
  };
  return json({ ENVIRONMENT_VARIABLES });
};

export default function App() {
  const [env, setEnv] = useState<Env>();
  const data = useLoaderData();

  useEffect(() => {
    Sentry.init({
      dsn: "https://3ef07f75a826463a94510b8d676fd7e3@o920717.ingest.sentry.io/5866579",
      enabled: window.ENVIRONMENT_VARIABLES.ENV !== "dev",
      environment: window.ENVIRONMENT_VARIABLES.ENV,
      integrations: [new BrowserTracing()],
      tracesSampleRate:
        window.ENVIRONMENT_VARIABLES.ENV === "staging" ? 1 : 0.1,
    });
  }, []);

  useEffect(() => {
    setEnv(window.ENVIRONMENT_VARIABLES.ENV);
  }, []);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        {/* This serves our Plausible analytics script. We use cloudflare workers to make this possible. The name is intentionally vague as suggested in the Plausible docs. */}
        {env !== undefined && env !== "dev" ? (
          <script
            defer
            data-domain="ultrasound.money"
            data-api="/cfw/event"
            src="/cfw/script.js"
          />
        ) : null}
      </head>
      <body className="bg-slateus-800">
        <Outlet />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENVIRONMENT_VARIABLES = ${JSON.stringify(
              data.ENVIRONMENT_VARIABLES,
            )}`,
          }}
        />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
