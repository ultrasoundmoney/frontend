import { FC } from "react";

type Props = { title: string };

const ErrorWidget: FC<Props> = ({ title }) => (
  <div
    className={`
      w-full bg-slateus-700 p-8 rounded-lg
      border border-red-400
    `}
  >
    <p className="font-inter font-light text-slateus-200 text-xs uppercase tracking-widest mb-4">
      {title}
    </p>
    <p className="font-roboto font-light text-white">
      This component hit an unexpected error, if this does not change soon,
      please let us know
      <a
        className="ml-2 font-inter font-light text-slateus-200 active:brightness-90 cursor-pointer"
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
