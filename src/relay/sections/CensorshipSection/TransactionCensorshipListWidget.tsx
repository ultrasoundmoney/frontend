import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../../components/WidgetSubcomponents";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import { formatDurationToNow, formatZeroDecimals } from "../../../format";
import SkeletonText from "../../../components/TextsNext/SkeletonText";
import StyledOverflowList from "../../components/StyledOverflowList";
import BodyTextV3 from "../../../components/TextsNext/BodyTextV3";
import type { TimeFrame } from "../../../mainsite/time-frames";
import type { CensoredTransaction } from "./TransactionCensorshipWidget";

type Props = {
  onClickTimeFrame: OnClick;
  transactions: CensoredTransaction[];
  timeFrame: TimeFrame;
};

const gridSpacing = `
  grid
  grid-cols-[80px_80px_90px]
  sm:grid-cols-[90px_70px_120px_88px]
  justify-between
`;

const TransactionCensorshipList: FC<Props> = ({ transactions }) => {
  const [now, setNow] = useState<Date | undefined>();

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <WidgetBackground>
      <div className="flex flex-col gap-y-4">
        <div className={gridSpacing}>
          <WidgetTitle>tx delay</WidgetTitle>
          <WidgetTitle className="hidden text-right sm:block">took</WidgetTitle>
          <WidgetTitle className="-mr-1 text-right truncate">
            sanctions list
          </WidgetTitle>
          <WidgetTitle className="-mr-1 text-right truncate">
            inclusion
          </WidgetTitle>
        </div>
        <StyledOverflowList height="h-[182px]">
          {transactions.map(
            ({
              delayBlocks,
              hash,
              inclusion,
              sanctionsListName,
              tookSeconds,
            }) => (
              <a
                key={hash}
                target="_blank"
                rel="noreferrer"
                href={`https://etherscan.io/tx/${hash}`}
              >
                <li
                  className={`
                    items-baseline hover:brightness-75
                    ${gridSpacing}
                  `}
                >
                  <QuantifyText
                    color="text-white"
                    lineHeight="leading-[24px]"
                    size="text-sm md:text-base"
                    unitPostfix="block"
                    unitPostfixColor="text-slateus-100"
                  >
                    {delayBlocks}
                  </QuantifyText>
                  <QuantifyText
                    className="hidden text-right sm:block"
                    lineHeight="leading-[24px]"
                    size="text-sm md:text-base"
                  >
                    {formatZeroDecimals(tookSeconds)}s
                  </QuantifyText>
                  <BodyTextV3 className="text-right" color="text-slateus-100">
                    {sanctionsListName}
                  </BodyTextV3>
                  <QuantifyText
                    className="text-right"
                    lineHeight="leading-[24px]"
                    size="text-sm md:text-base"
                    unitPostfix={inclusion === undefined ? "pending" : "ago"}
                    unitPostfixColor="text-slateus-100"
                  >
                    <SkeletonText inline>
                      {now === undefined
                        ? undefined
                        : inclusion === undefined
                        ? ""
                        : formatDurationToNow(now, new Date(inclusion))}
                    </SkeletonText>
                  </QuantifyText>
                </li>
              </a>
            ),
          )}
        </StyledOverflowList>
      </div>
    </WidgetBackground>
  );
};

export default TransactionCensorshipList;
