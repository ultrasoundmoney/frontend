import type { FC } from "react";
import Twemoji from "./Twemoji";

const SpanMoji: FC<{
  className?: string;
  imageClassName?: string;
  emoji: string;
}> = ({ className, imageClassName = "h-[30px]", emoji }) => (
  <Twemoji className={className} imageClassName={imageClassName} wrapper>
    {emoji}
  </Twemoji>
);

export default SpanMoji;
