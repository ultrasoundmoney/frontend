import { FC } from "react";
import Twemoji from "./Twemoji";

const SpanMoji: FC<{
  className?: HTMLDivElement["className"];
  imageClassName?: HTMLImageElement["className"];
  emoji: string;
}> = ({ className, imageClassName = "h-[30px]", emoji }) => (
  <Twemoji className={className} imageClassName={imageClassName}>
    {emoji}
  </Twemoji>
);

export default SpanMoji;
