import type { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  enableHover?: boolean;
  href: string | undefined;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

const DefaultLink: FC<Props> = ({
  children,
  className = "",
  enableHover = true,
  href,
  onMouseEnter,
  onMouseLeave,
}) => (
  <a
    className={`
      active:brightness-50
      ${enableHover ? "hover:brightness-75" : ""}
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

export default DefaultLink;
