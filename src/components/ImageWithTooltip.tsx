import {
  FC,
  ReactEventHandler,
  RefObject,
  useCallback,
  useContext,
  useRef,
} from "react";
import Skeleton from "react-loading-skeleton";
import { Linkables } from "../api/fam";
import { FeatureFlagsContext } from "../feature-flags";

type ImageWithTooltipProps = {
  className?: HTMLImageElement["className"];
  coingeckoUrl?: string;
  contractAddresses?: string[];
  description: string | undefined;
  famFollowerCount: number | undefined;
  followerCount: number | undefined;
  imageUrl: string | undefined;
  isDoneLoading?: boolean;
  links?: Linkables;
  nftGoUrl?: string;
  onClick: () => void;
  onHover?: (hovering: boolean, ref: RefObject<HTMLImageElement>) => void;
  onMouseEnter?: (ref: RefObject<HTMLImageElement>) => void;
  onMouseLeave?: (ref: RefObject<HTMLImageElement>) => void;
  skeletonDiameter?: string;
  title: string | undefined;
  tooltipImageUrl: string | undefined;
  twitterUrl?: string;
};

const ImageWithTooltip: FC<ImageWithTooltipProps> = ({
  className = "",
  imageUrl,
  isDoneLoading = true,
  onClick,
  onMouseEnter = () => undefined,
  onMouseLeave = () => undefined,
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
        <div className="leading-4">
          <Skeleton
            circle={true}
            height={skeletonDiameter}
            width={skeletonDiameter}
            inline
          />
        </div>
      ) : (
        <img
          className={`
            rounded-full
            active:brightness-125 md:active:brightness-100
            cursor-pointer md:cursor-auto
            hover:opacity-60
            ${className}
          `}
          src={imageUrl ?? "/leaderboard-images/question-mark-v2.svg"}
          alt="logo of an ERC20 token"
          onError={onImageError}
          onClick={() => onClick()}
          ref={imageRef}
          onMouseEnter={() => onMouseEnter(imageRef)}
          onMouseLeave={() => onMouseLeave(imageRef)}
        />
      )}
    </>
  );
};

export default ImageWithTooltip;
