import * as React from "react";
import twemoji from "twemoji";

type TwemojiProps = {
  emoji: string;
  className?: string;
};
const Twemoji: React.FC<TwemojiProps> = ({ emoji, className }) => (
  <div
    className="emoji_wrapper"
    dangerouslySetInnerHTML={{
      __html: twemoji.parse(emoji, {
        className: className !== undefined ? `emoji ${className}` : "emoji",
      }),
    }}
  />
);

export default React.memo(Twemoji);
