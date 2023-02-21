import type { FC } from "react";
import WidgetErrorBoundary from "../components/WidgetErrorBoundary";

const withWidgetErrorBoundary = function <A extends Record<string, unknown>>(
  title: string,
  Component: FC<A>,
): FC<A> {
  const WithWidgetErrorBoundary = (props: A) => (
    <WidgetErrorBoundary title={title}>
      {<Component {...props} />}
    </WidgetErrorBoundary>
  );

  return WithWidgetErrorBoundary;
};

export default withWidgetErrorBoundary;
