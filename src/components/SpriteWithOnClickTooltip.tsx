import type { FC, RefObject} from "react";
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
  getXAndY: (imageKey: string | undefined, sizeFactor: number) => { x: number | null, y: number | null };
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
          className="!leading-3 flex"
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
              distanceMoved += Math.abs(clientX - newClientX) + Math.abs(clientY - newClientY);
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
          // onTouchStart={(e) => {
          //   console.log("touch start");
          //   if (onClick === undefined || excluded) return;
          //   const touch = e.touches[0];
          //   console.log(touch);
          //   const { pageX, pageY } = touch || {};
          //   let distanceMoved = 0;
          //   const onTouchMove = (e: TouchEvent) => {
          //     console.log("touch move");
          //     const touch = e?.touches[0];
          //     const { pageX: newPageX, pageY: newPageY } = touch || {};
          //     if (pageX && pageY && newPageX && newPageY) {
          //       distanceMoved += Math.abs(pageX - newPageX) + Math.abs(pageY - newPageY);
          //     }
          //   };
          //   const onTouchend = () => {
          //     console.log("touch end");
          //     if (distanceMoved < 10) {
          //       console.log("touch end - distance moved < 10");
          //       onClick(imageRef);
          //     }
          //     window.removeEventListener("touchmove", onTouchMove);
          //     window.removeEventListener("touchend", onTouchend);
          //   };
          //   console.log('adding event listeners');
          //   window.addEventListener("touchmove", onTouchMove);
          //   window.addEventListener("touchend", onTouchend);
          // }}
          // className={className}
          className={`
            ${styles["fam-image-sprite"]}
            ${excluded ? "cursor-move !brightness-[0.25]" : "cursor-pointer"}
            relative
            rounded-full
            md:hover:brightness-125
            ${className}
            handle-className-${handle?.toLowerCase()}
          `}
          style={{
            backgroundPositionX: `${posX}px`,
            backgroundPositionY: `${posY}px`,
            backgroundSize: `${properties?.width / sizeFactor}px ${properties?.height / sizeFactor}px`,
          }}
        >
        </div>
      )}
    </>
  );
};

export default ImageWithOnClickTooltip;
