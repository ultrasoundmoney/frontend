import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://3ef07f75a826463a94510b8d676fd7e3@o920717.ingest.sentry.io/5866579",
  enabled: process.env.NEXT_PUBLIC_ENV !== "dev",
  environment: process.env.NEXT_PUBLIC_ENV,
  tracesSampleRate: process.env.NEXT_PUBLIC_ENV === "prod" ? 0.1 : 1,
});
