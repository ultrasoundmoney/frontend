import type { FC, ReactNode } from "react";
import { WhiteEmoji } from "../Emoji";

type Props = {
  children: ReactNode;
  className?: string;
  highlightGradient?: string;
  highlightPhrase?: string;
  link?: string;
  subtitle?: string;
};

export const SectionTitle: FC<Props> = ({
  children,
  className = "",
  highlightGradient = "bg-gradient-to-tr from-gray-800 to-pink-400",
  highlightPhrase,
  link,
  subtitle,
}) => (
  <>
    <div className={`flex items-center justify-center gap-x-4 ${className}`}>
      <a
        className={`
          flex items-center gap-x-4 text-white
          ${
            link === undefined ? "" : "hover:brightness-90 active:brightness-75"
          }`}
        href={link === undefined ? undefined : `#${link}`}
      >
        <h2
          className={`
                text-center font-inter
                text-2xl font-extralight text-white md:text-3xl xl:text-4xl
              `}
        >
          {children}
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
          <div className="w-4 md:w-6">
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
      </a>
    </div>
    {subtitle !== undefined && (
      <p
        className={`
            mt-6 text-center
            font-inter text-base font-light text-slateus-400
            lg:text-lg
          `}
      >
        {subtitle}
      </p>
    )}
  </>
);
