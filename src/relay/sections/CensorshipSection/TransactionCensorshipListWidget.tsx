import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../../components/WidgetSubcomponents";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import { formatTimeDistanceToNow, formatZeroDecimals } from "../../../format";
import SkeletonText from "../../../components/TextsNext/SkeletonText";
import StyledOverflowList from "../../components/StyledOverflowList";
import BodyTextV3 from "../../../components/TextsNext/BodyTextV3";
import type { TimeFrame } from "../../../mainsite/time-frames";
import type { CensoredTransaction } from "../../censorship-data/transaction_censorship";

type Props = {
  onClickTimeFrame: () => void;
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
          <WidgetTitle className="hidden text-right md:block">took</WidgetTitle>
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
              inclusion,
              sanctionsListName,
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
                <li className={`hover:brightness-75 ${gridSpacing}`}>
                  <QuantifyText
                    color="text-white"
                    unitPostfix="block"
                    unitPostfixColor="text-slateus-100"
                    size="text-sm md:text-base"
                  >
                    {transaction_delay}
                  </QuantifyText>
                  <QuantifyText
                    className="hidden text-right md:block"
                    size="text-sm md:text-base"
                  >
                    {formatZeroDecimals(took)}s
                  </QuantifyText>
                  <BodyTextV3 className="text-right" color="text-slateus-100">
                    {sanctionsListName}
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
                        : formatTimeDistanceToNow(now, new Date(inclusion))}
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
