import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../../components/WidgetSubcomponents";
import type { DateTimeString } from "../../../time";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import { formatTimeDistance } from "../../../format";
import SkeletonText from "../../../components/TextsNext/SkeletonText";
import StyledList from "../../components/StyledList";
import BodyTextV3 from "../../../components/TextsNext/BodyTextV3";

type Transaction = {
  block_count: number;
  category: string;
  hash: string;
  inclusion: DateTimeString | undefined;
  took: number;
};

type Api = { transactions_per_time_frame: Record<"d1", Transaction[]> };

const api: Api = {
  transactions_per_time_frame: {
    d1: [
      {
        hash: "0x123",
        category: "OFAC",
        block_count: 3,
        inclusion: undefined,
        took: 32,
      },
      {
        hash: "0x456",
        category: "congestion",
        block_count: 5,
        inclusion: "2023-02-22T06:00:00Z",
        took: 46,
      },
      {
        hash: "0x789",
        category: "unknown",
        block_count: 8,
        inclusion: "2023-02-22T05:00:00Z",
        took: 103,
      },
      {
        hash: "0xabc",
        category: "OFAC",
        block_count: 3,
        inclusion: "2023-02-22T04:00:00Z",
        took: 37,
      },
      {
        hash: "0xdef",
        category: "congestion",
        block_count: 1,
        inclusion: "2023-02-22T03:00:00Z",
        took: 12,
      },
      {
        hash: "0xghi",
        category: "unknown",
        block_count: 2,
        inclusion: "2023-02-22T02:00:00Z",
        took: 23,
      },
    ],
  },
};

type Props = {
  timeFrame: "d1";
};

const TransactionCensorshipList: FC<Props> = ({ timeFrame }) => {
  const [now, setNow] = useState<Date | undefined>();

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const transactions = api.transactions_per_time_frame[timeFrame];

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
            ({ hash, block_count, inclusion, category, took }) => (
              <a key={hash} target="_blank" rel="noreferrer" href={undefined}>
                <li className="grid grid-cols-4 items-baseline hover:opacity-60">
                  <QuantifyText
                    color="text-white"
                    unitPostfix="block"
                    unitPostfixColor="text-slateus-100"
                    size="text-sm md:text-base"
                  >
                    {block_count}
                  </QuantifyText>
                  <QuantifyText
                    className="mr-1 text-right"
                    size="text-sm md:text-base"
                  >
                    {took}s
                  </QuantifyText>
                  <BodyTextV3 className="text-right" color="text-slateus-100">
                    {category}
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
