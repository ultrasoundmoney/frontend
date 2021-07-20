import twemoji from "twemoji";
import React from "react";

type SpanMojiProps = {
  className?: string;
  emoji: string;
};

const SpanMoji: React.FC<SpanMojiProps> = ({ className, emoji }) => (
  <span
    className={className}
    dangerouslySetInnerHTML={{
      __html: twemoji.parse(emoji, {
        folder: "svg",
        ext: ".svg",
      }),
    }}
  />
);

export default React.memo(SpanMoji);
