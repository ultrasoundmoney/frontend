import type { FC, RefObject } from "react";
import { useEffect, useContext, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import Image from "next/image";
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
  const [posX, setPosX] = useState<number | null | undefined>(undefined);
  const [posY, setPosY] = useState<number | null | undefined>(undefined);

  const smallScreen =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;

  useEffect(() => {
    if (imageUrl !== undefined && getXAndY) {
      const { x, y } = getXAndY(imageUrl, sizeFactor);
      setPosX(x);
      setPosY(y);
    }
  }, [getXAndY, imageUrl, sizeFactor]);

  const onPointerDown= (e: { clientX: number; clientY: number; }) => {
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
  }

  if (!isDoneLoading || previewSkeletons || posX === undefined || posY === undefined) {
    // we are loading
    <div className={`relative rounded-full ${className}`}>
      <Skeleton
        circle
        inline
        className={`${smallScreen ? "!leading-[48px]" : "!leading-3"} flex`}
      />
    </div>
  }

  if (posX === null || posY === null) {
    // Sprite sheet does not contian an image for this handle, we'll use a next image instead
    return (
      <div
        id={handle?.toLowerCase()}
        ref={imageRef}
        // measure distance mouse moved since click if more than 10px, don't trigger onClick
        onPointerDown={onPointerDown}
        className={`
          ${excluded ? "cursor-move !brightness-[0.25]" : "cursor-pointer"}
          relative
          rounded-full
          hover:brightness-125
          ${className}
          handle-className-${handle?.toLowerCase()}
        `}
      >
        <Image
          src={imageUrl || ""}
          alt=""
          fill
          className="rounded-full"
        />
      </div>
    );
  }

  // we have a sprite sheet image
  return (
    <div
      id={handle?.toLowerCase()}
      ref={imageRef}
      // measure distance mouse moved since click if more than 10px, don't trigger onClick
      onPointerDown={onPointerDown}
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
    />
  );
};

export default ImageWithOnClickTooltip;
