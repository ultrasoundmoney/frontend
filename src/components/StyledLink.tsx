import type { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  enableHover?: boolean;
  href: string | undefined;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

/**
 * @deprecated use StyledLinkV2
 */
const StyledLink: FC<Props> = ({
  children,
  className = "",
  enableHover = true,
  href,
  onMouseEnter,
  onMouseLeave,
}) => (
  <a
    className={`
      cursor-pointer
      active:brightness-90
      ${enableHover ? "hover:opacity-60" : ""}
      ${className}
    `}
    href={href}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    rel="noreferrer"
    target="_blank"
  >
    {children}
  </a>
);

export default StyledLink;
