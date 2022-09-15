import type { StaticImageData } from "next/image";
import Image from "next/image";
import type { FC } from "react";
import type { MergeEstimate } from "../../api/merge-estimate";
import * as Format from "../../format";
import { LabelUnitText } from "../Texts";
import LabelText from "../TextsNext/LabelText";
import SkeletonText from "../TextsNext/SkeletonText";
import UpdatedAgo from "../UpdatedAgo";
import WidgetErrorBoundary from "../WidgetErrorBoundary";
import { WidgetBackground } from "../WidgetSubcomponents";
import pandaOwn from "../../assets/panda-own.svg";

type Props = {
  mergeEstimate: MergeEstimate;
  /** a fraction between 0 and 1 */
  progress: number | undefined;
};

const TotalDifficultyProgressWidget: FC<Props> = ({
  mergeEstimate,
  progress,
}) => (
  <WidgetErrorBoundary title="merge difficulty progress">
    <WidgetBackground className="flex flex-col gap-y-4">
      <div className="flex justify-between items-center">
        <LabelText className="flex items-center min-h-[21px]">
          merge difficulty progress
        </LabelText>
        <div className="select-none flex items-center">
          <Image
            alt="a panda emoji, used to signify the merge, as pandas are a merge of black and white colors"
            height={21}
            src={pandaOwn as StaticImageData}
            width={21}
          />
        </div>
      </div>
      <div className="flex flex-col gap-y-4 mt-2">
        <div className="w-full relative">
          <div className="w-full h-2 bg-slateus-600 rounded-full"></div>
          <div
            className={`
              absolute
              left-0 top-0 h-2 rounded-full
              bg-gradient-to-r from-cyan-300 to-indigo-500
            `}
            style={{ right: `${(1 - (progress ?? 0)) * 100}%` }}
          ></div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-baseline gap-x-1 gap-y-2">
        <div className="flex items-baseline gap-x-1">
          <LabelUnitText className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-500">
            <SkeletonText width="3rem">
              {progress === undefined
                ? undefined
                : Format.formatPercentThreeDecimals(progress)}
            </SkeletonText>
          </LabelUnitText>
          <LabelText className="text-slateus-400">{` of TTD`}</LabelText>
        </div>
        <UpdatedAgo updatedAt={mergeEstimate.timestamp} />
      </div>
    </WidgetBackground>
  </WidgetErrorBoundary>
);

export default TotalDifficultyProgressWidget;
