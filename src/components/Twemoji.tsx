import React, { FC, ReactHTML, ReactNode, useEffect, useRef } from "react";
import twemoji from "twemoji";

const Twemoji: FC<{
  children: ReactNode;
  className?: HTMLDivElement["className"];
  imageClassName?: HTMLImageElement["className"];
  wrappingEl?: keyof ReactHTML;
}> = ({ children, className = "", imageClassName = "block h-8" }) => {
  const twemojiEl = useRef<HTMLElement>(null);

  useEffect(() => {
    if (twemojiEl.current === null) {
      return;
    }
    twemoji.parse(twemojiEl.current, {
      className: imageClassName,
      ext: ".svg",
      folder: "svg",
    });
  }, [imageClassName, twemojiEl]);

  return children == null ? null : typeof children === "string" ||
    typeof children === "number" ? (
    <span
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      className={`${(children as any)?.props?.className ?? ""} ${className}`}
      ref={twemojiEl}
    >
      {children}
    </span>
  ) : (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    React.cloneElement(children as any, {
      ref: twemojiEl,
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      className: `${(children as any)?.props?.className ?? ""} ${className}`,
    })
  );
};

export default Twemoji;
