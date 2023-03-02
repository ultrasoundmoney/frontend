import type { FC } from "react";
import { LabelUnitText } from "../../components/Texts";
import LabelText from "../../components/TextsNext/LabelText";
import SkeletonText from "../../components/TextsNext/SkeletonText";

type Props = {
  postText: string;
  preText?: string;
  skeletonWidth?: string;
  unitPostfix?: string;
  value?: string;
};

const TinyStatus: FC<Props> = ({
  postText,
  preText,
  skeletonWidth,
  unitPostfix,
  value,
}) => (
  <div className="flex items-baseline gap-x-1">
    <LabelText color="text-slateus-400">{preText}</LabelText>
    <LabelUnitText>
      <SkeletonText width={skeletonWidth}>{value}</SkeletonText>
    </LabelUnitText>
    <LabelText color="text-slateus-200">{unitPostfix}</LabelText>
    <LabelText color="text-slateus-400">{postText}</LabelText>
  </div>
);

export default TinyStatus;
