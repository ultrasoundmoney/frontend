import { FC, useEffect, useState } from "react";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../../components/WidgetSubcomponents";
import type { DateTimeString } from "../../../time";
import scrollbarStyles from "../../../styles/Scrollbar.module.scss";
import BodyTextV2 from "../../../components/TextsNext/BodyTextV2";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import { formatDistance } from "../../../format";
import SkeletonText from "../../../components/TextsNext/SkeletonText";

type Props = {
  transactions: Array<{
    category: string;
    hash: string;
    inclusion: DateTimeString | undefined;
    took: number;
  }>;
};

const CensoredTransactionsWidget: FC<Props> = ({ transactions }) => {
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
                      : formatDistance(now, new Date(inclusion))}
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

export default CensoredTransactionsWidget;
