import type { FC } from "react";

type Props = { title: string };

const ErrorWidget: FC<Props> = ({ title }) => (
  <div className="w-full rounded-lg border border-red-400 bg-slateus-700 p-8 font-roboto text-base font-light text-white">
    <p className="mb-8 font-inter text-xs font-light uppercase tracking-widest text-slateus-200">
      {title}
    </p>
    <p className="mb-4">An exception has occured 😱</p>
    <p className="mb-2">
      We&apos;re sorry, this should never happen! If you&apos;ve seen this
      before, or reloading doesn&apos;t fix it, you can help debug it by sending
      a screenshot to
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
);

export default ErrorWidget;
