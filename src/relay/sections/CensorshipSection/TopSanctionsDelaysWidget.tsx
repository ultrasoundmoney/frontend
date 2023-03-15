import type { FC } from "react";
import type { TimeFrame } from "../../../mainsite/time-frames";
import WidgetBase from "../../components/WidgetBase";
import medal1 from "../../../assets/medal-1-own.svg";
import medal2 from "../../../assets/medal-2-own.svg";
import medal3 from "../../../assets/medal-3-own.svg";
import number4 from "../../../assets/number-4-own.svg";
import number5 from "../../../assets/number-5-own.svg";
import number6 from "../../../assets/number-6-own.svg";
import number7 from "../../../assets/number-7-own.svg";
import number8 from "../../../assets/number-8-own.svg";
import number9 from "../../../assets/number-9-own.svg";
import number10 from "../../../assets/number-10-own.svg";
import type { StaticImageData } from "next/image";
import type { CensoredTransaction } from "./TransactionCensorshipWidget";
import StyledOverflowList from "../../components/StyledOverflowList";
import Image from "next/image";
import { formatDuration, formatZeroDecimals } from "../../../format";
import questionMark from "../../../assets/question-mark-own.svg";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import BodyTextV3 from "../../../components/TextsNext/BodyTextV3";

const emojiMap: StaticImageData[] = [
  medal1 as StaticImageData,
  medal2 as StaticImageData,
  medal3 as StaticImageData,
  number4 as StaticImageData,
  number5 as StaticImageData,
  number6 as StaticImageData,
  number7 as StaticImageData,
  number8 as StaticImageData,
  number9 as StaticImageData,
  number10 as StaticImageData,
];

type Props = {
  onClickTimeFrame: () => void;
  topDelays: CensoredTransaction[];
  timeFrame: TimeFrame;
};

const TopSanctionsDelaysWidget: FC<Props> = ({
  onClickTimeFrame,
  topDelays: topTransactionDelays,
  timeFrame,
}) => {
  return (
    <WidgetBase
      onClickTimeFrame={onClickTimeFrame}
      title="top sactions delay"
      timeFrame={timeFrame}
      hideTimeFrameLabel
    >
      <StyledOverflowList height="h-[199px] sm:h-[206px] xl:h-[218px]">
        {topTransactionDelays.map((transaction, index) => {
          const durationFormatted = formatDuration(
            transaction.tookSeconds,
            true,
          );
          const durationNum = Number(durationFormatted.split(" ")[0]);
          const durationUnit = durationFormatted.split(" ")[1];
          return (
            <div key={transaction.hash} className="flex flex-col">
              <div className="flex justify-between items-center w-full">
                <QuantifyText
                  className=""
                  size="text-2xl sm:text-3xl xl:text-4xl"
                  unitPostfix={durationUnit}
                  unitPostfixColor="text-slateus-200"
                  unitPostfixMargin="ml-4"
                >
                  {durationNum}
                </QuantifyText>
                <Image
                  src={emojiMap[index] ?? (questionMark as StaticImageData)}
                  alt="emoji"
                  className="mr-2"
                  width={30}
                  height={30}
                />
              </div>
              <div className="flex flex-row justify-between items-center">
                <div className="mr-2 text-xs text-gray-500">
                  <QuantifyText
                    className=""
                    size="text-sm sm:text-base"
                    unitPostfixColor="text-slateus-200"
                    unitPostfixMargin="ml-2"
                    unitPostfix="blocks"
                  >
                    {formatZeroDecimals(transaction.delayBlocks)}
                  </QuantifyText>
                </div>
                <BodyTextV3 className="text-white" size="text-sm sm:text-base">
                  {transaction.sanctionsListName}
                </BodyTextV3>
              </div>
            </div>
          );
        })}
      </StyledOverflowList>
    </WidgetBase>
  );
};

export default TopSanctionsDelaysWidget;
