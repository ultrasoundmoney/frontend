import { formatDuration, intervalToDuration, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useMergeStatus } from "../../api/merge-status";
import pandaOwn from "../../assets/panda-own.svg";
import StyledLink from "../StyledLink";
import { LabelUnitText } from "../Texts";
import LabelText from "../TextsNext/LabelText";
import WidgetErrorBoundary from "../WidgetErrorBoundary";
import { WidgetBackground } from "../WidgetSubcomponents";

type Props = {
  /** a fraction between 0 and 1 */
  progress: number | undefined;
};

const TotalDifficultyProgressWidget: FC<Props> = ({ progress }) => {
  const mergeStatus = useMergeStatus();
  const [mergedDate, setMergedDate] = useState<string>();

  const mergeDate = formatInTimeZone(
    parseISO(mergeStatus.timestamp),
    "UTC",
    "MMM d, h:mm:ss",
  );

  useEffect(() => {
    const formattedAgo = formatDuration(
      intervalToDuration({
        start: parseISO(mergeStatus.timestamp),
        end: new Date(),
      }),
    )
      .split(" ")
      .slice(0, 2)
      .join(" ");

    setMergedDate(formattedAgo);
  }, [mergeStatus]);

  return (
    <WidgetErrorBoundary title="merge difficulty progress">
      <WidgetBackground className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <div className="flex min-h-[21px] items-center">
            <LabelText>merged </LabelText>
            <StyledLink
              className="flex"
              href="https://etherscan.io/block/15537394"
            >
              <LabelText
                color="text-slateus-100"
                className="ml-1"
              >{`${mergeDate} UTC`}</LabelText>
            </StyledLink>
          </div>
          <div className="flex select-none items-center">
            <Image
              alt="a panda emoji, used to signify the merge, as pandas are a merge of black and white colors"
              height={21}
              src={pandaOwn as StaticImageData}
              width={21}
            />
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-y-4">
          <div className="relative w-full">
            <div className="h-2 w-full rounded-full bg-slateus-600"></div>
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
        <div className="flex flex-col items-baseline justify-between gap-x-1 gap-y-2 md:flex-row">
          <div className="flex items-baseline gap-x-1">
            <LabelUnitText className="text-slateus-200">100%</LabelUnitText>
            <LabelText color="text-slateus-400">{` of TTD`}</LabelText>
          </div>
          <LabelText color="text-slateus-400">
            merged <span className="text-slateus-200">{mergedDate}</span> ago
          </LabelText>
        </div>
      </WidgetBackground>
    </WidgetErrorBoundary>
  );
};

export default TotalDifficultyProgressWidget;
