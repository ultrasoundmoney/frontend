import type { ImageProps, StaticImageData } from "next/legacy/image";
import Image from "next/legacy/image";
import type { FC } from "react";
import linkSvg from "./svg-white/link.svg";
import anchorSvg from "./svg-white/anchor.svg";
import whiteCheckSvg from "./svg/white-check.svg";
import seeNoEvilSvg from "./svg/see-no-evil.svg";
import hearNoEvilSvg from "./svg/hear-no-evil.svg";
import speakNoEvilSvg from "./svg/speak-no-evil.svg";

type SupportedColoredEmoji =
  | "hear-no-evil"
  | "see-no-evil"
  | "speak-no-evil"
  | "white-check";

type SupportedWhiteEmoji = "anchor" | "link";

const coloredMap: Record<SupportedColoredEmoji, StaticImageData> = {
  "hear-no-evil": hearNoEvilSvg as StaticImageData,
  "see-no-evil": seeNoEvilSvg as StaticImageData,
  "speak-no-evil": speakNoEvilSvg as StaticImageData,
  "white-check": whiteCheckSvg as StaticImageData,
} as const;

const whiteMap: Record<SupportedWhiteEmoji, StaticImageData> = {
  anchor: anchorSvg as StaticImageData,
  link: linkSvg as StaticImageData,
} as const;

type WhiteEmojiProps = {
  alt: ImageProps["alt"];
  layout?: ImageProps["layout"];
  name: SupportedWhiteEmoji;
  width?: ImageProps["width"];
};

export const WhiteEmoji: FC<WhiteEmojiProps> = ({
  alt,
  layout,
  name,
  width,
}) => (
  <span className="flex select-none">
    <Image
      alt={alt}
      layout={layout}
      src={whiteMap[name]}
      height={width}
      width={width}
    />
  </span>
);

type ColoredEmojiProps = {
  alt: ImageProps["alt"];
  layout?: ImageProps["layout"];
  name: SupportedColoredEmoji;
  width?: ImageProps["width"];
};

export const ColoredEmoji: FC<ColoredEmojiProps> = ({
  alt,
  layout,
  name,
  width,
}) => <Image alt={alt} layout={layout} src={coloredMap[name]} width={width} />;
