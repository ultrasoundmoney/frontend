import type { CSSProperties, FC, ReactNode } from "react";
import BodyText from "./TextsNext/BodyText";

export const LabelUnitText: FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <TextRoboto
    className={`
      font-light
      text-slateus-200 text-xs
      uppercase tracking-widest
      ${className}
    `}
  >
    {children}
  </TextRoboto>
);

export const UnitText: FC<{ children: string; className?: string }> = ({
  className = "",
  children,
}) => (
  <TextRoboto className={`text-blue-spindle font-extralight ${className}`}>
    {children}
  </TextRoboto>
);

export const TextInter: FC<{
  children: ReactNode;
  className?: string;
  inline?: boolean;
  style?: CSSProperties;
}> = ({ children, className = "", inline = true, style }) => {
  const mergedClassName = `
    font-inter font-light
    text-white
    ${className}
  `;

  return inline ? (
    <span className={mergedClassName} style={style}>
      {children}
    </span>
  ) : (
    <p className={mergedClassName} style={style}>
      {children}
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

export const TooltipTitle: FC<{ children: ReactNode }> = ({ children }) => (
  <TextInter className="font-normal text-base md:text-lg">{children}</TextInter>
);
