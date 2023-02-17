import type { FC } from "react";

import type { Builder } from "../../types";
import * as Format from "../../../format";
import scrollbarStyles from "../../../styles/Scrollbar.module.scss";
import { BaseText } from "../../../components/Texts";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../../components/WidgetSubcomponents";
import SpanMoji from "../../../components/SpanMoji";

import builderAliases from "./builders";

const aggregateBuilderBlockCounts = (
  builders: Array<Builder>,
): Array<Builder> => {
  const aggregatedCounts = builders.reduce(
    (acc: Record<string, number>, b: Builder) => {
      const key = b.extraData as keyof typeof builderAliases;
      const alias: string | undefined = builderAliases[key];
      return alias
        ? { ...acc, [alias]: (acc[alias] || 0) + b.blockCount }
        : { ...acc, [b.extraData]: (acc[b.extraData] || 0) + b.blockCount };
    },
    {},
  );

  return Object.entries(aggregatedCounts).map(
    ([k, v]): Builder => ({ extraData: k, blockCount: v }),
  );
};

const emojiMap = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

type Props = { payloadCount: number; topBuilders: Array<Builder> };

const TopBuildersWidget: FC<Props> = ({ payloadCount, topBuilders }) => {
  const builders = aggregateBuilderBlockCounts(topBuilders).sort(
    (a, b) => b.blockCount - a.blockCount,
  );

  return (
    <WidgetBackground>
      <div className="flex flex-col justify-between">
        <WidgetTitle>top builders</WidgetTitle>
        <div
          className={`
            mt-4 -mr-3 flex
            h-60 flex-col
            gap-y-6
            overflow-y-auto md:h-64
            ${scrollbarStyles["styled-scrollbar-vertical"]}
            ${scrollbarStyles["styled-scrollbar"]}
          `}
        >
          {builders.map(({ extraData, blockCount }, index) => {
            const blockPercentage = Format.formatPercentOneDecimal(
              blockCount / payloadCount,
            );

            return (
              <div key={index} className="flex flex-col gap-y-1 pr-2">
                <div className="flex w-full justify-between font-light">
                  <span className="font-roboto text-xl text-white lg:text-2xl">
                    {extraData === "" ? `""` : extraData}
                  </span>
                  <SpanMoji
                    className="select-none text-2xl md:text-3xl"
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    emoji={emojiMap[index]!}
                  />
                </div>
                <div className="flex justify-between">
                  <span
                    className={`
                        md:text-md font-roboto text-sm font-light
                        text-slateus-200 lg:text-lg
                     `}
                  >
                    {Format.formatZeroDecimals(blockCount)}
                    <span className="font-inter">&nbsp;</span>
                    <span className="text-slateus-400">blocks</span>
                  </span>
                  <BaseText
                    className="text-md md:text-lg lg:text-xl"
                    font="font-roboto"
                    size="text-base"
                  >
                    <span>{blockPercentage}</span>
                  </BaseText>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </WidgetBackground>
  );
};

export default TopBuildersWidget;
