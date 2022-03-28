import { Placement } from "@popperjs/core";
import {
  FC,
  ReactEventHandler,
  useCallback,
  useContext,
  useState,
} from "react";
import Skeleton from "react-loading-skeleton";
import { usePopper } from "react-popper";
import { Linkables } from "../api/fam";
import { FeatureFlagsContext } from "../feature-flags";
import { useActiveBreakpoint } from "../utils/use-active-breakpoint";
import Tooltip from "./Tooltip";

type ImageWithTooltipProps = {
  className?: HTMLImageElement["className"];
  coingeckoUrl?: string;
  description: string | undefined;
  famFollowerCount: number | undefined;
  followerCount: number | undefined;
  imageUrl: string | undefined;
  links?: Linkables;
  nftGoUrl?: string;
  onClickImage: () => void;
  placement?: Placement | undefined;
  title: string | undefined;
  tooltipImageUrl: string | undefined;
  twitterUrl?: string;
};

const ImageWithTooltip: FC<ImageWithTooltipProps> = ({
  className = "",
  coingeckoUrl,
  description,
  famFollowerCount,
  followerCount,
  imageUrl,
  links,
  nftGoUrl,
  onClickImage,
  placement,
  title,
  tooltipImageUrl,
  twitterUrl,
}) => {
  // Tooltip
  const [refEl, setRefEl] = useState<HTMLDivElement | null>(null);
  const [popperEl, setPopperEl] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(refEl, popperEl, {
    placement,
    modifiers: [
      {
        name: "flip",
        options: { fallbackPlacements: ["bottom", "left", "top"] },
      },
    ],
  });
  const [isHovering, setHovering] = useState(false);
  const [isTooltipHovering, setTooltipHovering] = useState(false);
  const showTooltip = isHovering || isTooltipHovering;

  const onImageError = useCallback<ReactEventHandler<HTMLImageElement>>((e) => {
    (e.target as HTMLImageElement).src =
      "/leaderboard-images/question-mark-v2.svg";
  }, []);

  const { md } = useActiveBreakpoint();

  const handleSetHovering = useCallback(
    (hovering: boolean) => {
      if (!md) {
        return;
      }

      setHovering(hovering);
    },
    [md, setHovering],
  );

  const { previewSkeletons } = useContext(FeatureFlagsContext);

  return (
    <>
      {imageUrl === undefined || previewSkeletons ? (
        <div className="leading-4">
          <Skeleton circle={true} height="32px" width="32px" inline />
        </div>
      ) : (
        <img
          className={`rounded-full hover:opacity-60 ${className}`}
          src={imageUrl ?? "/leaderboard-images/question-mark-v2.svg"}
          alt="logo of an ERC20 token"
          onError={onImageError}
          onClick={() => onClickImage()}
          ref={setRefEl}
          onMouseEnter={() => handleSetHovering(true)}
          onMouseLeave={() => handleSetHovering(false)}
        />
      )}
      <div
        ref={setPopperEl}
        className={`hidden md:block z-10`}
        style={{
          ...styles.popper,
        }}
        {...attributes.popper}
        onMouseEnter={() => (isHovering ? setTooltipHovering(true) : undefined)}
        onMouseLeave={() => setTooltipHovering(false)}
      >
        <Tooltip
          coingeckoUrl={coingeckoUrl}
          description={description}
          famFollowerCount={famFollowerCount}
          followerCount={followerCount}
          imageUrl={tooltipImageUrl}
          links={links}
          nftGoUrl={nftGoUrl}
          show={showTooltip}
          title={title}
          twitterUrl={twitterUrl}
        />
      </div>
    </>
  );
};

export default ImageWithTooltip;
