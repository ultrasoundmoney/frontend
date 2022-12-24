import type { FC } from "react";

import type { Payload } from "../../types";
import * as Format from "../../../format";
import { getEtherscanUrl } from "../../config";
import scrollbarStyles from "../../../styles/Scrollbar.module.scss";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../../components/WidgetSubcomponents";
import { BaseText } from "../../../components/Texts";
import SpanMoji from "../../../components/SpanMoji";

const etherscanUrl = getEtherscanUrl();

const emojiMap = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

type Props = { topBlocks: Array<Payload> };

const TopBlocksWidget: FC<Props> = ({ topBlocks }) => {
  return (
    <WidgetBackground>
      <div className="flex flex-col justify-between">
        <WidgetTitle>top blocks</WidgetTitle>
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
          {topBlocks.map(({ insertedAt, blockNumber, value }, index) => {
            const age = Format.formatDistance(new Date(), insertedAt);
            const blockUrl = `${etherscanUrl}/block/${blockNumber}`;

            return (
              <a
                key={blockNumber}
                href={blockUrl}
                target="_blank"
                rel="noreferrer"
                className="flex cursor-pointer flex-col gap-y-1 pr-2 hover:opacity-60"
              >
                <div className="flex w-full justify-between font-light">
                  <span className="font-roboto text-xl text-white lg:text-2xl">
                    {Format.formatBlockNumber(blockNumber)}
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
                        text-slateus-400 hover:opacity-60 lg:text-lg
                     `}
                  >
                    {`${age} ago`}
                  </span>
                  <BaseText
                    className="text-md md:text-lg lg:text-xl"
                    font="font-roboto"
                    size="text-base"
                  >
                    <span>{Format.formatTwoDigit(value)}</span>
                    <span className="font-inter">&thinsp;</span>
                    <span className="font-roboto font-extralight text-slateus-200">
                      ETH
                    </span>
                  </BaseText>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </WidgetBackground>
  );
};

export default TopBlocksWidget;
