import type { FC, ReactNode } from "react";
import * as Sentry from "@sentry/nextjs";
import { WhiteEmoji } from "./Emoji";

const ConditionalLink: FC<{
  className?: string;
  children?: ReactNode;
  link?: string;
}> = ({ className = "", link, children }) =>
  link === undefined ? (
    <div className={className}>{children}</div>
  ) : (
    <a
      className={`
        hover:brightness-90 active:brightness-75
        ${className}
      `}
      href={link}
      rel="noreferrer"
    >
      {children}
    </a>
  );

const Title: FC<{
  highlightGradient?: string;
  highlightPhrase?: string;
  link?: string;
  title: string;
}> = ({
  highlightGradient = "bg-gradient-to-tr from-gray-800 to-pink-400",
  highlightPhrase,
  link,
  title,
}) => (
  <ConditionalLink
    className={`flex items-center gap-x-4 text-white`}
    link={link === undefined ? undefined : `#${link}`}
  >
    <h2
      className={`
      flex
        text-center font-inter
        text-2xl font-extralight text-white md:text-3xl xl:text-4xl
      `}
    >
      {title}
      {highlightPhrase && (
        <>
          &nbsp;
          <span
            className={`bg-clip-text text-transparent ${highlightGradient}`}
          >
            {highlightPhrase}
          </span>
        </>
      )}
    </h2>
    {link !== undefined && (
      <div className="w-4 pt-3 md:w-6">
        <WhiteEmoji
          className="hidden md:block"
          alt="emoji of a chain link symbolizing a section anchor for easy linking"
          name="link"
          width={24}
        />
        <WhiteEmoji
          className="block md:hidden"
          alt="emoji of a chain link symbolizing a section anchor for easy linking"
          name="link"
          width={16}
        />
      </div>
    )}
  </ConditionalLink>
);

const ErrorFallback: FC<{ title: string; subtitle?: string }> = ({ title }) => (
  <div className="mt-32 mb-32 pt-32">
    <h2 className="text-center font-inter text-2xl font-extralight text-white md:text-3xl xl:text-4xl">
      {title}
    </h2>
    <div className="flex flex-col justify-center text-slateus-400">
      <div
        className={`
          m-16 mx-auto w-5/6 rounded-lg border border-red-400 bg-slateus-700
          p-8 text-center font-roboto text-base font-light text-white
        `}
      >
        <p className="mb-4">This section hit an exception 😱</p>
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
  </div>
);

type Props = {
  children: ReactNode;
  highlightGradient?: string;
  highlightPhrase?: string;
  link?: string;
  subtitle?: string;
  title: string;
};

const Section: FC<Props> = ({
  children,
  highlightGradient = "bg-gradient-to-tr from-gray-800 to-pink-400",
  highlightPhrase,
  link,
  subtitle,
  title,
}) => (
  <Sentry.ErrorBoundary fallback={<ErrorFallback title={title} />}>
    {/* Using margin and padding means linking to a section directly will
    result in the browser scrolling to a point halfway between two sections
    which looks neat. */}
    <section
      className="mt-32 flex flex-col items-center gap-4 gap-x-4 pt-32 xs:px-4 md:px-16"
      id={link}
    >
      <Title
        title={title}
        link={link}
        highlightGradient={highlightGradient}
        highlightPhrase={highlightPhrase}
      />
      {subtitle !== undefined && (
        <p className="mt-6 text-center font-inter text-base font-light text-slateus-400 lg:text-lg">
          {subtitle}
        </p>
      )}
      <div className="mb-32"></div>
      {children}
    </section>
  </Sentry.ErrorBoundary>
);

export default Section;
