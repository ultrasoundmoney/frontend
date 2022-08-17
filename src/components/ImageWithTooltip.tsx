import type { FC, ReactEventHandler, RefObject } from "react";
import { useCallback, useContext, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import { FeatureFlagsContext } from "../feature-flags";
import Image from "next/image";

type ImageWithTooltipProps = {
  className?: HTMLImageElement["className"];
  imageUrl: string | undefined;
  isDoneLoading?: boolean;
  onClick?: () => void;
  onMouseEnter?: (ref: RefObject<HTMLImageElement>) => void;
  onMouseLeave?: (ref: RefObject<HTMLImageElement>) => void;
  skeletonDiameter?: string;
  width: number;
  height: number;
};

const ImageWithTooltip: FC<ImageWithTooltipProps> = ({
  className = "",
  imageUrl,
  isDoneLoading = true,
  onClick,
  onMouseEnter,
  onMouseLeave,
  width,
  height,
  skeletonDiameter = "32px",
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const { previewSkeletons } = useContext(FeatureFlagsContext);

  const onImageError = useCallback<ReactEventHandler<HTMLImageElement>>((e) => {
    (e.target as HTMLImageElement).src =
      "/leaderboard-images/question-mark-v2.svg";
  }, []);

  return (
    <>
      {(imageUrl === undefined && !isDoneLoading) || previewSkeletons ? (
        <div className="leading-4 m-2">
          <Skeleton
            circle={true}
            height={skeletonDiameter}
            width={skeletonDiameter}
            inline
          />
        </div>
      ) : (
        <div
          ref={imageRef}
          onMouseEnter={() =>
            onMouseEnter === undefined ? undefined : onMouseEnter(imageRef)
          }
          onMouseLeave={() =>
            onMouseLeave === undefined ? undefined : onMouseLeave(imageRef)
          }
          className={className}
        >
          <Image
            className={`
            rounded-full
            active:brightness-125 md:active:brightness-100
            cursor-pointer md:cursor-auto
            ${onMouseEnter !== undefined ? "hover:opacity-60" : ""}
          `}
            src={imageUrl ?? "/leaderboard-images/question-mark-v2.svg"}
            alt="logo of an ERC20 token"
            onError={onImageError}
            onClick={onClick}
            width={width}
            height={height}
          />
        </div>
      )}
    </>
  );
};

export default ImageWithTooltip;
