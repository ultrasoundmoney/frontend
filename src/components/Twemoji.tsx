import { FC, useEffect, useRef } from "react";
import twemoji from "twemoji";

const Twemoji: FC<{ wrappingEl?: "div" | "span" }> = ({
  children,
  wrappingEl = "div",
}) => {
  const twemojiEl = useRef(null);

  useEffect(() => {
    if (twemojiEl.current === null) {
      return;
    }

    twemoji.parse(twemojiEl.current);
  }, [twemojiEl]);
  return wrappingEl === "div" ? (
    <div ref={twemojiEl}>{children}</div>
  ) : (
    <span ref={twemojiEl}>{children}</span>
  );
};

export default Twemoji;
