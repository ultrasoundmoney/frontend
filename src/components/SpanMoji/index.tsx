import twemoji from "twemoji";
import React from "react";

const SpanMoji = ({ emoji }: { emoji: string }) => (
  <span
    dangerouslySetInnerHTML={{
      __html: twemoji.parse(emoji, {
        folder: "svg",
        ext: ".svg",
      }),
    }}
  />
);

export default React.memo(SpanMoji);
