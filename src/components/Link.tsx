import { FC, HTMLAttributes } from "react";

type LinkProps = {
  className?: HTMLAttributes<HTMLAnchorElement>["className"];
  enableHover?: boolean;
  href: string | undefined;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

const Link: FC<LinkProps> = ({
  children,
  className = "",
  enableHover = true,
  href,
  onMouseEnter,
  onMouseLeave,
}) => (
  <a
    className={`
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

export default Link;
