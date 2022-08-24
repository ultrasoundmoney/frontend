import type { FC, ReactNode } from "react";
import Skeleton from "react-loading-skeleton";
import { TextInter } from "../Texts";

type Props = {
  children: ReactNode | undefined;
  className?: string;
  skeletonWidth?: string;
};

const LabelText: FC<Props> = ({
  children,
  className = "",
  skeletonWidth = "3rem",
}) => (
  <TextInter
    className={`
      font-light
      text-slateus-200 text-xs
      uppercase tracking-widest
      ${className}
    `}
  >
    {children !== undefined ? (
      children
    ) : (
      <Skeleton inline width={skeletonWidth}></Skeleton>
    )}
  </TextInter>
);

export default LabelText;
