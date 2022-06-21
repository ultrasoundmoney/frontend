import { FC } from "react";

type Props = {
  className?: string;
  enableHover?: boolean;
  href: string | undefined;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

const Link: FC<Props> = ({
  children,
  className = "",
  enableHover = true,
  href,
  onMouseEnter,
  onMouseLeave,
}) => (
  <a
    className={`
      active:brightness-90
      cursor-pointer
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
