// List of builders and how much they censor.
// Table columns have been fine-tuned to show max content across screen sizes.
import type { FC } from "react";
import BodyTextV3 from "../../../components/TextsNext/BodyTextV3";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../../components/WidgetSubcomponents";
import { formatPercentOneDecimal } from "../../../format";
import type { RNEA } from "../../../fp";
import { O } from "../../../fp";
import StyledOverflowList from "../../components/StyledOverflowList";
import type { BuilderGroup } from "./BuilderCensorshipWidget";

type Props = {
  builderGroups: RNEA.ReadonlyNonEmptyArray<BuilderGroup>;
};

const gridSpacing = `
  grid
  grid-cols-[auto_70px_90px]
  sm:grid-cols-[auto_70px_70px_88px]
  gap-x-1
  sm:gap-x-8
  lg:gap-x-1
  xl:gap-x-2
  2xl:gap-x-8
`;

const BuilderListWidget: FC<Props> = ({ builderGroups }) => (
  <WidgetBackground>
    <div className="flex flex-col gap-y-4">
      <div className={gridSpacing}>
        <WidgetTitle>builder</WidgetTitle>
        <WidgetTitle className="text-right">censors</WidgetTitle>
        <WidgetTitle className="hidden text-right sm:inline">
          pubkeys
        </WidgetTitle>
        <WidgetTitle className="text-right">dominance</WidgetTitle>
      </div>
      <StyledOverflowList height="h-[182px]">
        {builderGroups.map(
          ({
            id,
            name,
            censors,
            dominance,
            description,
            censoringPubkeys,
            totalPubkeys,
          }) => (
            <li
              key={id}
              className={`items-baseline hover:brightness-75 ${gridSpacing}`}
            >
              <div className="truncate">
                <BodyTextV3>{name}</BodyTextV3>
                <BodyTextV3
                  className={`
                    hidden
                    ${O.isSome(description) ? "sm:inline" : ""}
                  `}
                  color="text-slateus-400"
                >
                  <> {O.getOrElse(() => "")(description)}</>
                </BodyTextV3>
              </div>
              <BodyTextV3
                className="text-right"
                color={
                  censors === "partially"
                    ? "text-blue-400"
                    : censors === "fully"
                    ? "text-red-400"
                    : "text-green-400"
                }
              >
                {censors}
              </BodyTextV3>
              <QuantifyText
                className="hidden text-right sm:inline"
                size="text-sm sm:text-base"
              >
                {`${censoringPubkeys}/${totalPubkeys}`}
              </QuantifyText>
              <QuantifyText className="text-right" size="text-sm sm:text-base">
                {formatPercentOneDecimal(dominance)}
              </QuantifyText>
            </li>
          ),
        )}
      </StyledOverflowList>
    </div>
  </WidgetBackground>
);

export default BuilderListWidget;
