import type { FC, ReactNode } from "react";
import { useContext } from "react";
import Skeleton from "react-loading-skeleton";
import { FeatureFlagsContext } from "../../feature-flags";

type Props = {
  children?: ReactNode;
  className?: string;
  inline?: boolean;
  /** approximation of the to-be-loaded text width */
  width?: string;
};

/**
 * SkeletonText places a skeleton while content loads. Should be put *inside*
 * text elements to automatically adopt the right size through text styling.
 */
const SkeletonText: FC<Props> = ({
  children,
  className = "",
  inline = true,
  width = "3rem",
}) => {
  const { previewSkeletons } = useContext(FeatureFlagsContext);

  return children === undefined || previewSkeletons ? (
    <Skeleton className={className} inline={inline} width={width} />
  ) : (
    <>{children}</>
  );
};

export default SkeletonText;
