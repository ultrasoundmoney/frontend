import type { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  href: string | undefined;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

const DefaultLink: FC<Props> = ({
  children,
  className = "",
  href,
  onMouseEnter,
  onMouseLeave,
}) => (
  <a
    className={`
      ${href !== undefined ? "active:brightness-75" : ""}
      ${href !== undefined ? "hover:brightness-[85%]" : ""}
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
