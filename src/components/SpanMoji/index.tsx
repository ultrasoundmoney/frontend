import twemoji from "twemoji";
import React from "react";

const SpanMoji = ({
  className,
  emoji,
}: {
  className?: string;
  emoji: string;
}) => (
  <span
    className={className}
    dangerouslySetInnerHTML={{
      //

      __html: String(
        twemoji.parse(emoji, {
          folder: "svg",
          ext: ".svg",
        })
      ),
    }}
  />
);

export default React.memo(SpanMoji);
