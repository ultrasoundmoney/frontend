import type { FC } from "react";
import LabelText from "../../components/TextsNext/LabelText";
import { LabelUnitText } from "../../components/TextsNext/LabelUnitText";
import SkeletonText from "../../components/TextsNext/SkeletonText";

type Props = {
  mobilePostText?: string;
  postText: string;
  preText?: string;
  skeletonWidth?: string;
  unitPostfix?: string;
  value?: string;
};

const TinyStatus: FC<Props> = ({
  mobilePostText,
  postText,
  preText,
  skeletonWidth,
  unitPostfix,
  value,
}) => (
  <div className="flex items-baseline gap-x-1">
    <LabelText
      className={`${preText === undefined ? "hidden" : "block"}`}
      color="text-slateus-400"
    >
      {preText}
    </LabelText>
    <LabelUnitText>
      <SkeletonText width={skeletonWidth}>{value}</SkeletonText>
    </LabelUnitText>
    <LabelText
      className={`${unitPostfix === undefined ? "hidden" : "block"}`}
      color="text-slateus-200"
    >
      {unitPostfix}
    </LabelText>
    {mobilePostText !== undefined ? (
      <>
        <LabelText
          className="hidden truncate md:inline"
          color="text-slateus-400"
        >
          {postText}
        </LabelText>
        <LabelText
          className="inline truncate md:hidden"
          color="text-slateus-400"
        >
          {mobilePostText}
        </LabelText>
      </>
    ) : (
      <LabelText color="truncate text-slateus-400">{postText}</LabelText>
    )}
  </div>
);

export default TinyStatus;
