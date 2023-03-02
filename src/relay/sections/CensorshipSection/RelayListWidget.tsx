import type { FC } from "react";
import BodyTextV3 from "../../../components/TextsNext/BodyTextV3";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../../components/WidgetSubcomponents";
import { formatPercentOneDecimal } from "../../../format";
import StyledList from "../../components/StyledList";

type Relay = {
  censoring: boolean;
  description?: string;
  dominance: number;
  name: string;
};

type Api = {
  relays_per_time_frame: Record<"d1", Relay[]>;
};

const api: Api = {
  relays_per_time_frame: {
    d1: [
      {
        censoring: true,
        dominance: 0.399,
        name: "Flashbots",
      },
      {
        censoring: false,
        dominance: 0.215,
        name: "ultra sound",
      },
      {
        censoring: false,
        dominance: 0.179,
        name: "bloXroute",
        description: "max profit",
      },
      {
        censoring: true,
        dominance: 0.094,
        name: "Blocknative",
      },
      {
        censoring: false,
        dominance: 0.065,
        name: "Agnostic",
      },
      {
        censoring: false,
        dominance: 0.04,
        name: "relay 1",
      },
      {
        censoring: true,
        dominance: 0.04,
        name: "relay 2",
      },
      {
        censoring: false,
        dominance: 0.04,
        name: "relay 3",
      },
    ],
  },
};

type Props = {
  timeFrame: "d1";
};

const RelayListWidget: FC<Props> = ({ timeFrame }) => {
  const relays = api.relays_per_time_frame[timeFrame];

  return (
    <WidgetBackground>
      <div className="flex flex-col gap-y-4">
        <div className="grid grid-cols-3 md:grid-cols-4">
          <WidgetTitle className="md:col-span-2">relay</WidgetTitle>
          <WidgetTitle className="text-right">censoring</WidgetTitle>
          <WidgetTitle className="text-right">dominance</WidgetTitle>
        </div>
        <StyledList height="h-[182px]">
          {relays.map(({ name, censoring, dominance, description }) => (
            <li
              key={`${name}${description ?? ""}`}
              className="grid grid-cols-3 hover:opacity-60 md:grid-cols-4"
            >
              <div className="col-span-1 md:col-span-2">
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
                color={censoring ? "text-white" : "text-emerald-400"}
              >
                {censoring ? "yes" : "no"}
              </BodyTextV3>
              <QuantifyText className="text-right" size="text-sm md:text-base">
                {formatPercentOneDecimal(dominance)}
              </QuantifyText>
            </li>
          ))}
        </StyledList>
      </div>
    </WidgetBackground>
  );
};

export default RelayListWidget;
