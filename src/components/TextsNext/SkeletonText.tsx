import type { FC, ReactNode } from "react";
import { useContext } from "react";
import Skeleton from "react-loading-skeleton";
import { FeatureFlagsContext } from "../../feature-flags";

type Props = { children?: ReactNode; width?: string };

const SkeletonText: FC<Props> = ({ children, width = "3rem" }) => {
  const { previewSkeletons } = useContext(FeatureFlagsContext);

  return (
    <>
      {children === undefined || previewSkeletons ? (
        <Skeleton width={width} />
      ) : (
        children
      )}
    </>
  );
};

export default SkeletonText;
