import type { FC } from "react";
import Skeleton from "react-loading-skeleton";
import { TextRoboto } from "../Texts";

type Props = {
  amountPostfix?: string;
  children: string | undefined;
  className?: string;
  skeletonWidth?: string;
  unitPostfix?: string;
};

const QuantifyText: FC<Props> = ({
  amountPostfix = "",
  children,
  className = "",
  skeletonWidth = "3rem",
  unitPostfix = "",
}) => (
  <TextRoboto className={className}>
    {children === undefined ? (
      <Skeleton width={skeletonWidth} />
    ) : (
      `${children}${amountPostfix}${` ${unitPostfix}`}`
    )}
  </TextRoboto>
);

export default QuantifyText;
