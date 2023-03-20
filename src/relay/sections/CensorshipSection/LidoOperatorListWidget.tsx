// List of lido operators and how much they censor.
// Table columns have been fine-tuned to show max content across screen sizes.
import type { FC } from "react";
import DefaultLink from "../../../components/DefaultLink";
import BodyTextV3 from "../../../components/TextsNext/BodyTextV3";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../../components/WidgetSubcomponents";
import { formatPercentOneDecimal } from "../../../format";
import StyledOverflowList from "../../components/StyledOverflowList";
import type { LidoOperatorCensorship } from "./LidoOperatorCensorshipWidget";

type Props = {
  lidoOperatorCensorship: LidoOperatorCensorship;
};

const gridSpacing = `
  grid
  grid-cols-[auto_70px_90px]
  sm:grid-cols-[auto_70px_120px_88px]
  gap-x-1
  sm:gap-x-8
  lg:gap-x-1
  xl:gap-x-2
  2xl:gap-x-8
`;

const LidoOperatorListWidget: FC<Props> = ({ lidoOperatorCensorship }) => (
  <WidgetBackground>
    <div className="flex flex-col gap-y-4">
      <div className={gridSpacing}>
        <WidgetTitle className="">operator</WidgetTitle>
        <WidgetTitle className="text-right">censors</WidgetTitle>
        <WidgetTitle className="hidden text-right sm:block">
          non-censoring
        </WidgetTitle>
        <WidgetTitle className="text-right">dominance</WidgetTitle>
      </div>
      <StyledOverflowList height="h-[182px]">
        {lidoOperatorCensorship.operators.map(
          ({
            name,
            id,
            censors,
            dominance,
            description,
            non_censoring_relays_connected_count,
            url,
          }) => (
            <li key={id} className={`hover:brightness-75 ${gridSpacing}`}>
              <DefaultLink className="truncate" href={url ?? undefined}>
                <BodyTextV3>{name}</BodyTextV3>
                <BodyTextV3
                  className={`
                    hidden
                    ${description !== undefined ? "sm:inline" : ""}
                  `}
                  color="text-slateus-200"
                >
                  {" "}
                  {description}
                </BodyTextV3>
              </DefaultLink>
              <BodyTextV3
                className="text-right"
                color={censors ? "text-red-400" : "text-green-400"}
              >
                {censors ? "yes" : "no"}
              </BodyTextV3>
              <QuantifyText
                className="hidden text-right sm:inline"
                unitPostfix="relays"
                unitPostfixColor="text-slateus-200"
              >{`${non_censoring_relays_connected_count}/${lidoOperatorCensorship.non_censoring_relays_count}`}</QuantifyText>
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

export default LidoOperatorListWidget;
