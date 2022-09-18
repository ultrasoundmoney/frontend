import type { FC } from "react";

type Props = { title: string };

const ErrorWidget: FC<Props> = ({ title }) => (
  <div className="w-full p-8 text-base font-light text-white border border-red-400 rounded-lg font-roboto bg-slateus-700">
    <p className="font-inter font-light text-slateus-200 text-xs uppercase tracking-widest mb-8">
      {title}
    </p>
    <p className="mb-4">An exception has occured 😱</p>
    <p className="mb-2">
      We&apos;re sorry, this should never happen! If you&apos;ve seen this
      before, or reloading doesn&apos;t fix it, you can help debug it by sending
      a screenshot to
      <a
        className="ml-2 underline cursor-pointer text-slateus-200 active:brightness-90"
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
