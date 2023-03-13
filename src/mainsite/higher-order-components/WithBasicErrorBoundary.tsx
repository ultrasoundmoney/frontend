import type { FC } from "react";
import BasicErrorBoundary from "../../components/BasicErrorBoundary";

const withBasicErrorBoundary = function <A extends Record<string, unknown>>(
  Component: FC<A>,
): FC<A> {
  const WithBasicErrorBoundary = (props: A) => (
    <BasicErrorBoundary>{<Component {...props} />}</BasicErrorBoundary>
  );

  return WithBasicErrorBoundary;
};

export default withBasicErrorBoundary;
