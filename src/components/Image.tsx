import NextImage, { ImageLoader, ImageProps } from "next/image";
import { FC } from "react";

// Opt-out of image optimization.
const customLoader: ImageLoader = ({ src }) => src;

const Image: FC<ImageProps> = (props) => {
  return <NextImage {...props} loader={customLoader} />;
};

export default Image;
