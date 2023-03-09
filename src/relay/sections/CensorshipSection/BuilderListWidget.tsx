import type { FC } from "react";
import BodyTextV3 from "../../../components/TextsNext/BodyTextV3";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../../components/WidgetSubcomponents";
import { formatPercentOneDecimal } from "../../../format";
import StyledList from "../../components/StyledList";
import type { Builder } from "./BuilderCensorshipWidget";

type Props = {
  builders: Builder[];
};

const BuilderListWidget: FC<Props> = ({ builders }) => {
  return (
    <WidgetBackground>
      <div className="flex flex-col gap-y-4">
        <div className="grid grid-cols-3 md:grid-cols-4">
          <WidgetTitle>builder</WidgetTitle>
          <WidgetTitle className="text-right">censoring</WidgetTitle>
          <WidgetTitle className="hidden text-right md:inline">
            pubkeys
          </WidgetTitle>
          <WidgetTitle className="text-right">dominance</WidgetTitle>
        </div>
        <StyledList height="h-[182px]">
          {builders.map(
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
                className="grid grid-cols-3 hover:opacity-60 md:grid-cols-4"
              >
                <div className="">
                  <BodyTextV3>{name}</BodyTextV3>
                  {description !== undefined && (
                    <BodyTextV3
                      className="hidden md:inline"
                      color="text-slateus-400"
                    >
                      {" "}
                      {description}
                    </BodyTextV3>
                  )}
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
                  className="hidden text-right md:inline"
                  size="text-sm md:text-base"
                >
                  {`${censoringPubkeys}/${totalPubkeys}`}
                </QuantifyText>
                <QuantifyText
                  className="text-right"
                  size="text-sm md:text-base"
                >
                  {formatPercentOneDecimal(dominance)}
                </QuantifyText>
              </li>
            ),
          )}
        </StyledList>
      </div>
    </WidgetBackground>
  );
};

export default BuilderListWidget;
