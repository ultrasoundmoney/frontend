import Link from "next/link";
import type { CSSProperties, FC, ReactNode } from "react";
import React from "react";
import Skeleton from "react-loading-skeleton";
import { useActiveBreakpoint } from "../utils/use-active-breakpoint";
import { WhiteEmoji } from "./Emoji";
import { AmountUnitSpace } from "./Spacing";

export const LabelText: FC<{
  children: ReactNode | undefined;
  className?: string;
  skeletonWidth?: string;
}> = ({ children, className = "", skeletonWidth = "3rem" }) => (
  <TextInter
    className={`
      font-light
      text-slateus-200 text-xs
      uppercase tracking-widest
      ${className}
    `}
  >
    {children !== undefined ? (
      children
    ) : (
      <Skeleton inline width={skeletonWidth}></Skeleton>
    )}
  </TextInter>
);

export const LabelUnitText: FC<{
  children: ReactNode | undefined;
  className?: string;
  skeletonWidth?: string;
}> = ({ children, className, skeletonWidth = "3rem" }) => (
  <TextRoboto
    className={`
      font-light
      text-slateus-200 text-xs
      uppercase tracking-widest
      ${className}
    `}
  >
    {children !== undefined ? (
      children
    ) : (
      <Skeleton inline width={skeletonWidth}></Skeleton>
    )}
  </TextRoboto>
);

export const UnitText: FC<{ children: ReactNode; className?: string }> = ({
  className,
  children,
}) => (
  <TextRoboto
    className={`text-blue-spindle font-extralight ${className ?? ""}`}
  >
    {children}
  </TextRoboto>
);

export const SectionTitle: FC<{
  children: ReactNode;
  link?: string;
  subtitle?: string;
}> = ({ link, children, subtitle }) => {
  const { md } = useActiveBreakpoint();
  return (
    <>
      <div className="flex justify-center items-center gap-x-4">
        <Link href={`#${link}`}>
          <a className="flex items-center gap-x-4 text-white">
            <h2
              className={`
              font-inter font-extralight
              text-white text-center text-2xl md:text-3xl xl:text-4xl
            `}
            >
              {children}
            </h2>
            {link !== undefined && (
              <WhiteEmoji
                alt="emoji of a chain link symbolizing a section anchor for easy linking"
                name="link"
                width={md ? 24 : 16}
              />
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

export const BodyText: FC<{
  children: ReactNode;
  className?: string;
  inline?: boolean;
  skeletonWidth?: string;
}> = ({ children, className = "", inline, skeletonWidth }) => (
  <TextInter
    className={`text-base md:text-lg ${className}`}
    inline={inline}
    skeletonWidth={skeletonWidth}
  >
    {children}
  </TextInter>
);

// This component should not have text size styling. Replace all call-sites that don't overwrite the size with a more specific higher order component. Probably BodyText.
export const TextInter: FC<{
  children: ReactNode;
  className?: string;
  inline?: boolean;
  skeletonWidth?: string;
  style?: CSSProperties;
}> = ({
  children,
  className = "",
  inline = true,
  style,
  skeletonWidth = "3rem",
}) => {
  const mergedClassName = `
    font-inter font-light
    text-white
    ${className}
  `;

  return inline ? (
    <span className={mergedClassName} style={style}>
      {children === undefined ? (
        <Skeleton inline width={skeletonWidth} />
      ) : (
        children
      )}
    </span>
  ) : (
    <p className={mergedClassName} style={style}>
      {children === undefined ? (
        <Skeleton inline width={skeletonWidth} />
      ) : (
        children
      )}
    </p>
  );
};

export const TextInterLink: FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className: className = "" }) => (
  <BodyText className={`text-blue-spindle hover:underline ${className}`}>
    {children}
  </BodyText>
);

export const TextRoboto: FC<{
  children: ReactNode;
  className?: string;
  inline?: boolean;
  style?: CSSProperties;
  tooltip?: string;
}> = ({ children, className, inline = true, style, tooltip }) => {
  const mergedClassName = `
    font-roboto font-light
    text-white
    ${className ?? ""}
  `;

  return inline ? (
    <span className={mergedClassName} style={style} title={tooltip}>
      {children}
    </span>
  ) : (
    <p className={mergedClassName} style={style} title={tooltip}>
      {children}
    </p>
  );
};

export const TimeFrameText: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <TextRoboto
    className={`font-roboto font-light text-xs tracking-widest ${className}`}
  >
    {children}
  </TextRoboto>
);

export const StatusText: FC<{ className?: string; children: ReactNode }> = ({
  children,
  className,
}) => (
  <TextInter
    className={`text-xs md:text-sm font-extralight text-slateus-200 ${className}`}
  >
    {children}
  </TextInter>
);

export const TooltipTitle: FC<{ children: ReactNode }> = ({ children }) => (
  <TextInter className="font-normal text-base md:text-lg">{children}</TextInter>
);

type QuantifyTextProps = {
  amountPostfix?: string;
  children: ReactNode;
  className?: string;
  unitPostfix?: string;
};
export const QuantifyText: FC<QuantifyTextProps> = ({
  amountPostfix = "",
  children,
  className = "",
  unitPostfix,
}) => (
  <TextRoboto className={className}>
    {children}
    {amountPostfix}
    {unitPostfix && (
      <>
        <AmountUnitSpace />
        <UnitText>{unitPostfix}</UnitText>
      </>
    )}
  </TextRoboto>
);
