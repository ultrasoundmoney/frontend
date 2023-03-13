import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../../components/WidgetSubcomponents";
import scrollbarStyles from "../../../styles/Scrollbar.module.scss";
import BodyTextV2 from "../../../components/TextsNext/BodyTextV2";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import { formatTimeDistanceToNow } from "../../../format";
import SkeletonText from "../../../components/TextsNext/SkeletonText";
import type { SuboptimalTransaction } from "./SuboptimalInclusionsGraph";

const reasonNameMap: Record<string, string> = {
  lowbasefee: "low fee",
  likely_insufficient_balance: "low balance",
};

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
        <div className="grid grid-cols-4">
          <WidgetTitle>transaction</WidgetTitle>
          <WidgetTitle className="text-right">took</WidgetTitle>
          <WidgetTitle className="-mr-1 text-right">category</WidgetTitle>
          <WidgetTitle className="-mr-1 text-right">inclusion</WidgetTitle>
        </div>
        <ul
          className={`
            -mr-3 flex max-h-[184px]
            flex-col gap-y-4 overflow-y-auto
            pr-1 md:max-h-[214px]
            ${scrollbarStyles["styled-scrollbar-vertical"]}
            ${scrollbarStyles["styled-scrollbar"]}
          `}
        >
          {transactions.map(
            ({ transactionHash, delay, mined, reason, blockDelay }) => (
              <a
                key={transactionHash}
                target="_blank"
                rel="noreferrer"
                href={`https://etherscan.io/tx/${transactionHash}`}
              >
                <li className="grid grid-cols-4 hover:opacity-60">
                  <QuantifyText color="text-slateus-100" unitPostfix="blocks">
                    {blockDelay}
                  </QuantifyText>
                  <QuantifyText className="mr-1 text-right">
                    {delay}s
                  </QuantifyText>
                  <BodyTextV2 className="text-right" color="text-slateus-100">
                    {reasonNameMap[reason] ?? reason}
                  </BodyTextV2>
                  <QuantifyText
                    className="text-right"
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
        </ul>
      </div>
    </WidgetBackground>
  );
};

export default TransactionInclusionDelayWidget;
