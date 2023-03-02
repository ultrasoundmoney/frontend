import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../../components/WidgetSubcomponents";
import type { DateTimeString } from "../../../time";
import scrollbarStyles from "../../../styles/Scrollbar.module.scss";
import BodyTextV2 from "../../../components/TextsNext/BodyTextV2";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import { formatTimeDistance } from "../../../format";
import SkeletonText from "../../../components/TextsNext/SkeletonText";

type Transaction = {
  category: string;
  hash: string;
  inclusion: DateTimeString | undefined;
  took: number;
};

type Api = { transactions: Transaction[] };

const api: Api = {
  transactions: [
    {
      category: "OFAC",
      hash: "0xf450",
      inclusion: "2023-02-22T07:00:00Z",
      took: 32,
    },
    {
      category: "congestion",
      hash: "0xa2d0",
      inclusion: "2023-02-22T06:00:00Z",
      took: 46,
    },
    {
      category: "unknown",
      hash: "0x2ba2",
      inclusion: "2023-02-22T05:00:00Z",
      took: 103,
    },
    {
      category: "OFAC",
      hash: "0x55bf",
      inclusion: "2023-02-22T04:00:00Z",
      took: 37,
    },
  ],
};

const TransactionInclusionDelayWidget: FC = () => {
  const [now, setNow] = useState<Date | undefined>();

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const transactions = api.transactions;

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
          {transactions.map(({ hash, inclusion, category, took }) => (
            <a key={hash} target="_blank" rel="noreferrer" href={undefined}>
              <li className="grid grid-cols-4 hover:opacity-60">
                <QuantifyText color="text-slateus-100">{hash}</QuantifyText>
                <QuantifyText className="mr-1 text-right">{took}</QuantifyText>
                <BodyTextV2 className="text-right" color="text-slateus-100">
                  {category}
                </BodyTextV2>
                <QuantifyText
                  className="text-right"
                  unitPostfix="ago"
                  unitPostfixColor="text-slateus-100"
                >
                  <SkeletonText>
                    {now === undefined
                      ? undefined
                      : inclusion === undefined
                      ? "pending"
                      : formatTimeDistance(now, new Date(inclusion))}
                  </SkeletonText>
                </QuantifyText>
              </li>
            </a>
          ))}
        </ul>
      </div>
    </WidgetBackground>
  );
};

export default TransactionInclusionDelayWidget;
