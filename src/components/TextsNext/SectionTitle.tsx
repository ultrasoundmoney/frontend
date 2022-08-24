import Link from "next/link";
import type { FC, ReactNode } from "react";
import { useActiveBreakpoint } from "../../utils/use-active-breakpoint";
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
}) => {
  const { md } = useActiveBreakpoint();
  return (
    <>
      <div className={`flex justify-center items-center gap-x-4 ${className}`}>
        <Link href={`#${link}`}>
          <a className="flex items-center gap-x-4 text-white">
            <h2
              className={`
              font-inter font-extralight
              text-white text-center text-2xl md:text-3xl xl:text-4xl
            `}
            >
              {children}
              {highlightPhrase && (
                <>
                  &nbsp;
                  <span
                    className={`text-transparent bg-clip-text ${highlightGradient}`}
                  >
                    {highlightPhrase}
                  </span>
                </>
              )}
            </h2>
            {link !== undefined && (
              <div className="w-4 md:w-6">
                <WhiteEmoji
                  alt="emoji of a chain link symbolizing a section anchor for easy linking"
                  name="link"
                  width={md ? 24 : 16}
                />
              </div>
            )}
          </a>
        </Link>
      </div>
      {subtitle !== undefined && (
        <p
          className={`
          font-inter font-light
          text-blue-shipcove text-center text-base lg:text-lg
          mt-6
        `}
        >
          {subtitle}
        </p>
      )}
    </>
  );
};
