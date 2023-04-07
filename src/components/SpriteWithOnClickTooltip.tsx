import type { FC, RefObject } from "react";
import { useEffect } from "react";
import { useContext, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import type { SpriteSheetResponse } from "../mainsite/api/profiles";
import { FeatureFlagsContext } from "../feature-flags";
import styles from "../mainsite/components/ImageWithOnClickTooltip.module.scss";

type ImageWithOnClickTooltipProps = {
  className?: HTMLImageElement["className"];
  imageUrl: string | undefined;
  handle: string | undefined;
  isDoneLoading?: boolean;
  onClick: (ref: RefObject<HTMLImageElement>) => void;
  skeletonDiameter?: string;
  getXAndY: (
    imageKey: string | undefined,
    sizeFactor: number,
  ) => { x: number | null; y: number | null };
  excluded?: boolean;
  properties: SpriteSheetResponse["properties"];
  sizeFactor: number;
};

const ImageWithOnClickTooltip: FC<ImageWithOnClickTooltipProps> = ({
  className = "",
  imageUrl,
  handle,
  isDoneLoading = true,
  onClick,
  getXAndY,
  excluded = false,
  properties,
  sizeFactor,
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const { previewSkeletons } = useContext(FeatureFlagsContext);
  const [posX, setPosX] = useState<number | null>(null);
  const [posY, setPosY] = useState<number | null>(null);

  const smallScreen =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;

  useEffect(() => {
    if (imageUrl !== undefined && getXAndY) {
      const { x, y } = getXAndY(imageUrl, sizeFactor);
      setPosX(x);
      setPosY(y);
    }
  }, [getXAndY, imageUrl, sizeFactor]);

  return (
    <>
      {!isDoneLoading || previewSkeletons || posX === null || posY === null ? (
        <div className={`relative rounded-full ${className}`}>
          <Skeleton
            circle
            inline
            className={`${smallScreen ? "!leading-[48px]" : "!leading-3"} flex`}
          />
        </div>
      ) : (
        <div
          id={handle?.toLowerCase()}
          ref={imageRef}
          // measure distance mouse moved since click if more than 10px, don't trigger onClick
          onPointerDown={(e) => {
            if (onClick === undefined || excluded) return;
            const { clientX, clientY } = e;
            let distanceMoved = 0;
            const onPointerMove = (e: MouseEvent) => {
              const { clientX: newClientX, clientY: newClientY } = e;
              distanceMoved +=
                Math.abs(clientX - newClientX) + Math.abs(clientY - newClientY);
            };
            const onPointerUp = () => {
              if (distanceMoved < 10) {
                onClick(imageRef);
              }
              window.removeEventListener("pointermove", onPointerMove);
              window.removeEventListener("pointerup", onPointerUp);
            };
            window.addEventListener("pointermove", onPointerMove);
            window.addEventListener("pointerup", onPointerUp);
          }}
          className={`
            ${styles["fam-image-sprite"]}
            ${excluded ? "cursor-move !brightness-[0.25]" : "cursor-pointer"}
            relative
            rounded-full
            hover:brightness-125
            ${className}
            handle-className-${handle?.toLowerCase()}
          `}
          style={{
            backgroundPositionX: `${posX}px`,
            backgroundPositionY: `${posY}px`,
            backgroundSize: `${properties?.width / sizeFactor}px ${
              properties?.height / sizeFactor
            }px`,
          }}
        ></div>
      )}
    </>
  );
};

export default ImageWithOnClickTooltip;
