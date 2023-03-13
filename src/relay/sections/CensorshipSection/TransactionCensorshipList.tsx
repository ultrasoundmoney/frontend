import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../../components/WidgetSubcomponents";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import { formatTimeDistance } from "../../../format";
import SkeletonText from "../../../components/TextsNext/SkeletonText";
import StyledList from "../../components/StyledList";
import BodyTextV3 from "../../../components/TextsNext/BodyTextV3";
import type { TimeFrame } from "../../../mainsite/time-frames";
import type { CensoredTransaction } from "../../censorship-data/transaction_censorship";

type Props = {
  transactions: CensoredTransaction[];
  timeFrame: TimeFrame;
};

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
        <div className="grid grid-cols-4 gap-x-1">
          <WidgetTitle>tx delay</WidgetTitle>
          <WidgetTitle className="truncate text-right">took</WidgetTitle>
          <WidgetTitle className="-mr-1 truncate text-right">
            category
          </WidgetTitle>
          <WidgetTitle className="-mr-1 truncate text-right">
            inclusion
          </WidgetTitle>
        </div>
        <StyledList height="h-[182px]">
          {transactions.map(
            ({
              inclusion,
              sanction_list,
              took,
              transaction_delay,
              transaction_hash,
            }) => (
              <a
                key={transaction_hash}
                target="_blank"
                rel="noreferrer"
                href={`https://etherscan.io/tx/${transaction_hash}`}
              >
                <li className="grid grid-cols-4 items-baseline hover:opacity-60">
                  <QuantifyText
                    color="text-white"
                    unitPostfix="block"
                    unitPostfixColor="text-slateus-100"
                    size="text-sm md:text-base"
                  >
                    {transaction_delay}
                  </QuantifyText>
                  <QuantifyText
                    className="mr-1 text-right"
                    size="text-sm md:text-base"
                  >
                    {took}s
                  </QuantifyText>
                  <BodyTextV3 className="text-right" color="text-slateus-100">
                    {sanction_list}
                  </BodyTextV3>
                  <QuantifyText
                    className="text-right"
                    unitPostfix={inclusion === undefined ? "pending" : "ago"}
                    unitPostfixColor="text-slateus-100"
                    size="text-sm md:text-base"
                  >
                    <SkeletonText>
                      {now === undefined
                        ? undefined
                        : inclusion === undefined
                        ? ""
                        : formatTimeDistance(now, new Date(inclusion))}
                    </SkeletonText>
                  </QuantifyText>
                </li>
              </a>
            ),
          )}
        </StyledList>
      </div>
    </WidgetBackground>
  );
};

export default TransactionCensorshipList;
