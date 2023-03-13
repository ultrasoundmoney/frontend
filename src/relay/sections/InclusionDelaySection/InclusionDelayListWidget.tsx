import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../../components/WidgetSubcomponents";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import { formatTimeDistanceToNow } from "../../../format";
import SkeletonText from "../../../components/TextsNext/SkeletonText";
import type { SuboptimalTransaction } from "./SuboptimalInclusionsWidget";
import BodyTextV3 from "../../../components/TextsNext/BodyTextV3";
import StyledOverflowList from "../../components/StyledOverflowList";

const reasonNameMap: Record<string, string> = {
  lowbasefee: "low fee",
  likely_insufficient_balance: "low balance",
};

const gridSpacing = `
  grid
  grid-cols-[95px_70px_75px]
  sm:grid-cols-[90px_70px_120px_88px]
  justify-between
`;

type Props = {
  transactions: SuboptimalTransaction[];
};

const TransactionInclusionDelayWidget: FC<Props> = ({ transactions }) => {
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
          <WidgetTitle>transaction</WidgetTitle>
          <WidgetTitle className="hidden text-right sm:block">took</WidgetTitle>
          <WidgetTitle className="text-right">category</WidgetTitle>
          <WidgetTitle className="text-right">inclusion</WidgetTitle>
        </div>
        <StyledOverflowList height="h-[182px]">
          {transactions.map(
            ({ transactionHash, delay, mined, reason, blockDelay }) => (
              <a
                key={transactionHash}
                target="_blank"
                rel="noreferrer"
                href={`https://etherscan.io/tx/${transactionHash}`}
              >
                <li className={`${gridSpacing} hover:brightness-90`}>
                  <QuantifyText
                    color="text-slateus-100"
                    lineHeight="leading-[24px]"
                    size="text-sm md:text-base"
                    unitPostfix="blocks"
                  >
                    {blockDelay}
                  </QuantifyText>
                  <QuantifyText
                    className="hidden mr-1 text-right sm:block"
                    lineHeight="leading-[24px]"
                    size="text-sm md:text-base"
                  >
                    {delay}s
                  </QuantifyText>
                  <BodyTextV3 className="text-right" color="text-slateus-100">
                    {reasonNameMap[reason] ?? reason}
                  </BodyTextV3>
                  <QuantifyText
                    className="text-right"
                    lineHeight="leading-[24px]"
                    size="text-sm md:text-base"
                    unitPostfix="ago"
                    unitPostfixColor="text-slateus-100"
                  >
                    <SkeletonText>
                      {now === undefined
                        ? undefined
                        : mined === undefined
                        ? "pending"
                        : formatTimeDistanceToNow(now, new Date(mined))}
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

export default TransactionInclusionDelayWidget;
