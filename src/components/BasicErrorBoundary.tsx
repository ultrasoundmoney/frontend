import * as Sentry from "@sentry/nextjs";
import type { FC, ReactNode } from "react";

// Used for larger section of our app. Prefer smaller boundaries that make it
// obvious which part of the app crashed and let the rest functions as intended
// until the user fixes with a reload, or we fix with a deploy.
const BasicErrorBoundary: FC<{ children: ReactNode }> = ({ children }) => (
  <Sentry.ErrorBoundary
    fallback={
      <div className="flex flex-col justify-center text-slateus-400">
        <div className="m-16 mx-auto w-5/6 rounded-lg border border-red-400 bg-slateus-700 p-8 text-center font-roboto text-base font-light text-white">
          <p className="mb-4">An exception has occured 😱</p>
          <p className="mb-2">
            We&apos;re sorry, this should never happen! If you&apos;ve seen this
            before, or reloading doesn&apos;t fix it, you can help debug it by
            sending a screenshot to
            <a
              className="ml-2 cursor-pointer text-slateus-200 underline active:brightness-90"
              href="https://twitter.com/ultrasoundmoney/"
              rel="noreferrer"
              target="_blank"
            >
              @ultrasoundmoney
            </a>
            .
          </p>
        </div>
      </div>
    }
  >
    {children}
  </Sentry.ErrorBoundary>
);

export default BasicErrorBoundary;
