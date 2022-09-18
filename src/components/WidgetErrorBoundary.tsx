import * as Sentry from "@sentry/nextjs";
import type { FC, ReactNode } from "react";
import ErrorWidget from "./ErrorWidget";

const WidgetErrorBoundary: FC<{ children: ReactNode; title?: string }> = ({
  children,
  title = "unexpected error",
}) => (
  <Sentry.ErrorBoundary fallback={<ErrorWidget title={title} />}>
    {children}
  </Sentry.ErrorBoundary>
);

export default WidgetErrorBoundary;
