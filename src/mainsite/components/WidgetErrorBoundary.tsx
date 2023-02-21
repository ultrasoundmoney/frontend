import * as Sentry from "@sentry/nextjs";
import type { FC, ReactNode } from "react";
import ErrorWidget from "./ErrorWidget";

type Props = { children: ReactNode; title: string };

const WidgetErrorBoundary: FC<Props> = ({ children, title }) => (
  <Sentry.ErrorBoundary fallback={<ErrorWidget title={title} />}>
    {children}
  </Sentry.ErrorBoundary>
);

export default WidgetErrorBoundary;
