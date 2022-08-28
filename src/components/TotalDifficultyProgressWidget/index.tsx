import type { StaticImageData } from "next/image";
import Image from "next/image";
import type { FC } from "react";
import * as Format from "../../format";
import LabelText from "../TextsNext/LabelText";
import QuantifyText from "../TextsNext/QuantifyText";
import WidgetErrorBoundary from "../WidgetErrorBoundary";
import { WidgetBackground } from "../WidgetSubcomponents";
import pandaOwn from "./panda-own.svg";
import pandaSlateus from "./panda-slateus.svg";

type Props = {
  /** a fraction between 0 and 1 */
  progress: number | undefined;
};

const TotalDifficultyProgressWidget: FC<Props> = ({ progress }) => (
  <WidgetErrorBoundary title="total difficulty progress">
    <WidgetBackground className="flex flex-col gap-y-8">
      <LabelText className="flex items-center min-h-[21px]">
        total difficulty progress
      </LabelText>
      <div className="flex flex-col gap-y-4">
        <div className="relative self-end">
          <div
            className={`
      relative
      gray-panda
      flex ml-2 select-none z-10
      hover:opacity-0
      `}
            // [&+.color-panda]:active:brightness-75
          >
            <Image
              alt="a slate panda emoji, used to signify the merge, as pandas are a merge of black and white colors"
              height={21}
              priority
              src={pandaSlateus as StaticImageData}
              width={21}
            />
          </div>
          <div className={`color-panda absolute top-0 ml-2 select-none`}>
            <Image
              alt="a panda emoji, used to signify the merge, as pandas are a merge of black and white colors"
              height={21}
              src={pandaOwn as StaticImageData}
              width={21}
            />
          </div>
        </div>
        <div className="w-full relative">
          <div className="w-full h-4 bg-slateus-600 rounded-full"></div>
          <div
            className={`
              absolute
              left-0 top-0 h-4 rounded-full
              bg-gradient-to-r from-cyan-300 to-indigo-500
            `}
            style={{ right: `${(1 - (progress ?? 0)) * 100}%` }}
          ></div>
          <div
            className={`
              absolute
              blur-[3px]
              left-0 top-0 h-4 rounded-full
              animate-[pulse_4s_ease-in-out_infinite]
              bg-gradient-to-r from-cyan-300 to-indigo-500
            `}
            style={{ right: `${(1 - (progress ?? 0)) * 100}%` }}
          ></div>
        </div>
        <QuantifyText className="w-full text-center text-lg">
          {`${Format.formatPercentTwoDecimals(progress ?? 0)} of TTD`}
        </QuantifyText>
      </div>
    </WidgetBackground>
  </WidgetErrorBoundary>
);

export default TotalDifficultyProgressWidget;
