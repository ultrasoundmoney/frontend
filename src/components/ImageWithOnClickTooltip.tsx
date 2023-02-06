import type { StaticImageData } from "next/image";
import { FC, MouseEventHandler, RefObject, useEffect } from "react";
import { useCallback, useContext, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import questionMarkSvg from "../assets/question-mark-v2.svg";
import { FeatureFlagsContext } from "../feature-flags";
import styles from "./ImageWithOnClickTooltip.module.scss";
import coordinates from '../../public/sprite/coordinates.json'
import properties from '../../public/sprite/properties.json'

const sizeFactor = 8; // (from 96px to 12px)

type ImageWithOnClickTooltipProps = {
  className?: HTMLImageElement["className"];
  height: number;
  imageUrl: string | undefined;
  handle: string | undefined;
  isDoneLoading?: boolean;
  onClick: (ref: RefObject<HTMLImageElement>) => void;
  skeletonDiameter?: string;
  width: number;
  currentScale: number | undefined;
};

const ImageWithOnClickTooltip: FC<ImageWithOnClickTooltipProps> = ({
  className = "",
  height,
  imageUrl,
  handle,
  isDoneLoading = true,
  onClick,
  width,
  currentScale,
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const { previewSkeletons } = useContext(FeatureFlagsContext);
  const [imgSrc, setImgSrc] = useState<string | StaticImageData | undefined>(
    imageUrl,
  );
  const [posX, setPosX] = useState<number | null>(null);
  const [posY, setPosY] = useState<number | null>(null);
  // const [posX] = useState<number>(Math.floor(Math.random() * 101));
  // const [posY] = useState<number>(Math.floor(Math.random() * 101));

  const onImageError = useCallback(() => {
    setImgSrc(questionMarkSvg as StaticImageData);
  }, []);

  const generateImageKeyfromUrl = (url: string | undefined) => {
    // i.e. https://pbs.twimg.com/profile_images/1537478481096781825/J1BDruLr.png
    if (url?.includes('default_profile_images')) {
      return 'default_profile-images.png';
    }
    const userId = url?.split('profile_images')?.[1]?.split('/')[1]; // i.e. 1579896394919383051
    const fileName = `${userId}-::-${url?.split('profile_images')?.[1]?.split('/')[2]}`; // i.e. 1579896394919383051-::-ahIN3HUB.jpg
    return `profile_images/${fileName}`;
  }

  useEffect(() => {
    if (imageUrl !== undefined) {
      const key = generateImageKeyfromUrl(imageUrl);
      let x = coordinates?.[key as keyof typeof coordinates]?.x / sizeFactor;
      let y = coordinates?.[key as keyof typeof coordinates]?.y / sizeFactor;
      // x is going right to left not left to right
      x = properties?.width / sizeFactor - x;
      // y is going bottom to top not top to bottom
      y = properties?.height / sizeFactor - y;
      if (Number.isNaN(x)) {
        x = coordinates?.['profile_images/default_profile-images.png' as keyof typeof coordinates ]?.x / sizeFactor;
        y = coordinates?.['profile_images/default_profile-images.png' as keyof typeof coordinates ]?.y / sizeFactor;
      }
      setPosX(x);
      setPosY(y);
    }
  }, []);

  // const posX = getPositionX();
  // const posY = getPositionY();

  return (
    <>
      {!isDoneLoading || previewSkeletons ? (
        <div className="m-2 leading-4">
          <Skeleton
            circle={true}
            height={`${height}px`}
            width={`${width}px`}
            inline
          />
        </div>
      ) : (
        <div
          id={handle?.toLowerCase()}
          ref={imageRef}
          onClick={onClick === undefined ? undefined : () => onClick(imageRef)}
          // className={className}
          className={`
            ${styles["fam-image-sprite"]}
            cursor-pointer
            relative
            rounded-full
            md:hover:brightness-125
            ${className}
          `}
          style={{
            backgroundPositionX: `${posX}px`,
            backgroundPositionY: `${posY}px`,
            backgroundSize: `${properties?.width / sizeFactor}px ${properties?.height / sizeFactor}px`,
          }}
            // ${onMouseEnter !== undefined ? "hover:opacity-60" : ""}
        >
          {/* <Image
            className={`
              rounded-full active:brightness-125
              md:cursor-auto md:active:brightness-100
              `}
              // ${onMouseEnter !== undefined ? "hover:opacity-60" : ""}
            src={imgSrc ?? (questionMarkSvg as StaticImageData)}
            alt="logo of an ERC20 token"
            onError={onImageError}
            // onClick={onClick}
            quality={40}
            // sizes="(max-width: 640px) 100vw, 640px"
            fill
          /> */}
          {/* <div
            className={`
              rounded-full active:brightness-125
              md:cursor-auto md:active:brightness-100
              `}
              // ${onMouseEnter !== undefined ? "hover:opacity-60" : ""}
            onError={onImageError}
            // onClick={onClick}
            // sizes="(max-width: 640px) 100vw, 640px"
          /> */}
        </div>
      )}
    </>
  );
};

export default ImageWithOnClickTooltip;
