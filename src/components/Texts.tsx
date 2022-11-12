import type { CSSProperties, FC, ReactNode } from "react";
import { createElement } from "react";
import BodyText from "./TextsNext/BodyText";

export const LabelUnitText: FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <BaseText
    font="font-roboto"
    className={`
      text-xs
      font-light uppercase
      tracking-widest text-slateus-200
      ${className}
    `}
  >
    {children}
  </BaseText>
);

export const UnitText: FC<{ children: string; className?: string }> = ({
  className = "",
  children,
}) => (
  <BaseText
    font="font-roboto"
    weight="font-extralight"
    className={`font-extralight text-slateus-200 ${className}`}
  >
    {children}
  </BaseText>
);

export const TextInterLink: FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className: className = "" }) => (
  <BodyText className={`text-slateus-200 hover:underline ${className}`}>
    {children}
  </BodyText>
);

export type FontWeight = "font-normal" | "font-light" | "font-extralight";
type BaseTextProps = {
  children: ReactNode;
  font: "font-roboto" | "font-inter";
  className?: string;
  color?: "text-white" | "text-slateus-200" | string;
  inline?: boolean;
  size?: string;
  style?: CSSProperties;
  tooltip?: string;
  weight?: FontWeight;
};

/**
 * Flexible base text component. Prefer shared text components based on it.
 */
export const BaseText: FC<BaseTextProps> = ({
  children,
  className = "",
  color = "text-white",
  font,
  inline = true,
  size = "",
  style,
  tooltip,
  weight = "font-light",
}) =>
  createElement(
    inline ? "span" : "p",
    {
      className: `${font} ${className} ${color} ${weight} ${size}`,
      style: style,
      title: tooltip,
    },
    children,
  );

export const TimeFrameText: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <BaseText
    className={`tracking-widest ${className}`}
    size="text-xs"
    font="font-roboto"
    weight="font-normal"
  >
    {children}
  </BaseText>
);

export const TooltipTitle: FC<{ children: ReactNode }> = ({ children }) => (
  <BaseText font="font-inter" size="text-base md:text-lg" weight="font-normal">
    {children}
  </BaseText>
);
