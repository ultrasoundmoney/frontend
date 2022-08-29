import * as Sentry from "@sentry/react";
import type { FC, ReactNode } from "react";

const BasicErrorBoundary: FC<{ children: ReactNode }> = ({ children }) => (
  <Sentry.ErrorBoundary
    fallback={
      <div
        className={`
          w-5/6 m-auto p-8 rounded-lg font-roboto text-white text-base text-center
          border border-red-400
        `}
      >
        an error occured we did not foresee, if this does not change soon,
        please tell us!
      </div>
    }
  >
    {children}
  </Sentry.ErrorBoundary>
);

export default BasicErrorBoundary;
