import type { StaticImageData } from "next/image";
import Image from "next/image";
import type { FC, MouseEventHandler, RefObject } from "react";
import { useCallback, useContext, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import questionMarkSvg from "../assets/question-mark-v2.svg";
import { FeatureFlagsContext } from "../feature-flags";

type ImageWithOnClickTooltipProps = {
  className?: HTMLImageElement["className"];
  height: number;
  imageUrl: string | undefined;
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

  const onImageError = useCallback(() => {
    setImgSrc(questionMarkSvg as StaticImageData);
  }, []);

  console.log("currentScale", currentScale);

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
          ref={imageRef}
          onClick={onClick === undefined ? undefined : () => onClick(imageRef)}
          // className={className}
          className={`
              cursor-pointer
              relative
              ${className}
              `}
              // ${onMouseEnter !== undefined ? "hover:opacity-60" : ""}
        >
          <Image
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
          />
        </div>
      )}
    </>
  );
};

export default ImageWithOnClickTooltip;
