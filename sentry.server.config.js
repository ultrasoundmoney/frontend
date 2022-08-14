import * as Sentry from "@sentry/nextjs";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: "https://3ef07f75a826463a94510b8d676fd7e3@o920717.ingest.sentry.io/5866579",
  enabled: process.env.ENV !== "dev",
  environment: process.env.ENV,
  integrations: [new BrowserTracing()],
  tracesSampleRate: process.env.ENV === "stag" ? 1 : 0.1,
});
